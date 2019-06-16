import SPELLS from 'common/SPELLS';
import CoreSpellUsable from 'parser/shared/modules/SpellUsable';
import HIT_TYPES from 'game/HIT_TYPES';
import GrandCrusader from '../core/GrandCrusader';

class SpellUsable extends CoreSpellUsable {
  static dependencies = {
    ...CoreSpellUsable.dependencies,
    gc: GrandCrusader,
  };

  constructor(...args) {
    super(...args);
    this.hasCrusadersJudgment = this.selectedCombatant.hasTalent(SPELLS.CRUSADERS_JUDGMENT_TALENT.id);
  }

  lastPotentialTriggerForAvengersShield = null;
  lastPotentialTriggerForJudgment = null;
  on_byPlayer_cast(event) {
    if (super.on_byPlayer_cast) {
      super.on_byPlayer_cast(event);
    }

    const spellId = event.ability.guid;
    if (spellId === SPELLS.HAMMER_OF_THE_RIGHTEOUS.id || spellId === SPELLS.BLESSED_HAMMER_TALENT.id) {
      this.lastPotentialTriggerForAvengersShield = event;
      this.lastPotentialTriggerForJudgment = event;
    } else if (spellId === SPELLS.AVENGERS_SHIELD.id) {
      this.lastPotentialTriggerForAvengersShield = null;
    } else if (spellId === SPELLS.JUDGMENT_CAST_PROTECTION.id) {
      this.lastPotentialTriggerForJudgment = null;
    }
  }

  on_toPlayer_damage(event) {
    if (super.on_toPlayer_damage) {
      super.on_toPlayer_damage(event);
    }

    if ([HIT_TYPES.DODGE, HIT_TYPES.PARRY].includes(event.hitType)) {
      this.lastPotentialTriggerForAvengersShield = event;
      this.lastPotentialTriggerForJudgment = event;
    }
  }

  beginCooldown(spellId, cooldownTriggerEvent) {
    if (spellId === SPELLS.AVENGERS_SHIELD.id) {
      if (this.isOnCooldown(spellId)) {
        this.gc.triggerInferredReset(this.lastPotentialTriggerForAvengersShield);
        this.endCooldown(spellId, false, this.lastPotentialTriggerForAvengersShield ? this.lastPotentialTriggerForAvengersShield.timestamp : undefined);
      }
    } else if (this.hasCrusadersJudgment && spellId === SPELLS.JUDGMENT_CAST_PROTECTION.id) {
      if (!this.isAvailable(spellId)) {
        this.endCooldown(spellId, false, this.lastPotentialTriggerForJudgment ? this.lastPotentialTriggerForJudgment.timestamp : undefined);
      }
    }

    super.beginCooldown(spellId, cooldownTriggerEvent);
  }
}

export default SpellUsable;
