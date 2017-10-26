import Analyzer from 'Parser/Core/Analyzer';
import HIT_TYPES from 'Parser/Core/HIT_TYPES';

import SpellManaCost from './SpellManaCost';

class AbilityTracker extends Analyzer {
  static dependencies = {
    spellManaCost: SpellManaCost,
  };

  abilities = {};

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;

    const cast = this.getAbility(spellId, event.ability);
    cast.casts = (cast.casts || 0) + 1;
    if (event.manaCost) {
      cast.manaUsed = (cast.manaUsed || 0) + event.manaCost;
    }
  }

  getAbility(spellId, abilityInfo = null) {
    let ability = this.abilities[spellId];
    if (!ability) {
      ability = {
        ability: abilityInfo,
      };
      this.abilities[spellId] = ability;
    }
    if (!ability.ability && abilityInfo) {
      ability.ability = abilityInfo;
    }
    return ability;
  }
}
class HealingTracker extends AbilityTracker {
  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    const cast = this.getAbility(spellId, event.ability);

    cast.healingHits = (cast.healingHits || 0) + 1;
    // TODO: Use HealingValue class
    cast.healingEffective = (cast.healingEffective || 0) + (event.amount || 0);
    cast.healingAbsorbed = (cast.healingAbsorbed || 0) + (event.absorbed || 0);
    cast.healingOverheal = (cast.healingOverheal || 0) + (event.overheal || 0);

    const isCrit = event.hitType === HIT_TYPES.CRIT;
    if (isCrit) {
      cast.healingCriticalHits = (cast.healingCriticalHits || 0) + 1;
      cast.healingCriticalEffective = (cast.healingCriticalEffective || 0) + (event.amount || 0);
      cast.healingCriticalAbsorbed = (cast.healingCriticalAbsorbed || 0) + (event.absorbed || 0);
      cast.healingCriticalOverheal = (cast.healingCriticalOverheal || 0) + (event.overheal || 0);
    }
  }
  on_byPlayer_absorbed(event) {
    this.on_byPlayer_heal(event);
  }
}
class DamageTracker extends HealingTracker {
  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    const cast = this.getAbility(spellId, event.ability);

    cast.damageHits = (cast.damageHits || 0) + 1;
    // TODO: Use DamageValue class
    cast.damageEffective = (cast.damageEffective || 0) + (event.amount || 0);
    cast.damageAbsorbed = (cast.damageAbsorbed || 0) + (event.absorbed || 0); // Not sure

    const isCrit = event.hitType === HIT_TYPES.CRIT;
    if (isCrit) {
      cast.damageCriticalHits = (cast.damageCriticalHits || 0) + 1;
      cast.damageCriticalEffective = (cast.damageCriticalEffective || 0) + (event.amount || 0);
      cast.damageCriticalAbsorbed = (cast.damageCriticalAbsorbed || 0) + (event.absorbed || 0); // Not sure
    }
  }
}

export default DamageTracker;
