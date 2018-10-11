import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import SpellUsable from 'parser/shared/modules/SpellUsable';

// Static Charge can only reduce the cooldown down to 40 seconds
const minimumCooldown = 40000;
const stunReduction = 5000;

class StaticCharge extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.STATIC_CHARGE_TALENT.id);
  }

  on_byPlayerPet_applydebuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.STATIC_CHARGE_DEBUFF.id) {
      return;
    }

    const cooldownRemaining = this.spellUsable.cooldownRemaining(SPELLS.CAPACITOR_TOTEM.id);
    if (cooldownRemaining <= minimumCooldown) {
      return;
    }

    this.spellUsable.reduceCooldown(SPELLS.CAPACITOR_TOTEM.id, stunReduction);
  }
}

export default StaticCharge;
