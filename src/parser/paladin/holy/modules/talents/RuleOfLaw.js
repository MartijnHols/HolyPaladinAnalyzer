import React from 'react';
import { t } from '@lingui/macro';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import Analyzer from 'parser/core/Analyzer';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import { i18n } from 'interface/RootLocalizationProvider';

class RuleOfLaw extends Analyzer {
  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.RULE_OF_LAW_TALENT.id);
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.RULE_OF_LAW_TALENT.id) / this.owner.fightDuration;
  }

  get uptimeSuggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.25,
        average: 0.2,
        major: 0.1,
      },
      style: 'percentage',
    };
  }
  suggestions(when) {
    when(this.uptimeSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <>
          Your <SpellLink id={SPELLS.RULE_OF_LAW_TALENT.id} /> uptime can be improved. Try keeping at least 1 charge on cooldown; you should (almost) never be at max charges.
        </>
      )
        .icon(SPELLS.RULE_OF_LAW_TALENT.icon)
        .actual(`${formatPercentage(actual)}% uptime`)
        .recommended(`>${formatPercentage(recommended)}% is recommended`);
    });
  }
  statistic() {
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(31)}
        icon={<SpellIcon id={SPELLS.RULE_OF_LAW_TALENT.id} />}
        value={`${formatPercentage(this.uptime)} %`}
        label={i18n._(t`${SPELLS.RULE_OF_LAW_TALENT.name} uptime`)}
      />
    );
  }
}

export default RuleOfLaw;
