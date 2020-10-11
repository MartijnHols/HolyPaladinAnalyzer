import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

import Analyzer from 'parser/core/Analyzer';
import Enemies from 'parser/shared/modules/Enemies';


class ShadowBladesUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };

  statistic() {
    const shadowBladesUptime = this.selectedCombatant.getBuffUptime(SPELLS.SHADOW_BLADES.id) / this.owner.fightDuration;
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(10)}
        icon={<SpellIcon id={SPELLS.SHADOW_BLADES.id} />}
        value={`${formatPercentage(shadowBladesUptime)} %`}
        label="Shadow Blades uptime"
      />
    );
  }
}

export default ShadowBladesUptime;
