import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import SCHOOLS from 'common/MAGIC_SCHOOLS';


import Analyzer from 'Parser/Core/Analyzer';
import calculateEffectiveHealing from 'Parser/Core/calculateEffectiveHealing';
import Combatants from 'Parser/Core/Modules/Combatants';

const GNAWED_THUMB_RING_HEALING_INCREASE = 0.05;
const GNAWED_THUMB_RING_DAMAGE_INCREASE = 0.05;

class GnawedThumbRing extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };
  healing = 0;
  damage = 0;

  on_initialized() {
    this.active = this.combatants.selected.hasFinger(ITEMS.GNAWED_THUMB_RING.id);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    if (this.owner.constructor.abilitiesAffectedByHealingIncreases.indexOf(spellId) === -1) {
      return;
    }

    if (this.combatants.selected.hasBuff(SPELLS.GNAWED_THUMB_RING.id)) {
      this.healing += calculateEffectiveHealing(event, GNAWED_THUMB_RING_HEALING_INCREASE);
    }
  }

  on_byPlayer_damage(event) {
    if (event.ability.type === SCHOOLS.ids.PHYSICAL) {
      return;
    }
    if (this.combatants.selected.hasBuff(SPELLS.GNAWED_THUMB_RING.id)) {
      this.damage += event.amount - (event.amount / (1 + GNAWED_THUMB_RING_DAMAGE_INCREASE));
    }
  }

  item() {
    return {
      item: ITEMS.GNAWED_THUMB_RING,
      result: (
        <dfn data-tip={`The effective healing and damage contributed by Gnawed Thumb Ring.<br/>
            Damage: ${this.owner.formatItemDamageDone(this.damage)} <br/>
            Healing: ${this.owner.formatItemHealingDone(this.healing)}`}
        >
          {this.healing > this.damage ? this.owner.formatItemHealingDone(this.healing) : this.owner.formatItemDamageDone(this.damage)}
        </dfn>
      ),
    };
  }
}

export default GnawedThumbRing;
