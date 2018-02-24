import React from 'react';

import Wrapper from 'common/Wrapper';
import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import ItemLink from 'common/ItemLink';
import { formatNumber, formatPercentage } from 'common/format';

import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';
import HolyPowerTracker from '../HolyPower/HolyPowerTracker';

class LiadrinsFuryUnleashed extends Analyzer {
  static dependencies = {
    holyPowerTracker: HolyPowerTracker,
    combatants: Combatants,
  };

  on_initialized() {
    this.active = this.combatants.selected.hasFinger(ITEMS.LIADRINS_FURY_UNLEASHED.id);
  }

  get liadrinsHP() {
    return this.holyPowerTracker.buildersObj[SPELLS.LIADRINS_FURY_UNLEASHED_BUFF.id];
  }

  get holyPowerGenerated() {
    if(this.liadrinsHP){
      return this.liadrinsHP.generated;
    }
    return 0;
  }

  get holyPowerWasted() {
    if(this.liadrinsHP){
      return this.liadrinsHP.wasted;
    }
    return 0;
  }

  get totalHolyPower() {
    return this.holyPowerGenerated + this.holyPowerWasted;
  }

  item() {
    return {
      item: ITEMS.LIADRINS_FURY_UNLEASHED,
      result: (
        <dfn data-tip={`Total Holy Power Gained: ${formatNumber(this.holyPowerGenerated)}`}>
          {formatNumber(this.holyPowerGenerated / this.owner.fightDuration * 60000)} Holy Power gained per minute.
        </dfn>
      ),
    };
  }

  get holyPowerWastedPercent() {
    return this.holyPowerWasted / this.totalHolyPower;
  }

  get suggestionThresholds() {
    return {
      actual: 1 - this.holyPowerWastedPercent,
      isLessThan: {
        minor: 0.9,
        average: 0.8,
        major: 0.7,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<Wrapper>You wasted {this.holyPowerWasted} of the Holy Power from <ItemLink id={ITEMS.LIADRINS_FURY_UNLEASHED.id} icon/>. Consider using an easier legendary.</Wrapper>)
        .icon(ITEMS.LIADRINS_FURY_UNLEASHED.icon)
        .actual(`${formatPercentage(this.holyPowerWastedPercent)}% Holy Power wasted`)
        .recommended(`Wasting <${formatPercentage(recommended)}% is recommended.`);
    });
  }
}

export default LiadrinsFuryUnleashed;
