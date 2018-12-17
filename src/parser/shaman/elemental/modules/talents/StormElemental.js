import React from 'react';

import SPELLS from '../../../../../common/SPELLS';
import SpellIcon from '../../../../../common/SpellIcon';
import { formatNumber, formatPercentage } from '../../../../../common/format';

import Analyzer from '../../../../core/Analyzer';
import EnemyInstances from '../../../../shared/modules/EnemyInstances';

import StatisticBox, { STATISTIC_ORDER } from '../../../../../interface/others/StatisticBox';

import Abilities from '../Abilities';

const STORMELE_DURATION = 30000;
class StormElemental extends Analyzer {

  static dependencies = {
    abilities: Abilities,
    enemies: EnemyInstances,
  };

  _resolveAbilityGcdField(value) {
    if (typeof value === 'function') {
      return value.call(this.owner, this.selectedCombatant);
    } else {
      return value;
    }
  }

  badFS = 0;

  numCasts = {
    [SPELLS.STORM_ELEMENTAL_TALENT.id]: 0,
    [SPELLS.LIGHTNING_BOLT.id]: 0,
    [SPELLS.CHAIN_LIGHTNING.id]: 0,
    [SPELLS.EARTH_SHOCK.id]: 0,
    [SPELLS.EARTHQUAKE.id]: 0,
    others: 0,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.STORM_ELEMENTAL_TALENT.id);
  }

  get stormEleUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.WIND_GUST_BUFF.id) / this.owner.fightDuration;
  }

  get averageLightningBoltCasts() {
    return (this.numCasts[SPELLS.LIGHTNING_BOLT.id]/this.numCasts[SPELLS.STORM_ELEMENTAL_TALENT.id]) || 0;
  }

  get averageChainLightningCasts() {
    return (this.numCasts[SPELLS.CHAIN_LIGHTNING.id]/this.numCasts[SPELLS.STORM_ELEMENTAL_TALENT.id]) || 0;
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    const target = this.enemies.getEntity(event);


    if(spellId === SPELLS.STORM_ELEMENTAL_TALENT.id) {
      if(target.getBuff(SPELLS.FLAME_SHOCK.id, event.timestamp).end-event.timestamp<STORMELE_DURATION){
        this.badFS++;
      }
      this.numCasts[SPELLS.STORM_ELEMENTAL_TALENT.id]+=1;
    }


    const ability = this.abilities.getAbility(spellId);
    if(!ability){
      return;
    }
    if(!this.selectedCombatant.hasBuff(SPELLS.WIND_GUST_BUFF.id, event.timestamp)){
      return;
    }

    const gcd = this._resolveAbilityGcdField(ability.gcd);
    if(!gcd){
      return;
    }

    if (this.numCasts[spellId] !== undefined) {
      this.numCasts[spellId] += 1;
    } else {
      this.numCasts.others += 1;
    }
  }

  statistic() {
    const tooltip = `With a uptime of: ${formatPercentage(this.stormEleUptime)} %<br>
        Casts while Storm Elemental was up:<br>
        <ul>
          <li>Earth Shock: ${this.numCasts[SPELLS.EARTH_SHOCK.id]}</li>
          <li>Lightning Bolt: ${this.numCasts[SPELLS.LIGHTNING_BOLT.id]}</li>
          <li>Earthquake: ${this.numCasts[SPELLS.EARTHQUAKE.id]}</li>
          <li>Chain Lightning: ${this.numCasts[SPELLS.CHAIN_LIGHTNING.id]}</li>
          <li>Other Spells: ${this.numCasts.others}</li>
        </ul>
        `;

    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.STORM_ELEMENTAL_TALENT.id} />}
        value={`${formatNumber(this.averageLightningBoltCasts)}`}
        label="Average Number Of Lightning Bolts per Storm Elemental Cast"
        tooltip={tooltip}
      />
    );
  }

  get suggestionTresholds() {
    return {
      actual: this.numCasts.others,
      isGreaterThan: {
        minor: 0,
        major: 1,
      },
      style: 'absolute',
    };
  }

  suggestions(when) {
    const abilities = `Lightning Bolt/Chain Lightning and Earth Shock/Earthquake`;
    when(this.suggestionTresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Maximize your damage during Storm Elemental by only using {abilities}.</span>)
          .icon(SPELLS.STORM_ELEMENTAL_TALENT.icon)
          .actual(`${actual} other casts with Storm Elemental up`)
          .recommended(`Only cast ${abilities} while Storm Elemental is up.`);
      });
  }

  statisticOrder = STATISTIC_ORDER.OPTIONAL();
}

export default StormElemental;
