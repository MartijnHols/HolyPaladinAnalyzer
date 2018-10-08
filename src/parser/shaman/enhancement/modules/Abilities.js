import SPELLS from 'common/SPELLS';

import CoreAbilities from 'parser/shared/modules/Abilities';

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.ASCENDANCE_TALENT_ENHANCEMENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        enabled: combatant.hasTalent(SPELLS.ASCENDANCE_TALENT_ENHANCEMENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 1.0,
        },
      },
      {
        spell: SPELLS.EARTHEN_SPIKE_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        enabled: combatant.hasTalent(SPELLS.EARTHEN_SPIKE_TALENT.id),
        cooldown: 20,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.FERAL_SPIRIT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.LIGHTNING_BOLT_ENHANCE,
        category: Abilities.SPELL_CATEGORIES.OTHERS, // 1.5 / (1 + haste)
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.WIND_SHEAR,
        category: Abilities.SPELL_CATEGORIES.OTHERS, // 1.5 / (1 + haste)
      },
      {
        spell: SPELLS.ROCKBITER,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, // 1.5 / (1 + haste)
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FROSTBRAND,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        enabled: combatant.hasTalent(SPELLS.FROSTBRAND.id), // 1.5 / (1 + haste)
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FLAMETONGUE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, // 1.5 / (1 + haste)
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.STORMSTRIKE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, // 1.5 / (1 + haste)
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.LAVA_LASH,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, // 1.5 / (1 + haste)
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.WINDSTRIKE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, // 1.5 / (1 + haste)
      },
      {
        spell: SPELLS.CRASH_LIGHTNING,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE, // 1.5 / (1 + haste)
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FERAL_LUNGE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
      },
      {
        spell: SPELLS.SPIRIT_WALK,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60,
      },
      {
        spell: SPELLS.CAPACITOR_TOTEM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 60,
      },
      {
        spell: SPELLS.HEALING_SURGE_ENHANCE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.GHOST_WOLF,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.ASTRAL_SHIFT,
        buffSpellId: SPELLS.ASTRAL_SHIFT.id,
        cooldown: 90,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
      },
      {
        spell: SPELLS.FURY_OF_AIR_TALENT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.FURY_OF_AIR_TALENT.id),
      },
      {
        spell: SPELLS.SUNDERING_TALENT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.SUNDERING_TALENT.id),
      },
      {
        spell: SPELLS.REINCARNATION,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLOODLUST,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: {
          base: 1500,
        },
      },{
        spell: SPELLS.BERSERKING,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        isUndetectable: true,
        gcd: null,
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: [SPELLS.BLOOD_FURY_PHYSICAL, SPELLS.BLOOD_FURY_SPELL_AND_PHYSICAL, SPELLS.BLOOD_FURY_SPELL],
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        isUndetectable: true,
        gcd: null,
        castEfficiency: {
          suggestion: true,
        },
      },
    ];
  }
}

export default Abilities;
