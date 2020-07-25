import React from 'react';

import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import StatTracker from 'parser/shared/modules/StatTracker';
import Events, { DamageEvent } from 'parser/core/Events';
import HIT_TYPES from 'game/HIT_TYPES';
import { MASTER_MARKSMAN_CRIT_INCREASE } from 'parser/hunter/marksmanship/constants';
import { formatPercentage } from 'common/format';

/**
 * Aimed Shot has an additional 25% chance to deal a critical strike.
 *
 * Example log:
 * https://www.warcraftlogs.com/reports/r1yPhZvcHkdCMLgt/#source=6&fight=1
 */

class MasterMarksman extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  protected statTracker!: StatTracker;

  currentCritChance = 0;
  aimedShotCrits = 0;
  aggregatedContribution = 0;

  constructor(options: any) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(SPELLS.MASTER_MARKSMAN_TALENT.id);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.AIMED_SHOT), this.onAimedCast);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.AIMED_SHOT), this.onAimedDamage);
  }

  onAimedCast() {
    this.currentCritChance = this.statTracker.currentCritPercentage;
  }

  onAimedDamage(event: DamageEvent) {
    if (event.hitType !== HIT_TYPES.CRIT) {
      return;
    }
    this.aggregatedContribution += MASTER_MARKSMAN_CRIT_INCREASE / (MASTER_MARKSMAN_CRIT_INCREASE + this.currentCritChance);
    this.aimedShotCrits += 1;
  }

  get averageContributionPercentage() {
    return this.aggregatedContribution / this.aimedShotCrits;
  }

  get averageContributionAbsolute() {
    return Math.round(this.averageContributionPercentage * this.aimedShotCrits);
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(10)}
        size="flexible"
        category={STATISTIC_CATEGORY.TALENTS}
        tooltip={(
          <>
            Master Marksman contributed with approximately {formatPercentage(this.averageContributionPercentage)}% of your total Aimed Shot crits.
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.MASTER_MARKSMAN_TALENT}>
          <>
            ≈ {this.averageContributionAbsolute} <small> additional crits </small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default MasterMarksman;
