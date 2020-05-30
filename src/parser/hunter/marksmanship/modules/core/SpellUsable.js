import SPELLS from 'common/SPELLS';
import CoreSpellUsable from 'parser/shared/modules/SpellUsable';

class SpellUsable extends CoreSpellUsable {
  static dependencies = {
    ...CoreSpellUsable.dependencies,
  };

  lastPotentialTriggerForRapidFireReset = null;
  rapidFireResets = 0;

  on_byPlayer_cast(event) {
    if (super.on_byPlayer_cast) {
      super.on_byPlayer_cast(event);
    }
    const spellId = event.ability.guid;
    if (this.selectedCombatant.hasTrait(SPELLS.SURGING_SHOTS.id)) {
      if (spellId === SPELLS.AIMED_SHOT.id) {
        this.lastPotentialTriggerForRapidFireReset = event;
      } else if (spellId === SPELLS.RAPID_FIRE.id) {
        this.lastPotentialTriggerForRapidFireReset = null;
      }
    }
  }

  beginCooldown(spellId, cooldownTriggerEvent) {
    if (spellId === SPELLS.RAPID_FIRE.id && this.selectedCombatant.hasTrait(SPELLS.SURGING_SHOTS.id)) {
      if (this.isOnCooldown(spellId)) {
        this.rapidFireResets += 1;
        this.endCooldown(spellId, undefined, this.lastPotentialTriggerForRapidFireReset ? this.lastPotentialTriggerForRapidFireReset.timestamp : undefined);
      }
    }

    super.beginCooldown(spellId, cooldownTriggerEvent);
  }
}

export default SpellUsable;
