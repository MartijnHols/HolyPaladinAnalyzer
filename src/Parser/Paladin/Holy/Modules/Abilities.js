import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';
import CoreAbilities from 'Parser/Core/Modules/Abilities';
import ISSUE_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    const hasSanctifiedWrath = combatant.hasTalent(SPELLS.SANCTIFIED_WRATH_TALENT.id);
    return [
      {
        spell: SPELLS.HOLY_SHOCK_CAST,
        buffSpellId: SPELLS.INFUSION_OF_LIGHT.id,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          const swCdr = (hasSanctifiedWrath && combatant.hasBuff(SPELLS.AVENGING_WRATH.id)) ? 0.5 : 0;
          return 9 / (1 + haste) * (1 - swCdr);
        },
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          extraSuggestion: 'Casting Holy Shock regularly is very important for performing well.',
        },
        timelineSortIndex: 0,
        isDefensive: true,
      },
      {
        spell: SPELLS.LIGHT_OF_DAWN_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        // Item - Paladin T20 Holy 2P Bonus: Reduces the cooldown of Light of Dawn by 2.0 sec.
        cooldown: haste => (12 - (combatant.hasBuff(SPELLS.HOLY_PALADIN_T20_2SET_BONUS_BUFF.id) ? 2 : 0)) / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          extraSuggestion: 'Casting Light of Dawn regularly is very important for performing well.',
        },
        timelineSortIndex: 10,
      },
      {
        spell: [SPELLS.JUDGMENT_CAST, SPELLS.JUDGMENT_CAST_ALT],
        buffSpellId: SPELLS.ILTERENDI_BUFF.id,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          const cdr = combatant.hasBuff(SPELLS.AVENGING_CRUSADER_TALENT.id) ? 0.3 : 0;
          return 12 / (1 + haste) * (1 - cdr);
        },
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: combatant.hasTalent(SPELLS.JUDGMENT_OF_LIGHT_TALENT.id) || combatant.hasFinger(ITEMS.ILTERENDI_CROWN_JEWEL_OF_SILVERMOON.id),
          extraSuggestion: (
            <React.Fragment>
              You should cast it whenever <SpellLink id={SPELLS.JUDGMENT_OF_LIGHT_TALENT.id} /> has dropped, which is usually on cooldown without delay. Alternatively you can ignore the debuff and just cast it whenever Judgment is available; there's nothing wrong with ignoring unimportant things to focus on important things.
            </React.Fragment>
          ),
          recommendedEfficiency: 0.85, // this rarely overheals, so keeping this on cooldown is pretty much always best
        },
        timelineSortIndex: 20,
      },
      {
        spell: SPELLS.BESTOW_FAITH_TALENT,
        buffSpellId: SPELLS.BESTOW_FAITH_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 12,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.7,
          extraSuggestion: (
            <React.Fragment>
              If you can't or don't want to cast it more consider using <SpellLink id={SPELLS.LIGHTS_HAMMER_TALENT.id} /> or <SpellLink id={SPELLS.CRUSADERS_MIGHT_TALENT.id} /> instead.
            </React.Fragment>
          ),
        },
        timelineSortIndex: 15,
        enabled: combatant.hasTalent(SPELLS.BESTOW_FAITH_TALENT.id),
      },
      {
        spell: SPELLS.LIGHTS_HAMMER_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 15,
        enabled: combatant.hasTalent(SPELLS.LIGHTS_HAMMER_TALENT.id),
      },
      {
        spell: SPELLS.BEACON_OF_VIRTUE_TALENT,
        buffSpellId: SPELLS.BEACON_OF_VIRTUE_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 15,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 25,
        enabled: combatant.hasTalent(SPELLS.BEACON_OF_VIRTUE_TALENT.id),
      },
      {
        spell: SPELLS.CRUSADER_STRIKE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => {
          const cdr = combatant.hasBuff(SPELLS.AVENGING_CRUSADER_TALENT.id) ? 0.3 : 0;
          return 6 / (1 + haste) * (1 - cdr);
        },
        charges: 2,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          extraSuggestion: (
            <React.Fragment>
              When you are using <SpellLink id={SPELLS.CRUSADERS_MIGHT_TALENT.id} /> it is important to use <SpellLink id={SPELLS.CRUSADER_STRIKE.id} /> often enough to benefit from the talent. Use a different talent if you are unable to.
            </React.Fragment>
          ),
          recommendedEfficiency: 0.35,
        },
        timelineSortIndex: 50,
        enabled: combatant.hasTalent(SPELLS.CRUSADERS_MIGHT_TALENT.id),
      },
      {
        spell: SPELLS.HOLY_PRISM_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 20,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 11,
        enabled: combatant.hasTalent(SPELLS.HOLY_PRISM_TALENT.id),
        isDefensive: true,
      },
      {
        spell: SPELLS.RULE_OF_LAW_TALENT,
        buffSpellId: SPELLS.RULE_OF_LAW_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 30,
        gcd: null,
        charges: 2,
        timelineSortIndex: 30,
        enabled: combatant.hasTalent(SPELLS.RULE_OF_LAW_TALENT.id),
      },
      {
        spell: SPELLS.DIVINE_PROTECTION,
        buffSpellId: SPELLS.DIVINE_PROTECTION.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 60 * (1 - (combatant.hasTalent(SPELLS.UNBREAKABLE_SPIRIT_TALENT.id) ? 0.3 : 0)),
        gcd: null,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.6,
          importance: ISSUE_IMPORTANCE.MINOR,
        },
        timelineSortIndex: 45,
        isDefensive: true,
      },
      {
        spell: SPELLS.DIVINE_SHIELD,
        buffSpellId: SPELLS.DIVINE_SHIELD.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: (5 * 60) * (1 - (combatant.hasTalent(SPELLS.UNBREAKABLE_SPIRIT_TALENT.id) ? 0.3 : 0)),
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 46,
        isDefensive: true,
      },
      {
        spell: SPELLS.ARCANE_TORRENT_MANA,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 90,
        gcd: null,
        isUndetectable: true,
        timelineSortIndex: 35,
      },
      {
        spell: SPELLS.HOLY_AVENGER_TALENT,
        buffSpellId: SPELLS.HOLY_AVENGER_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 90,
        gcd: null,
        enabled: combatant.hasTalent(SPELLS.HOLY_AVENGER_TALENT.id),
        timelineSortIndex: 33,
      },
      {
        spell: SPELLS.AVENGING_WRATH,
        buffSpellId: SPELLS.AVENGING_WRATH.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        gcd: null,
        timelineSortIndex: 32,
        enabled: !combatant.hasTalent(SPELLS.AVENGING_CRUSADER_TALENT.id),
      },
      {
        spell: SPELLS.AVENGING_CRUSADER_TALENT,
        buffSpellId: SPELLS.AVENGING_CRUSADER_TALENT.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        gcd: null,
        timelineSortIndex: 32,
        enabled: combatant.hasTalent(SPELLS.AVENGING_CRUSADER_TALENT.id),
      },
      {
        spell: SPELLS.AURA_MASTERY,
        buffSpellId: SPELLS.AURA_MASTERY.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        gcd: null,
        timelineSortIndex: 34,
      },
      {
        spell: SPELLS.BLESSING_OF_SACRIFICE,
        buffSpellId: SPELLS.BLESSING_OF_SACRIFICE.id,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 150,
        gcd: null,
        timelineSortIndex: 101,
      },
      {
        spell: SPELLS.LAY_ON_HANDS,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 600 * (1 - (combatant.hasTalent(SPELLS.UNBREAKABLE_SPIRIT_TALENT.id) ? 0.3 : 0)),
        gcd: null,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.1,
        },
        timelineSortIndex: 101,
        isDefensive: true,
      },
      {
        spell: SPELLS.LIGHT_OF_THE_MARTYR,
        buffSpellId: SPELLS.MARAADS_DYING_BREATH_BUFF.id,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 19,
      },
      {
        spell: SPELLS.FLASH_OF_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        channel: haste => 1.5 / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `Filler ${SPELLS.FLASH_OF_LIGHT.name}`,
          casts: castCount => (castCount.casts || 0) - (castCount.healingIolHits || 0),
        },
        timelineSortIndex: 1,
      },
      {
        spell: SPELLS.FLASH_OF_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        channel: haste => 1.5 / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `${SPELLS.INFUSION_OF_LIGHT.name} ${SPELLS.FLASH_OF_LIGHT.name}`,
          casts: castCount => castCount.healingIolHits || 0,
        },
        timelineSortIndex: 1,
      },
      {
        spell: SPELLS.HOLY_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `Filler ${SPELLS.HOLY_LIGHT.name}`,
          casts: castCount => (castCount.casts || 0) - (castCount.healingIolHits || 0),
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.HOLY_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          name: `${SPELLS.INFUSION_OF_LIGHT.name} ${SPELLS.HOLY_LIGHT.name}`,
          casts: castCount => castCount.healingIolHits || 0,
        },
        timelineSortIndex: 2,
      },
      {
        spell: SPELLS.DIVINE_STEED,
        buffSpellId: SPELLS.DIVINE_STEED_BUFF.id,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        charges: combatant.hasTalent(SPELLS.CAVALIER_TALENT.id) ? 2 : 1,
        cooldown: 45,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 44,
        isDefensive: true,
      },
      {
        spell: SPELLS.CLEANSE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 100,
        isDefensive: true,
      },
      {
        spell: SPELLS.BLESSING_OF_FREEDOM,
        buffSpellId: SPELLS.BLESSING_OF_FREEDOM.id,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 25,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 102,
        isDefensive: true,
      },
      {
        spell: SPELLS.BLESSING_OF_PROTECTION,
        buffSpellId: SPELLS.BLESSING_OF_PROTECTION.id,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 5 * 60,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 103,
        isDefensive: true,
      },
      {
        spell: SPELLS.BEACON_OF_LIGHT_CAST_AND_BUFF,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 110,
        enabled: combatant.hasTalent(SPELLS.DIVINE_PURPOSE_TALENT_HOLY.id),
      },
      {
        // The primary beacon cast is registered as BEACON_OF_LIGHT_CAST_AND_BUFF
        spell: [SPELLS.BEACON_OF_FAITH_TALENT, SPELLS.BEACON_OF_LIGHT_CAST_AND_BUFF],
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        timelineSortIndex: 110,
        enabled: combatant.hasTalent(SPELLS.BEACON_OF_FAITH_TALENT.id),
      },
      {
        spell: SPELLS.CRUSADER_STRIKE,
        category: Abilities.SPELL_CATEGORIES.HEALER_DAMAGING_SPELL,
        cooldown: haste => {
          const cdr = combatant.hasBuff(SPELLS.AVENGING_CRUSADER_TALENT.id) ? 0.3 : 0;
          return 6 / (1 + haste) * (1 - cdr);
        },
        charges: 2,
        timelineSortIndex: 50,
        enabled: !combatant.hasTalent(SPELLS.CRUSADERS_MIGHT_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CONSECRATION_CAST,
        category: Abilities.SPELL_CATEGORIES.HEALER_DAMAGING_SPELL,
        cooldown: haste => 4.5 / (1 + haste),
        timelineSortIndex: 51,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLINDING_LIGHT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 90,
        timelineSortIndex: 104,
        enabled: combatant.hasTalent(SPELLS.BLINDING_LIGHT_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HAMMER_OF_JUSTICE,
        buffSpellId: SPELLS.HAMMER_OF_JUSTICE.id,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60,
        timelineSortIndex: 105,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HAND_OF_RECKONING,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: null,
        timelineSortIndex: 106,
      },
    ];
  }
}

export default Abilities;
