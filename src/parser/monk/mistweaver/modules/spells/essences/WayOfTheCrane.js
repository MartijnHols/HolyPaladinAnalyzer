import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import Analyzer from 'parser/core/Analyzer';
import { formatNumber } from 'common/format';
import StatTracker from 'parser/shared/modules/StatTracker';
import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';

/**
 * Simple info graphic that shows what spell did what healing during wotc window, the hps of each spell, and hptc
 */

class WayOfTheCrane extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  customMap = null;
  _damageSpell = "";
  _lastTimeStamp = 0;
  _inWotc = false;
  _wotcTime = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasEssence(SPELLS.CONFLICT.traitId);
    if(!this.active){
      return;
    }
    this.active = this.selectedCombatant.hasMajor(SPELLS.CONFLICT.traitId);
    if (!this.active) {
      return;
    }
    this.customMap = new Map();
  }

  on_byPlayer_damage(event) {
    if(!this.selectedCombatant.hasBuff(SPELLS.WAY_OF_THE_CRANE.id)){
      return;
    }
    this._damageSpell = event.ability.name;
  }

  get gcd(){
    const gcd = (1500 / (1 + this.statTracker.hastePercentage(this.statTracker.currentHasteRating)))/1000;
    return Math.max(gcd, .75);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    if(spellId === SPELLS.WAY_OF_THE_CRANE_HEAL.id || spellId === SPELLS.WAY_OF_THE_CRANE_HEAL_HONOR.id){
      if(this.customMap.get(this._damageSpell)===undefined){
        const healingEvents = {
          casts: 1,
          healing: event.amount || 0,
          overheal:  event.overheal || 0,
          HPCT: (event.amount || 0) / this.gcd,
        };
        this.customMap.set(this._damageSpell, healingEvents);
      }else{
        const healingEvents = this.customMap.get(this._damageSpell);
        healingEvents.casts +=1;
        healingEvents.healing += event.amount;
        healingEvents.overheal += event.overheal||0;
        healingEvents.HPCT += (event.amount || 0)/this.gcd;//average of HPCT
        this.customMap.set(this._damageSpell, healingEvents);
      }
    }
  }

  on_byPlayer_applybuff(event){
    if(event.ability.guid !== SPELLS.WAY_OF_THE_CRANE.id){
        return;
    }
    this._inWotc = true;
    this._lastTimeStamp = event.lastTimeStamp;
  }

  on_byPlayer_removebuff(event){
    if(event.ability.guid !== SPELLS.WAY_OF_THE_CRANE.id){
      return;
    }
    this._wotcTime += 15;
    this._inWotc = false;
  }

  on_fightend(){
    if(this._inWotc === true){
      this._wotcTime += (this.selectedCombatant.fightDuration - this._lastTimeStamp)/1000;
    }
  }

  statistic() {
    const arrayOfDamageSpells = Array.from(this.customMap.keys());
    return (
      <AzeritePowerStatistic
        size="flexible"
        tooltip={(
          <ul>
          {arrayOfDamageSpells.map(spell => (
            <li>{spell} did {this.customMap.get(spell).healing} healing, {this.customMap.get(spell).overheal} overhealing in {this.customMap.get(spell).casts/3} casts.</li>
          ))}
        </ul>
        )}
      >
      <div className="pad">
        <label><SpellLink id={SPELLS.WAY_OF_THE_CRANE.id} /></label>
        <div>
          The healing done by your damaging abilities <b>during Way of the Crane</b>. That is: the HPS column doesn't count time outside of WotC.
        </div>
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Spell</th>
              <th>HPS</th>
              <th>HPCT</th>
            </tr>
          </thead>
          <tbody>
            {
              arrayOfDamageSpells.map(spell => (
                <tr>
                <td>{spell}</td>
                <td>{formatNumber(this.customMap.get(spell).healing/this._wotcTime)}</td>
                <td>{formatNumber(this.customMap.get(spell).HPCT / this.customMap.get(spell).casts)}</td>
                </tr>
              ))
            }
            </tbody>
         </table>
        </div>
      </AzeritePowerStatistic>
    );
  }

}

export default WayOfTheCrane;
