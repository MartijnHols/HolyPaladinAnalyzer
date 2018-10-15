import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

import Analyzer from 'parser/core/Analyzer';

const RAMPAGE_HITS_PER_CAST = 4;

class RampageCancelled extends Analyzer {
  // Rampage is in fact 5 separate spells cast in this sequence
  rampage = [SPELLS.RAMPAGE_1.id, SPELLS.RAMPAGE_2.id, SPELLS.RAMPAGE_3.id, SPELLS.RAMPAGE_4.id];
  counter = {};

  constructor(...args) {
    super(...args);
    for (let i = 0; i < this.rampage.length; i++) {
      this.counter[this.rampage[i]] = 0;
    }
  }

  on_byPlayer_damage(event) {
    if (!this.rampage.includes(event.ability.guid)) {
      return;
    }

    this.counter[event.ability.guid] += 1;
  }

  get suggestionThresholdsFrothingBerserker() {
    return {
      isGreaterThan: {
        minor: 0,
        average: 0.02,
        major: 0.05,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    const {
      isGreaterThan: {
        minor,
        average,
        major,
      },
    } = this.suggestionThresholdsFrothingBerserker;

    const max = Object.values(this.counter).reduce((max, current) => current > max ? current : max, 0);
    const wasted = Object.keys(this.counter).reduce((acc, current) => acc + max - this.counter[current], 0);

    when(wasted / (max * RAMPAGE_HITS_PER_CAST)).isGreaterThan(minor)
      .addSuggestion((suggest, actual) => {
        return suggest(<>Your <SpellLink id={SPELLS.RAMPAGE.id} /> cast are being cancelled prematurely. Be sure to be facing the target within melee distance to avoid this.</>)
          .icon(SPELLS.RAMPAGE.icon)
          .actual(`${formatPercentage(actual)}% (${wasted} out of ${max * RAMPAGE_HITS_PER_CAST}) of your Rampage hits were cancelled.`)
          .recommended(`0% is recommended`)
          .regular(average).major(major);
      });
  }
}

export default RampageCancelled;
