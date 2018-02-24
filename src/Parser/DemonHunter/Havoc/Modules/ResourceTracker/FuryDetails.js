import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import Tab from 'Main/Tab';
import { formatPercentage, formatNumber } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import ResourceBreakdown from 'Parser/Core/Modules/ResourceTracker/ResourceBreakdown';
import FuryTracker from './FuryTracker';

import WastedFuryIcon from '../../images/dh_wasted_fury.jpg';

const furyIcon = 'inv_helm_leather_raiddemonhuntermythic_r_01';

class FuryDetails extends Analyzer {
  static dependencies = {
    furyTracker: FuryTracker,
  };

  get wastedFuryPercent() {
    return this.furyTracker.wasted / (this.furyTracker.wasted + this.furyTracker.generated);
  }

  get suggestionThresholds() {
    return {
      actual: this.wastedFuryPercent,
      isGreaterThan: {
        minor: 0.02,
        average: 0.05,
        major: 0.08,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(`You wasted ${formatNumber(this.furyTracker.wasted)} Fury.`)
        .icon(furyIcon)
        .actual(`${formatPercentage(actual)}% Fury wasted`)
        .recommended(`Wasting less than ${formatPercentage(recommended)}% is recommended.`);
    });
  }

  statistic() {
    return (
      <StatisticBox
        icon={(
          <img
            src={WastedFuryIcon}
            alt="Wasted Fury"
          />
        )}
        value={formatNumber(this.furyTracker.wasted)}
        label="Fury Wasted"
        tooltip={`${formatPercentage(this.wastedFuryPercent)}% wasted`}
      />
    );
  }

  tab() {
    return {
      title: 'Fury Usage',
      url: 'fury-usage',
      render: () => (
        <Tab title="Fury usage breakdown">
          <ResourceBreakdown
            tracker={this.furyTracker}
            showSpenders={true}
          />
        </Tab>
      ),
    };
  }
  statisticOrder = STATISTIC_ORDER.CORE(4);
}

export default FuryDetails;
