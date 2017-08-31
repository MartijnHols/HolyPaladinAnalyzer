import React from 'react';
import { formatPercentage } from 'common/format';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import Module from 'Parser/Core/Module';
import SPELLS from 'common/SPELLS';

class Moonfire extends Module {
  suggestions(when) {
    const moonfireUptimePercentage = this.owner.modules.enemies.getBuffUptime(SPELLS.MOONFIRE_BEAR.id) / this.owner.fightDuration;

    when(moonfireUptimePercentage).isLessThan(0.98)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span> Your <SpellLink id={SPELLS.MOONFIRE_BEAR.id} /> uptime was {formatPercentage(moonfireUptimePercentage)}%, unless you have extended periods of downtime it should be near 100%.</span>)
          .icon(SPELLS.MOONFIRE_BEAR.icon)
          .actual(`${formatPercentage(moonfireUptimePercentage)}% uptime`)
          .recommended(`${Math.round(formatPercentage(recommended))}% is recommended`)
          .regular(recommended - 0.03).major(recommended - 0.08);
      });
  }

  statistic() {
    const moonfireUptimePercentage = this.owner.modules.enemies.getBuffUptime(SPELLS.MOONFIRE_BEAR.id) / this.owner.fightDuration;
    
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.MOONFIRE_BEAR.id} />}
        value={`${formatPercentage(moonfireUptimePercentage)}%`}
        label='Moonfire uptime'
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(1);
}
  
export default Moonfire;