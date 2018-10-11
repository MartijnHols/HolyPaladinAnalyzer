import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';

import Analyzer from 'parser/core/Analyzer';

import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

// Inspired by the penance bolt counter module from Discipline Priest

const FISTS_OF_FURY_MINIMUM_TICK_TIME = 100; // This is to check that additional ticks aren't just hitting secondary targets

class FistsofFury extends Analyzer {
  previousTickTimestamp = null;
  fistsTickNumber = 0;
  fistsCastNumber = 0;
  averageTicks = 0;

  isNewFistsTick(timestamp) {
    return !this.previousTickTimestamp || (timestamp - this.previousTickTimestamp) > FISTS_OF_FURY_MINIMUM_TICK_TIME;
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.FISTS_OF_FURY_CAST.id) {
      return;
    }
    this.fistsCastNumber += 1;
    // average ticks is calculated here in case you don't hit any ticks during a cast'
    this.averageTicks = this.fistsTickNumber / this.fistsCastNumber;
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.FISTS_OF_FURY_DAMAGE.id || !this.isNewFistsTick(event.timestamp)) {
      return;
    }
    this.fistsTickNumber += 1;
    this.previousTickTimestamp = event.timestamp;
    this.averageTicks = this.fistsTickNumber / this.fistsCastNumber;
  }
  get suggestionThresholds() {
    return {
      actual: this.averageTicks,
      isLessThan: {
        minor: 5,
        average: 4.75,
        major: 4.5,
      },
      style: 'decimal',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<span> You are cancelling your <SpellLink id={SPELLS.FISTS_OF_FURY_CAST.id} /> casts early and losing ticks </span>)
        .icon(SPELLS.FISTS_OF_FURY_CAST.icon).actual(`${this.averageTicks.toFixed(2)} average ticks on each Fists of Fury cast`)
        .recommended(`Aim to get 5 ticks with each Fists of Fury cast`);
    });
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.FISTS_OF_FURY_CAST.id} />}
        value={this.averageTicks.toFixed(2)}
        label={(
          <>You had an average of {this.averageTicks.toFixed(2)} ticks in each Fists of Fury cast.</>
        )}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(6);
}

export default FistsofFury;
