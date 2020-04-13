import SPELLS from 'common/SPELLS';

import CoreAbilities from 'parser/core/modules/Abilities';
import { SpellbookAbility } from 'parser/core/modules/Ability';
import SpellLink from 'common/SpellLink';
import React from 'react';
import calculateMaxCasts from 'parser/core/calculateMaxCasts';

class Abilities extends CoreAbilities {
  spellbook(): SpellbookAbility[] {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.ASCENDANCE_TALENT_ENHANCEMENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.ASCENDANCE_TALENT_ENHANCEMENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 1.0,
        },
      },
      {
        spell: SPELLS.FERAL_SPIRIT,
        buffSpellId: [ //Feral Spirit isn't an actual buff, so we can only show the Elemental
                       // Spirits buffs
          SPELLS.ELEMENTAL_SPIRITS_BUFF_MOLTEN_WEAPON.id,
          SPELLS.ELEMENTAL_SPIRITS_BUFF_ICY_EDGE.id,
          SPELLS.ELEMENTAL_SPIRITS_BUFF_CRACKLING_SURGE.id,
        ],
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: combatant.hasTalent(SPELLS.ELEMENTAL_SPIRITS_TALENT)
          ? 90
          : 120,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.EARTH_ELEMENTAL,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 300,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.8,
          extraSuggestion: (
            <>
              The total damage that it deals is equal to 2-3 GCDs. Additionally their attacks have a chance to trigger <SpellLink id={SPELLS.STORMBRINGER_BUFF.id} />, weapon enchantments, azerite traits and essence effects. (Corruption effects have not been confirmed.)
            </>
          ),
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
        spell: SPELLS.TOTEM_MASTERY_TALENT_ENHANCEMENT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        enabled: combatant.hasTalent(SPELLS.TOTEM_MASTERY_TALENT_ENHANCEMENT.id),
        gcd: {
          base: 1000,
        },
        cooldown: 120,
      },
      {
        spell: SPELLS.LIGHTNING_BOLT_ENHANCE,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        cooldown: combatant.hasTalent(SPELLS.OVERCHARGE_TALENT) ? 7.5 : 0,
        gcd: {
          base: 1500,
        },
        isUndetectable: true,
      },
      {
        spell: SPELLS.WIND_SHEAR,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        cooldown: 12,
        gcd: undefined,
      },
      {
        spell: SPELLS.ROCKBITER,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        charges: 2,
        cooldown: haste => (
            combatant.hasTalent(SPELLS.BOULDERFIST_TALENT.id) ? 6 * 0.85 : 6
          ) /
          (
            1 + haste
          ),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FROSTBRAND,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FLAMETONGUE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
        cooldown: haste => 12 /
          (
            1 + haste
          ),
      },
      {
        spell: SPELLS.STORMSTRIKE_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 9 /
          (
            1 + haste
          ),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.LAVA_LASH,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CRASH_LIGHTNING,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        gcd: {
          base: 1500,
        },
        cooldown: haste => 6 /
          (
            1 + haste
          ),
      },
      {
        spell: SPELLS.FERAL_LUNGE_TALENT,
        enabled: combatant.hasTalent(SPELLS.FERAL_LUNGE_TALENT),
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
      },
      {
        spell: SPELLS.SPIRIT_WALK,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60,
      },
      {
        spell: SPELLS.GHOST_WOLF,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CAPACITOR_TOTEM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 60,
        isUndetectable: true,
      },
      {
        spell: SPELLS.EARTHBIND_TOTEM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 30,
        isUndetectable: true,
      },
      {
        spell: SPELLS.TREMOR_TOTEM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        cooldown: 60,
        isUndetectable: true,
      },
      {
        spell: SPELLS.WIND_RUSH_TOTEM_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: combatant.hasTalent(SPELLS.WIND_RUSH_TOTEM_TALENT),
        gcd: {
          base: 1500,
        },
        cooldown: 120,
      },
      {
        spell: SPELLS.HEALING_SURGE_ENHANCE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        isUndetectable: true,
      },
      {
        spell: SPELLS.WINDSTRIKE_CAST,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        enabled: combatant.hasTalent(SPELLS.ASCENDANCE_TALENT_ENHANCEMENT.id),
        cooldown: haste => 3 /
          (
            1 + haste
          ),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.85,
          maxCasts: cooldown => calculateMaxCasts(
            cooldown,
            combatant.getBuffUptime(SPELLS.ASCENDANCE_TALENT_ENHANCEMENT.id),
          ),
        },
      },
      {
        spell: SPELLS.PURGE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        gcd: {
          base: 1500,
        },
        isUndetectable: true,
      },
      {
        spell: SPELLS.HEX,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 30,
        gcd: {
          base: 1500,
        },
        isUndetectable: true,
      },
      {
        spell: SPELLS.CLEANSE_SPIRIT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: {
          base: 1500,
        },
        isUndetectable: true,
      },
      {
        spell: SPELLS.ASTRAL_SHIFT,
        buffSpellId: SPELLS.ASTRAL_SHIFT.id,
        cooldown: 90,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        isDefensive: true,
      },
      {
        spell: SPELLS.FURY_OF_AIR_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
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
        cooldown: 40,
      },
      {
        spell: SPELLS.LIGHTNING_SHIELD_TALENT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: undefined,
        enabled: combatant.hasTalent(SPELLS.LIGHTNING_SHIELD_TALENT.id),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0,
        },
        isUndetectable: true,
      },
      {
        spell: SPELLS.REINCARNATION,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        gcd: {
          base: 1500,
        },
        isUndetectable: true,
      },
      {
        spell: [SPELLS.BLOODLUST, SPELLS.HEROISM],
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        gcd: undefined,
        isUndetectable: true,
      },
      {
        spell: [
          SPELLS.BLOOD_FURY_PHYSICAL,
          SPELLS.BLOOD_FURY_SPELL_AND_PHYSICAL,
          SPELLS.BLOOD_FURY_SPELL,
        ],
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        isUndetectable: true,
        gcd: undefined,
        castEfficiency: {
          suggestion: true,
        },
      },
    ];
  }
}

export default Abilities;