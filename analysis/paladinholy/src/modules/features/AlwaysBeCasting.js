import SPELLS from 'common/SPELLS';
import CoreAlwaysBeCastingHealing from 'parser/shared/modules/AlwaysBeCastingHealing';

const debug = false;

const AVENGING_CRUSADER_SPELLS = [SPELLS.CRUSADER_STRIKE.id, SPELLS.JUDGMENT_CAST_HOLY.id];

class AlwaysBeCasting extends CoreAlwaysBeCastingHealing {
  static HEALING_ABILITIES_ON_GCD = [
    SPELLS.FLASH_OF_LIGHT.id,
    SPELLS.HOLY_LIGHT.id,
    SPELLS.HOLY_SHOCK_CAST.id,
    SPELLS.LIGHT_OF_DAWN_CAST.id,
    SPELLS.LIGHT_OF_THE_MARTYR.id,
    SPELLS.BESTOW_FAITH_TALENT.id,
    SPELLS.HOLY_PRISM_TALENT.id,
    SPELLS.LIGHTS_HAMMER_TALENT.id,
    SPELLS.WORD_OF_GLORY.id,
    SPELLS.HAMMER_OF_WRATH.id,
  ];

  constructor(...args) {
    super(...args);

    if (this.selectedCombatant.hasTalent(SPELLS.CRUSADERS_MIGHT_TALENT.id)) {
      this.constructor.HEALING_ABILITIES_ON_GCD.push(SPELLS.CRUSADER_STRIKE.id);
    }

    if (this.selectedCombatant.hasTalent(SPELLS.JUDGMENT_OF_LIGHT_TALENT.id)) {
      this.constructor.HEALING_ABILITIES_ON_GCD.push(SPELLS.JUDGMENT_CAST_HOLY.id);
    }
  }

  countsAsHealingAbility(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.HOLY_SHOCK_CAST.id && !event.trigger.targetIsFriendly) {
      debug &&
        console.log(
          `%cABC: ${event.ability.name} (${spellId}) skipped for healing time; target is not friendly`,
          'color: orange',
        );
      return false;
    }

    if (
      this.selectedCombatant.hasTalent(SPELLS.AVENGING_CRUSADER_TALENT.id) &&
      this.selectedCombatant.hasBuff(SPELLS.AVENGING_CRUSADER_TALENT.id, event.timestamp) &&
      AVENGING_CRUSADER_SPELLS.includes(spellId)
    ) {
      return true;
    }

    return super.countsAsHealingAbility(event);
  }
}

export default AlwaysBeCasting;
