import SPELLS from 'common/SPELLS';
import { DispelEvent } from 'parser/core/Events';
import CoreSpellUsable from 'parser/shared/modules/SpellUsable';

class SpellUsable extends CoreSpellUsable {
  on_dispel(event: DispelEvent) {
    if (!this.owner.byPlayer(event)) {
      return;
    }

    const spellId = event.ability.guid;
    if (spellId === SPELLS.PURIFY_SPIRIT.id) {
      super.beginCooldown(spellId, event);
    }
  }

  beginCooldown(spellId: number, cooldownTriggerEvent: DispelEvent) {
    // Essentially having the purify spirit cast not be able to trigger the cooldown, the dispel event does it instead.
    if (spellId === SPELLS.PURIFY_SPIRIT.id) {
      return;
    }

    super.beginCooldown(spellId, cooldownTriggerEvent);
  }
}

export default SpellUsable;
