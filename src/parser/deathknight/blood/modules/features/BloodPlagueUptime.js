import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import Enemies from 'parser/shared/modules/Enemies';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

class BloodPlagueUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };

  get uptime() {
    return this.enemies.getBuffUptime(SPELLS.BLOOD_PLAGUE.id) / this.owner.fightDuration;
  }

  get uptimeSuggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: .8,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.uptimeSuggestionThresholds)
        .addSuggestion((suggest, actual, recommended) => suggest('Your Blood Plague uptime can be improved. Keeping Blood Boil on cooldown should keep it up at all times.')
            .icon(SPELLS.BLOOD_PLAGUE.icon)
            .actual(`${formatPercentage(actual)}% Blood Plague uptime`)
            .recommended(`>${formatPercentage(recommended)}% is recommended`));
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.BLOOD_PLAGUE.id} />}
        value={`${formatPercentage(this.uptime)} %`}
        label="Blood Plague uptime"
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.CORE(2);
}

export default BloodPlagueUptime;
