import React from 'react';
import { formatPercentage } from 'common/format';
import SpellLink from 'common/SpellLink';

import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';

const HEAL_WINDOW_MS = 500;
const RECOMMENDED_HIT_THRESHOLD = 3;
//TODO - blazyb refactor this class to not account for Nature's essence
class NaturesEssence extends Analyzer {
  casts = 0;
  castsWithTargetsHit = []; // index is number of targets hit, value is number of casts that hit that many targets

  castHits = 0;
  totalHits = 0;
  healTimestamp = undefined;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.traitsBySpellId[SPELLS.NATURES_ESSENCE_TRAIT.id] > 0;
  }

  on_byPlayer_heal(event) {
    if (event.ability.guid !== SPELLS.NATURES_ESSENCE_DRUID.id) {
      return;
    }

    if(!this.healTimestamp || this.healTimestamp + HEAL_WINDOW_MS < this.owner.currentTimestamp) {
      this._tallyHits();
      this.healTimestamp = this.owner.currentTimestamp;
    }
    if(event.amount !== 0) {
      this.castHits += 1;
      this.totalHits += 1;
    }
  }

  on_byPlayer_cast(event) {
    if (event.ability.guid === SPELLS.WILD_GROWTH.id) {
      this.casts += 1;
    }
  }

  on_finished() {
    this._tallyHits();
  }

  _tallyHits() {
    if(!this.healTimestamp) {
      return;
    }
    this.castsWithTargetsHit[this.castHits]
       ? this.castsWithTargetsHit[this.castHits] += 1
       : this.castsWithTargetsHit[this.castHits] = 1;
    this.castHits = 0;
    this.healTimestamp = undefined;
  }

  get averageEffectiveHits() {
    return (this.totalHits / this.casts) || 0;
  }

  get belowRecommendedCasts() {
    return this.castsWithTargetsHit.reduce((accum, casts, hits) => {
        return (hits < RECOMMENDED_HIT_THRESHOLD) ? accum + casts : accum;
    }, 0);
  }

  get percentBelowRecommendedCasts() {
    return (this.belowRecommendedCasts / this.casts) || 0;
  }

  get suggestionThresholds() {
    return {
      actual: this.percentBelowRecommendedCasts,
      isGreaterThan: {
        minor: 0.00,
        average: 0.15,
        major: 0.35,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>You sometimes cast <SpellLink id={SPELLS.WILD_GROWTH.id} /> on too few targets. <SpellLink id={SPELLS.WILD_GROWTH.id} /> is not mana efficient when hitting few targets, you should only cast it when you can hit at least {RECOMMENDED_HIT_THRESHOLD} wounded targets. Make sure you are not casting on a primary target isolated from the raid. <SpellLink id={SPELLS.WILD_GROWTH.id} /> has a maximum hit radius, the injured raiders could have been out of range. Also, <SpellLink id={SPELLS.WILD_GROWTH.id} /> healing is frontloaded due to <SpellLink id={SPELLS.NATURES_ESSENCE_DRUID.id} />, you should never pre-hot with <SpellLink id={SPELLS.WILD_GROWTH.id} />.
          </>)
          .icon(SPELLS.NATURES_ESSENCE_DRUID.icon)
          .actual(`${formatPercentage(this.percentBelowRecommendedCasts, 0)}% casts on fewer than ${RECOMMENDED_HIT_THRESHOLD} targets.`)
          .recommended(`never casting on fewer than ${RECOMMENDED_HIT_THRESHOLD} is recommended`);
      });
  }
}

export default NaturesEssence;
