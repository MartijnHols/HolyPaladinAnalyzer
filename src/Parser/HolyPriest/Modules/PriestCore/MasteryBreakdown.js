import React from 'react';
import { STATISTIC_ORDER } from 'Main/StatisticBox';
import ExpandableStatisticBox from 'Main/ExpandableStatisticBox';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage, formatNumber } from 'common/format';

// dependencies
import Combatants from 'Parser/Core/Modules/Combatants';

import SPELLS from 'common/SPELLS';
import Module from 'Parser/Core/Module';
import { ABILITIES_THAT_TRIGGER_MASTERY } from '../../Constants';

class MasteryBreakdown extends Module {
  static dependencies = {
    combatants: Combatants,
  }

  _tickMode = {};
  _healVal = {};
  _maxHealVal = {};
  _masteryActive = {};
  effectiveHealDist = {};
  effectiveOverhealDist = {};
  _eHDbyPlayer = {}; // for potential future features

  healing = 0;

  effectiveHealDistPerc = [];

  on_finished() {
    // There's likely a far better way to do this, but my 2AM brain couldn't find it
    let total = 0;

    let spell;
    for (spell in this.effectiveHealDist) {
      total += this.effectiveHealDist[spell];
    }

    const eHDPerc = {};
    for (spell in this.effectiveHealDist) {
      eHDPerc[spell] = this.effectiveHealDist[spell] / total;
    }

    const eOHD = {};
    for (spell in this.effectiveHealDist) {
      eOHD[spell] = this.effectiveOverhealDist[spell] / (this.effectiveHealDist[spell] + this.effectiveOverhealDist[spell]);
    }

    // Since JS objects lack order, we need to convert our dictionary to an array
    // to allow for it be ordered for display
    const eHDPArray = Object.keys(eHDPerc).map(function(spell) {
      return [spell, eHDPerc[spell], eOHD[spell]];
    });
    eHDPArray.sort(function(o1, o2) {
      return o2[1] - o1[1];
    });

    this.effectiveHealDistPerc = eHDPArray;
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    const tId = event.targetID;
    if (spellId !== SPELLS.ECHO_OF_LIGHT.id) {
      return;
    }

    this._masteryActive[tId] = true;
  }

  on_byPlayer_removebuff(event) {
    const spellId = event.ability.guid;
    const tId = event.targetID;
    if (spellId !== SPELLS.ECHO_OF_LIGHT.id) {
      return;
    }

    this._masteryActive[tId] = false;
    this._healVal[tId] = {};
    this._maxHealVal[tId] = {};
  }

  // v = true;
  // v2 = true;
  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    const tId = event.targetID;
    if (spellId === SPELLS.ECHO_OF_LIGHT.id) {
      // logic for eol itself
      this.healing += (event.amount + (event.absorbed || 0));
      this.effectiveHealDist = this.effectiveHealDist || {};
      // this._eHDbyPlayer[tId] = this._eHDbyPlayer[tId] || {};


      const percH = (event.amount + (event.absorbed || 0)) / (event.amount + (event.absorbed || 0) + (event.overheal || 0));
      const tickMode = this._tickMode[tId];

      let spell;
      for (spell in this._healVal[tId]) {
        // For potential future Features //
        // if (spell in this._eHDbyPlayer[tId]) {
        //   this._eHDbyPlayer[tId][spell] += this._maxHealVal[tId][spell] * percOH / tickMode;
        // } else {
        //   this._eHDbyPlayer[tId][spell] = this._maxHealVal[tId][spell] * percOH / tickMode;
        // }
        // ----------------------------- //

        if (spell in this.effectiveHealDist) {
          this.effectiveHealDist[spell] += (this._maxHealVal[tId][spell]) * percH / tickMode;
          this.effectiveOverhealDist[spell] += (this._maxHealVal[tId][spell]) * (1 - percH) / tickMode;
        } else {
          this.effectiveHealDist[spell] = (this._maxHealVal[tId][spell]) * percH / tickMode;
          this.effectiveOverhealDist[spell] = (this._maxHealVal[tId][spell]) * (1 - percH) / tickMode;
        }

        this._healVal[tId][spell] -= (this._maxHealVal[tId][spell] / tickMode);

        // There's a rare issue that can cause the healVal allocation to dip to a negative value
        // I'm not sure of the cause but it seems like it is due to an incorrect tickMode
        // value. Likely something to do with events on the same timestamp (or just some bad
        // logic in this file) but the value is much more accurate with this tweak
        if (this._healVal[tId][spell] < 0) {
          this._healVal[tId][spell] = 0;
        }
      }

    } else {
      // logic for eol triggering spells
      if (ABILITIES_THAT_TRIGGER_MASTERY.indexOf(spellId) === -1) {
        return;
      }

      if(this._masteryActive[tId]) {
        this._tickMode[tId] = 3;
      } else {
        this._tickMode[tId] = 2;
      }

      if(!(tId in this._healVal)) {
        this._healVal[tId] = {};
      }

      if(!(tId in this._maxHealVal)) {
        this._maxHealVal[tId] = {};
      }

      if(!(spellId in this._healVal[tId])) {
        this._healVal[tId][spellId] = event.amount + (event.absorbed || 0) + (event.overheal || 0);
      } else {
        this._healVal[tId][spellId] += event.amount + (event.absorbed || 0) + (event.overheal || 0);
      }
      this._maxHealVal[tId][spellId] = this._healVal[tId][spellId];
    }
  }

  statistic() {
    return (
      <ExpandableStatisticBox
        icon={<SpellIcon id={SPELLS.ECHO_OF_LIGHT.id} />}
        value={`${formatNumber(this.healing)}`}
        label={(
          <dfn data-tip={`Echo of Light healing breakdown. As our mastery is often very finicky, this could end up wrong in various situations. Please report any logs that seem strange to @enragednuke on the WoWAnalyzer discord.<br/><br/>
            <strong>Please do note this is not 100% accurate.</strong> It is probably around 90% accurate. <br/><br/>
            Also, a mastery value can be more than just "healing done times mastery percent" because Echo of Light is based off raw healing. If the heal itself overheals, but the mastery does not, it can surpass that assumed "limit". Don't use this as a reason for a "strange log" unless something is absurdly higher than its effective healing.`}>
            Echo of Light
          </dfn>
        )}
      >
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Spell</th>
              <th>Amount</th>
              <th>% of Total</th>
              <th>% OH</th>
            </tr>
          </thead>
          <tbody>
            {
              this.effectiveHealDistPerc
                .map((item, index) => (
                  <tr key={index}>
                    <th scope="row"><SpellIcon id={item[0]} style={{ height: '2.4em' }}/></th>
                    <td>{ formatNumber(this.healing * item[1]) }</td>
                    <td>{ formatPercentage(this.owner.getPercentageOfTotalHealingDone(this.healing) * item[1]) }%</td>
                    <td>{ formatPercentage(item[2]) }%</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </ExpandableStatisticBox>
    );
  }

  statisticOrder = STATISTIC_ORDER.CORE(2);
}

export default MasteryBreakdown;
