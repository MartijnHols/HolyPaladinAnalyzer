import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer from 'parser/core/Analyzer';
import Enemies from 'parser/shared/modules/Enemies';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import TalentStatisticBox from 'parser/ui/TalentStatisticBox';
import React from 'react';

class VoidReaverDebuff extends Analyzer {
  get uptime() {
    return this.enemies.getBuffUptime(SPELLS.VOID_REAVER_DEBUFF.id) / this.owner.fightDuration;
  }

  get uptimeSuggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.9,
        average: 0.8,
        major: 0.7,
      },
      style: 'percentage',
    };
  }

  //WCL: https://www.warcraftlogs.com/reports/LaMfJFHk2dY98gTj/#fight=20&type=auras&spells=debuffs&hostility=1&ability=268178
  static dependencies = {
    enemies: Enemies,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.VOID_REAVER_TALENT.id);
  }

  suggestions(when) {
    when(this.uptimeSuggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Your <SpellLink id={SPELLS.VOID_REAVER_DEBUFF.id} /> uptime can be improved.
        </>,
      )
        .icon(SPELLS.VOID_REAVER_TALENT.icon)
        .actual(
          t({
            id: 'demonhunter.vengeance.suggestions.voidReaver.uptime',
            message: `${formatPercentage(actual)}% Void Reaver uptime`,
          }),
        )
        .recommended(`>${formatPercentage(recommended)}% is recommended`),
    );
  }

  statistic() {
    return (
      <TalentStatisticBox
        talent={SPELLS.VOID_REAVER_TALENT.id}
        position={STATISTIC_ORDER.CORE(5)}
        value={`${formatPercentage(this.uptime)} %`}
        label="Void Reaver uptime"
      />
    );
  }
}

export default VoidReaverDebuff;
