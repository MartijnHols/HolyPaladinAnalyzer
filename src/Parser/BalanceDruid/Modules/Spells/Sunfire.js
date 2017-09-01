import React from 'react';
import { formatPercentage } from 'common/format';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import Module from 'Parser/Core/Module';
import SPELLS from 'common/SPELLS';

class Sunfire extends Module {
  suggestions(when) {
    const sunfireUptimePercentage = this.owner.modules.enemies.getBuffUptime(SPELLS.SUNFIRE.id) / this.owner.fightDuration;

    when(sunfireUptimePercentage).isLessThan(0.98)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span> Your <SpellLink id={SPELLS.SUNFIRE.id} /> uptime was {formatPercentage(actual)}%, unless you have extended periods of downtime it should be near 100%.</span>)
          .icon(SPELLS.SUNFIRE.icon)
          .actual(`${formatPercentage(actual)}% uptime`)
          .recommended(`${Math.round(formatPercentage(recommended))}% or more is recommended`)
          .regular(recommended - 0.03).major(recommended - 0.08);
      });
  }

  statistic() {
    const sunfireUptimePercentage = this.owner.modules.enemies.getBuffUptime(SPELLS.SUNFIRE.id) / this.owner.fightDuration;
    
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.SUNFIRE.id} />}
        value={`${formatPercentage(sunfireUptimePercentage)}%`}
        label='Sunfire uptime'
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(2);
}
  
export default Sunfire;