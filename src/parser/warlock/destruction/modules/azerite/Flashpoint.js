import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';

import SPELLS from 'common/SPELLS';
import { calculateAzeriteEffects } from 'common/stats';
import { formatPercentage } from 'common/format';

import AzeritePowerStatistic from 'interface/statistics/AzeritePowerStatistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import UptimeIcon from 'interface/icons/Uptime';
import HasteIcon from 'interface/icons/Haste';

const flashpointStats = traits => traits.reduce((total, rank) => {
  const [ haste ] = calculateAzeriteEffects(SPELLS.FLASHPOINT.id, rank);
  return total + haste;
}, 0);

const debug = false;

/*
  Flashpoint:
  When your Immolate deals periodic damage to a target above 80% health, gain X Haste for 10 sec.
 */
class Flashpoint extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  haste = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.FLASHPOINT.id);
    if (!this.active) {
      return;
    }

    this.haste = flashpointStats(this.selectedCombatant.traitsBySpellId[SPELLS.FLASHPOINT.id]);
    debug && this.log(`Total bonus from FP: ${this.haste}`);

    this.statTracker.add(SPELLS.FLASHPOINT_BUFF.id, {
      haste: this.haste,
    });
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.FLASHPOINT_BUFF.id) / this.owner.fightDuration;
  }

  get averageHaste() {
    return (this.uptime * this.haste).toFixed(0);
  }

  statistic() {
    return (
      <AzeritePowerStatistic
        size="flexible"
        tooltip={`Flashpoint grants ${this.haste} Haste while active. You had ${formatPercentage(this.uptime)} % uptime on the buff.`}
      >
        <BoringSpellValueText spell={SPELLS.FLASHPOINT}>
          <UptimeIcon /> {formatPercentage(this.uptime, 0)} % <small>uptime</small> <br />
          <HasteIcon /> {this.averageHaste} <small>average Haste</small>
        </BoringSpellValueText>
      </AzeritePowerStatistic>
    );
  }
}

export default Flashpoint;
