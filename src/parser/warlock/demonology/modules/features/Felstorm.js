import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import calculateMaxCasts from 'parser/core/calculateMaxCasts';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

const FELSTORM_COOLDOWN = 45;

class Felstorm extends Analyzer {
  _felstormGuid = undefined;
  mainPetFelstormCount = 0;

  // works with either direct /cast Felstorm or by using the Command Demon ability (if direct /cast Felstorm, then the player didn't cast it, but this buff gets applied either way)
  // TODO: verify this still works
  on_toPlayerPet_applybuff(event) {
    if (event.ability.guid !== SPELLS.FELSTORM_BUFF.id && event.ability.guid !== SPELLS.WRATHSTORM_BUFF.id) {
      return;
    }
    if (!event.sourceInstance) {
      // permanent Felguard doesn't have sourceInstance, while Grimoire: Felguard does (both use Felstorm in the exact same way)
      this.mainPetFelstormCount += 1;
      if (!this._felstormGuid) {
        this._felstormGuid = event.ability.guid;
      }
    }
  }

  get suggestionThresholds(){
    const maxCasts = Math.ceil(calculateMaxCasts(FELSTORM_COOLDOWN, this.owner.fightDuration));
    return {
      actual: this.mainPetFelstormCount,
      isLessThan: maxCasts,
      style: 'number',
    };
  }

  suggestions(when) {
    // TODO: this would be rather unpleasant to refactor (style issues, but still)
    const maxCasts = Math.ceil(calculateMaxCasts(FELSTORM_COOLDOWN, this.owner.fightDuration));
    const percentage = this.mainPetFelstormCount / maxCasts;
    const petType = (!this._felstormGuid || this._felstormGuid === SPELLS.FELSTORM_BUFF.id) ? "Fel" : "Wrath";
    when(percentage).isLessThan(0.9)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>You should use your {petType}guard's <SpellLink id={this._felstormGuid || SPELLS.FELSTORM_BUFF.id} /> more often, preferably on cooldown.</>)
          .icon(SPELLS.FELSTORM_BUFF.icon)
          .actual(`${this.mainPetFelstormCount} out of ${maxCasts} (${formatPercentage(actual)} %) ${petType}storm casts.`)
          .recommended(`> ${formatPercentage(recommended)} % is recommended`)
          .regular(recommended - 0.1).major(recommended - 0.2);
      });
  }
}

export default Felstorm;
