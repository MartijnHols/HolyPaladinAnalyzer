import SPELLS from 'common/SPELLS';
import CoreSpellUsable from 'parser/shared/modules/SpellUsable';
import GlobalCooldown from 'parser/shared/modules/GlobalCooldown';
import HIT_TYPES from 'game/HIT_TYPES';

/**
 * 
Your Frost Strike, Frostscythe, and Obliterate critical strikes reduce the remaining cooldown of Pillar of Frost by 3 sec.
 */
const ICECAP_COOLDOWN_REDUCTION_MS = 3000;

const ICECAP_ABILITIES = [
  SPELLS.OBLITERATE_MAIN_HAND_DAMAGE.id,
  SPELLS.OBLITERATE_OFF_HAND_DAMAGE.id,
  SPELLS.FROST_STRIKE_MAIN_HAND_DAMAGE.id,
  SPELLS.FROST_STRIKE_OFF_HAND_DAMAGE.id,
  SPELLS.FROSTSCYTHE_TALENT.id,
];

class SpellUsable extends CoreSpellUsable {
  static dependencies = {
    ...CoreSpellUsable.dependencies,
    globalCooldown: GlobalCooldown,
  };

  lastCritTime = -2000;

  constructor(...args) {
    super(...args);
    this.hasIcecap = this.selectedCombatant.hasTalent(SPELLS.ICECAP_TALENT.id);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    const isCrit = event.hitType === HIT_TYPES.CRIT || event.hitType === HIT_TYPES.BLOCKED_CRIT;
    const offInternalCD = (this.lastCritTime + this.globalCooldown.getGlobalCooldownDuration(spellId)) <= event.timestamp;
    if (this.hasIcecap && ICECAP_ABILITIES.some(id => spellId === id) && isCrit) {
      if (this.isOnCooldown(SPELLS.PILLAR_OF_FROST.id) && offInternalCD) {
        this.reduceCooldown(SPELLS.PILLAR_OF_FROST.id, ICECAP_COOLDOWN_REDUCTION_MS);
        this.lastCritTime = event.timestamp;
      }
    }
  }
}

export default SpellUsable;
