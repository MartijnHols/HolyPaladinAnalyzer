import React from 'react';

import SPELLS from 'common/SPELLS/index';
import ITEMS from 'common/ITEMS/index';
import Analyzer from 'parser/core/Analyzer';
import Abilities from 'parser/core/modules/Abilities';

import ItemHealingDone from 'interface/others/ItemHealingDone';

/**
 * Revitalizing Voodoo Totem -
 * Use: Heals the target for 0 every 0.5 sec, stacking up to 12 times. Healing starts low and increases over the duration. (1 Min, 30 Sec Cooldown)
 */
class RevitalizingVoodooTotem extends Analyzer {
  static dependencies = {
    abilities: Abilities,
  };


  healing = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrinket(ITEMS.REVITALIZING_VOODOO_TOTEM.id);

    if (this.active) {
      this.abilities.add({
        spell: SPELLS.TOUCH_OF_THE_VOODOO,
        buffSpellId: SPELLS.TOUCH_OF_THE_VOODOO.id,
        name: ITEMS.REVITALIZING_VOODOO_TOTEM.name,
        category: Abilities.SPELL_CATEGORIES.ITEMS,
        cooldown: 90,
        castEfficiency: {
          suggestion: true,
        },
      });
    }
  }

  on_byPlayer_heal(event) {
    if (event.ability.guid !== SPELLS.TOUCH_OF_THE_VOODOO.id) {
      return;
    }

    this.healing += event.amount + (event.absorbed || 0);
  }

  statistic() {
    return {
      item: ITEMS.REVITALIZING_VOODOO_TOTEM,
      result: <ItemHealingDone amount={this.healing} />,
    };
  }
}

export default RevitalizingVoodooTotem;
