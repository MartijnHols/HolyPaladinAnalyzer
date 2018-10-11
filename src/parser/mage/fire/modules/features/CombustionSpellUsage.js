import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatNumber } from 'common/format';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import Analyzer from 'parser/core/Analyzer';
import SpellUsable from 'parser/shared/modules/SpellUsable';

const debug = false;

class CombustionSpellUsage extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    abilityTracker: AbilityTracker,
  };

  castedWithInstants = 0;

  //Check to see if the player started casting Fireball or Scorch during Combustion while they had Fire Blast or Phoenix Flames charges available.
  on_byPlayer_begincast(event) {
    const spellId = event.ability.guid;
    if ((spellId !== SPELLS.FIREBALL.id && spellId !== SPELLS.SCORCH.id) || !this.selectedCombatant.hasBuff(SPELLS.COMBUSTION.id)) {
      return;
    }
    if (this.spellUsable.chargesAvailable(SPELLS.FIRE_BLAST.id) > 0 || this.spellUsable.chargesAvailable(SPELLS.PHOENIX_FLAMES_TALENT.id) > 0) {
      this.castedWithInstants += 1;
      debug && this.log("Casted with Instants Available");
    }
  }

  get castsWithInstantsPerCombustion() {
    return this.castedWithInstants / this.abilityTracker.getAbility(SPELLS.COMBUSTION.id).casts;
  }

  get suggestionThresholds() {
    return {
      actual: this.castsWithInstantsPerCombustion,
      isGreaterThan: {
        minor: 0,
        average: 1,
        major: 2,
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>You cast <SpellLink id={SPELLS.FIREBALL.id} /> or <SpellLink id={SPELLS.SCORCH.id} /> {this.castedWithInstants} times ({this.castsWithInstantsPerCombustion.toFixed(2)} per Combustion) while you had charges of <SpellLink id={SPELLS.FIRE_BLAST.id} /> or <SpellLink id={SPELLS.PHOENIX_FLAMES_TALENT.id} /> available. Make sure you are using up all of your charges of Fire Blast and Phoenix Flames before using Fireball or Scorch during Combustion.</>)
          .icon(SPELLS.COMBUSTION.icon)
          .actual(`${this.castsWithInstantsPerCombustion.toFixed(2)} Casts Per Combustion`)
          .recommended(`${formatNumber(recommended)} is recommended`);
      });
  }
}
export default CombustionSpellUsage;
