import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';

import Module from 'Parser/Core/Module';

import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';

class ElementalBlast extends Module {
  on_initialized() {
    this.active = this.owner.modules.combatants.selected.hasTalent(SPELLS.ELEMENTAL_BLAST_TALENT.id);
  }

  get hasteUptime() {
    return this.owner.modules.combatants.selected.getBuffUptime(SPELLS.ELEMENTAL_BLAST_HASTE.id) / this.owner.fightDuration;
  }

  get critUptime() {
    return this.owner.modules.combatants.selected.getBuffUptime(SPELLS.ELEMENTAL_BLAST_CRIT.id) / this.owner.fightDuration;
  }

  get masteryUptime() {
    return this.owner.modules.combatants.selected.getBuffUptime(SPELLS.ELEMENTAL_BLAST_MASTERY.id) / this.owner.fightDuration;
  }

  get elementalBlastUptime() {
    return this.hasteUptime + this.critUptime + this.masteryUptime;
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.ELEMENTAL_BLAST.id} />}
        value={`${formatPercentage(this.elementalBlastUptime)} %`}
        label={'Uptime'}
        tooltip={`
          <b class="stat-mastery">${formatPercentage(this.masteryUptime)}% Mastery</b><br/>
          <b class="stat-criticalstrike">${formatPercentage(this.critUptime)}% Crit</b><br/>
          <b class="stat-haste">${formatPercentage(this.hasteUptime)}% Haste</b>`}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.OPTIONAL();
}

export default ElementalBlast;
