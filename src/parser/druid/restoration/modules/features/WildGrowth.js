import React from 'react';
import { formatPercentage } from 'common/format';
import SpellLink from 'common/SpellLink';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';

import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';

// TODO - blazyb add use case for Autumn Leaves and tune suggestions
class WildGrowth extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
  };

  get wgs() {
    return this.abilityTracker.getAbility(SPELLS.WILD_GROWTH.id).casts || 0;
  }

  get rejuvs() {
    return this.abilityTracker.getAbility(SPELLS.REJUVENATION.id).casts || 0;
  }

  get wgsPerRejuv() {
    return (this.wgs / this.rejuvs) || 0;
  }

  get suggestionThresholds() {
    return {
      actual: this.wgsPerRejuv,
      isLessThan: {
        minor: 0.16,
        average: 0.10,
        major: 0.04,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>Your <SpellLink id={SPELLS.WILD_GROWTH.id} /> to rejuv ratio can be improved, try to cast more wild growths if possible as it is usually more efficient.</>,)
          .icon(SPELLS.WILD_GROWTH.icon)
          .actual(`${this.wgs} WGs / ${this.rejuvs} rejuvs`)
          .recommended(`>${Math.round(formatPercentage(recommended))}% is recommended`);
      });
  }
}

export default WildGrowth;
