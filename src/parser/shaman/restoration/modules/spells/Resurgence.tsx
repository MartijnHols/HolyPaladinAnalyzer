import React from 'react';

import StatisticBox from 'interface/others/StatisticBox';
import { STATISTIC_ORDER } from 'interface/others/StatisticBox';

import HIT_TYPES from 'game/HIT_TYPES';
import Analyzer from 'parser/core/Analyzer';
import { EnergizeEvent, HealEvent } from 'parser/core/Events';
import ManaTracker from 'parser/core/healingEfficiency/ManaTracker';

import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatNumber, formatPercentage } from 'common/format';

const SPELLS_PROCCING_RESURGENCE = {
  [SPELLS.HEALING_SURGE_RESTORATION.id]: 0.006,
  [SPELLS.HEALING_WAVE.id]: 0.01,
  [SPELLS.CHAIN_HEAL.id]: 0.0025,
  [SPELLS.UNLEASH_LIFE_TALENT.id]: 0.006,
  [SPELLS.RIPTIDE.id]: 0.006,
};

interface ResurgenceInfo {
  spellId: number,
  resurgenceTotal: number,
  castAmount: number
}

class Resurgence extends Analyzer {
  static dependencies = {
    manaTracker: ManaTracker,
  };

  protected manaTracker!: ManaTracker;

  regenedMana = 0;
  otherManaGain = 0;
  resurgence: Array<ResurgenceInfo> = [];
  totalResurgenceGain = 0;

  on_byPlayer_heal(event: HealEvent) {
    const spellId = event.ability.guid;
    const isAbilityProccingResurgence = SPELLS_PROCCING_RESURGENCE.hasOwnProperty(spellId);

    if (!isAbilityProccingResurgence || event.tick) {
      return;
    }

    if (!this.resurgence[spellId]) {
      this.resurgence[spellId] = {
        spellId: spellId,
        resurgenceTotal: 0,
        castAmount: 0,
      };
    }

    if (event.hitType === HIT_TYPES.CRIT) {
      this.resurgence[spellId].resurgenceTotal += SPELLS_PROCCING_RESURGENCE[spellId] * this.manaTracker.maxResource;
      this.resurgence[spellId].castAmount += 1;
    }
  }

  on_toPlayer_energize(event: EnergizeEvent) {
    const spellId = event.ability.guid;

    if (spellId !== SPELLS.RESURGENCE.id) {
      this.otherManaGain += event.resourceChange;
      return;
    }

    this.totalResurgenceGain += event.resourceChange;
  }

  get totalMana() {
    this.regenedMana = ((this.owner.fightDuration / 1000) / 5) * 4000;

    return this.regenedMana + this.totalResurgenceGain + this.manaTracker.maxResource + this.otherManaGain;
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.RESURGENCE.id} />}
        position={STATISTIC_ORDER.UNIMPORTANT(90)}
        value={`${formatNumber(this.totalResurgenceGain)}`}
        label="Mana gained from Resurgence"
      >
        <div>
          <SpellLink id={SPELLS.RESURGENCE.id} iconStyle={{ height: '1.25em' }} /> accounted for {formatPercentage(this.totalResurgenceGain / this.totalMana, 0)}% of your mana pool ({formatNumber(this.totalMana)} mana).
        </div>
        <table className="table table-condensed" style={{ fontWeight: 'bold' }}>
          <thead>
            <tr>
              <th>Spell</th>
              <th>Amount</th>
              <th>Crits</th>
              <th>% of mana</th>
            </tr>
          </thead>
          <tbody>
            {
              this.resurgence
                .map(spell => (
                  <tr key={spell.spellId}>
                    <th scope="row"><SpellIcon id={spell.spellId} style={{ height: '2.5em' }} /></th>
                    <td>{formatNumber(spell.resurgenceTotal)}</td>
                    <td>{formatNumber(spell.castAmount)}</td>
                    <td>{formatPercentage(spell.resurgenceTotal / this.totalMana)}%</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </StatisticBox>
    );
  }
}

export default Resurgence;
