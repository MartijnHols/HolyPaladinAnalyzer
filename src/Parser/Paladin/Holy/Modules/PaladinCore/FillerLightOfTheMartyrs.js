import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';

import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';
import SpellUsable from 'Parser/Core/Modules/SpellUsable';

import AbilityTracker from './PaladinAbilityTracker';
import MaraadsDyingBreath from '../Items/MaraadsDyingBreath';

class FillerLightOfTheMartyrs extends Analyzer {
  static dependencies = {
    combatants: Combatants,
    abilityTracker: AbilityTracker,
    maraadsDyingBreath: MaraadsDyingBreath,
    spellUsable: SpellUsable,
  };

  casts = 0;
  inefficientCasts = 0;
  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.LIGHT_OF_THE_MARTYR.id) {
      return;
    }
    if (this.combatants.selected.hasBuff(SPELLS.MARAADS_DYING_BREATH_BUFF.id, event.timestamp)) {
      // Not a filler
      return;
    }

    this.casts += 1;

    const hasHolyShockAvailable = this.spellUsable.isAvailable(SPELLS.HOLY_SHOCK_CAST.id);
    if (hasHolyShockAvailable) {
      this.inefficientCasts += 1;
    }
  }

  suggestions(when) {
    const fillerLotms = this.casts;
    const fillerLotmsPerMinute = fillerLotms / (this.owner.fightDuration / 1000) * 60;
    when(fillerLotmsPerMinute).isGreaterThan(1.5)
      .addSuggestion((suggest, actual, recommended) => {
        let suggestionText;
        let actualText;
        if (this.maraadsDyingBreath.active) {
          suggestionText = <span>With <ItemLink id={ITEMS.MARAADS_DYING_BREATH.id} /> you should only cast <b>one</b> <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR.id} /> per <SpellLink id={SPELLS.LIGHT_OF_DAWN_CAST.id} />. Without the buff <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR.id} /> is a very inefficient spell to cast. Try to only cast Light of the Martyr when it will save someone's life or when moving and all other instant cast spells are on cooldown.</span>;
          actualText = `${fillerLotmsPerMinute.toFixed(2)} Casts Per Minute - ${fillerLotms} casts total (unbuffed only)`;
        } else {
          suggestionText = <span>You cast many <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR.id} />s. Light of the Martyr is an inefficient spell to cast, try to only cast Light of the Martyr when it will save someone's life or when moving and all other instant cast spells are on cooldown.</span>;
          actualText = `${fillerLotmsPerMinute.toFixed(2)} Casts Per Minute - ${fillerLotms} casts total`;
        }
        return suggest(suggestionText)
          .icon(SPELLS.LIGHT_OF_THE_MARTYR.icon)
          .actual(actualText)
          .recommended(`<${recommended} Casts Per Minute is recommended`)
          .regular(recommended + 0.5).major(recommended + 1.5);
      });

    const inefficientLotmsPerMinute = this.inefficientCasts / (this.owner.fightDuration / 1000) * 60;
    when(inefficientLotmsPerMinute).isGreaterThan(0)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>You cast {this.inefficientCasts} <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR.id} />s while <SpellLink id={SPELLS.HOLY_SHOCK_CAST.id} /> was available. Try to <b>never</b> cast <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR.id} /> when something else is available.</span>)
          .icon(SPELLS.LIGHT_OF_THE_MARTYR.icon)
          .actual(`${this.inefficientCasts} casts while Holy Shock was available`)
          .recommended(`No inefficient casts is recommended`)
          .regular(recommended + 0.5).major(recommended + 1.5);
      });
  }
}

export default FillerLightOfTheMartyrs;
