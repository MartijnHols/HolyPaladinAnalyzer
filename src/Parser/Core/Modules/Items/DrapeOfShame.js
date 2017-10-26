import ITEMS from 'common/ITEMS';

import Analyzer from 'Parser/Core/Analyzer';
import HIT_TYPES from 'Parser/Core/HIT_TYPES';
import Combatants from 'Parser/Core/Modules/Combatants';

import CritEffectBonus from '../Helpers/CritEffectBonus';

export const DRAPE_OF_SHAME_CRIT_EFFECT = 0.05;

class DrapeOfShame extends Analyzer {
  static dependencies = {
    critEffectBonus: CritEffectBonus,
    combatants: Combatants,
  };

  healing = 0;

  on_initialized() {
    this.active = this.combatants.selected.hasBack(ITEMS.DRAPE_OF_SHAME.id);

    if (this.active) {
      this.critEffectBonus.hook(this.getCritEffectBonus);
    }
  }

  getCritEffectBonus(critEffectModifier, event) {
    return critEffectModifier + 0.05;
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    if (this.owner.constructor.abilitiesAffectedByHealingIncreases.indexOf(spellId) === -1) {
      return;
    }
    if (event.hitType !== HIT_TYPES.CRIT) {
      return;
    }

    const amount = event.amount;
    const absorbed = event.absorbed || 0;
    const overheal = event.overheal || 0;
    const raw = amount + absorbed + overheal;
    const rawNormalPart = raw / this.critEffectBonus.getBonus(event);
    const rawDrapeHealing = rawNormalPart * DRAPE_OF_SHAME_CRIT_EFFECT;

    const effectiveHealing = Math.max(0, rawDrapeHealing - overheal);

    this.healing += effectiveHealing;
  }

  item() {
    return {
      item: ITEMS.DRAPE_OF_SHAME,
      result: this.owner.formatItemHealingDone(this.healing),
    };
  }
}

export default DrapeOfShame;
