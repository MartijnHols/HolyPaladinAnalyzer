import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';

import SPELLS from 'common/SPELLS';
import { calculateAzeriteEffects } from 'common/stats';
import { formatPercentage } from 'common/format';

import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import UptimeIcon from 'interface/icons/Uptime';
import MasteryIcon from 'interface/icons/Mastery';

const burstingFlareStats = traits => traits.reduce((total, rank) => {
  const [ mastery ] = calculateAzeriteEffects(SPELLS.BURSTING_FLARE.id, rank);
  return total + mastery;
}, 0);

const debug = false;

/*
  Bursting Flare:
  Casting Conflagrate on a target affected by your Immolate increases your Mastery by X for 20 sec, stacking up to 5 times.
 */
class BurstingFlare extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  mastery = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.BURSTING_FLARE.id);
    if (!this.active) {
      return;
    }

    this.mastery = burstingFlareStats(this.selectedCombatant.traitsBySpellId[SPELLS.BURSTING_FLARE.id]);
    debug && this.log(`Total bonus from BF: ${this.mastery}`);

    this.statTracker.add(SPELLS.BURSTING_FLARE_BUFF.id, {
      mastery: this.mastery,
    });
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.BURSTING_FLARE_BUFF.id) / this.owner.fightDuration;
  }

  get averageMastery() {
    const averageStacks = this.selectedCombatant.getStackWeightedBuffUptime(SPELLS.BURSTING_FLARE_BUFF.id) / this.owner.fightDuration;
    return (averageStacks * this.mastery).toFixed(0);
  }

  statistic() {
    return (
      <AzeritePowerStatistic
        size="flexible"
        tooltip={`Bursting Flare grants ${this.mastery} Mastery per stack (${5 * this.mastery} Mastery at 5 stacks) while active. You had ${formatPercentage(this.uptime)} % uptime on the buff.`}
      >
        <BoringSpellValueText spell={SPELLS.BURSTING_FLARE}>
          <UptimeIcon /> {formatPercentage(this.uptime, 0)} % <small>uptime</small> <br />
          <MasteryIcon /> {this.averageMastery} <small>average Mastery</small>
        </BoringSpellValueText>
      </AzeritePowerStatistic>
    );
  }
}

export default BurstingFlare;
