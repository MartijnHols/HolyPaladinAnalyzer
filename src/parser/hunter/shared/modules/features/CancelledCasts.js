import React from 'react';

import CoreCancelledCasts from 'parser/shared/modules/CancelledCasts';

import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import Icon from 'common/Icon';

/**
 * Tracks the amount of cancelled casts in %.
 *
 * Example log: https://www.warcraftlogs.com/reports/Pp17Crv6gThLYmdf#fight=8&type=damage-done&source=76
 */

class CancelledCasts extends CoreCancelledCasts {
  static IGNORED_ABILITIES = [
    //Include the spells that you do not want to be tracked and spells that are castable while casting
    SPELLS.EXPLOSIVE_SHOT_DAMAGE.id,
  ];

  get suggestionThresholds() {
    return {
      actual: this.cancelledPercentage,
      isGreaterThan: {
        minor: 0.025,
        average: 0.05,
        major: 0.1,
      },
      style: 'percentage',
    };
  }
  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>You cancelled {formatPercentage(this.cancelledPercentage)}% of your spells. While it is expected that you will have to cancel a few casts to react to a boss mechanic or to move, you should try to ensure that you are cancelling as few casts as possible. This is generally done by planning ahead in terms of positioning, and moving while you're casting instant cast spells.</>)
          .icon('inv_misc_map_01')
          .actual(`${formatPercentage(actual)}% casts cancelled`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`);
      });
  }

  statistic() {
    const tooltipText = Object.keys(this.cancelledSpellList).map(cancelledSpell =>
      `<li>
        ${this.cancelledSpellList[cancelledSpell].spellName}: ${this.cancelledSpellList[cancelledSpell].amount}
      </li>`
    ).join(' ');

    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(14)}
        icon={<Icon icon="inv_misc_map_01" />}
        value={`${formatPercentage(this.cancelledPercentage)}%`}
        label="Cancelled Casts"
        tooltip={`You started casting a total of ${this.totalCasts} spells with a cast timer. You cancelled ${this.castsCancelled} of those casts. <ul>${tooltipText}</ul>`}
      />
    );
  }
}

export default CancelledCasts;
