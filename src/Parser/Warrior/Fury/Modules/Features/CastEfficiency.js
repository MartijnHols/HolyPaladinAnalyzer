import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

import CoreCastEfficiency from 'Parser/Core/Modules/CastEfficiency';

// eslint-disable no-unused-vars

class CastEfficiency extends CoreCastEfficiency {
  static CPM_ABILITIES = [
    ...CoreCastEfficiency.CPM_ABILITIES,
    {
      spell: SPELLS.BLOODTHIRST,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 4.5 / (1 + haste),
      // Inner rage puts Raging Blow on a cooldown which indirectly adds more Bloodthirst to the rotation
      // Generally 80% is recommended for Inner Rage, 30% otherwise
      recommendedCastEfficiency: 0.3,
    },
    {
      spell: SPELLS.FURIOUS_SLASH,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => null,
    },
    {
      spell: SPELLS.EXECUTE_FURY,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => null,
    },
    {
      spell: SPELLS.RAGING_BLOW,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 4.5 / (1 + haste),
      recommendedCastEfficiency: 0.8,
      isActive: combatent => combatent.hasTalent(SPELLS.INNER_RAGE_TALENT.id),
    },
    {
      spell: SPELLS.RAGING_BLOW,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => null,
      recommendedCastEfficiency: 0.8,
      isActive: combatent => !combatent.hasTalent(SPELLS.INNER_RAGE_TALENT.id),
    },
    {
      spell: SPELLS.RAMPAGE,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => null, // Needs 85 rage, if using Frothing Berserker one should only Rampage whilst at 100 rage.
    },
    {
      spell: SPELLS.BATTLE_CRY,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 50, // TODO: Add custom function that depends on CoF (and Odyn's Champion) (RNG)
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.ODYNS_FURY,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 45,
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.AVATAR_TALENT,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 90,
      isActive: combatant => combatant.hasTalent(SPELLS.AVATAR_TALENT.id),
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.STORM_BOLT_TALENT,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 30,
      isActive: combatant => combatant.hasTalent(SPELLS.STORM_BOLT_TALENT.id),
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.SHOCKWAVE_TALENT,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 40,
      isActive: combatant => combatant.hasTalent(SPELLS.SHOCKWAVE_TALENT.id),
      recommendedCastEfficiency: 0.8,
      extraSuggestion: <span>Consider using <SpellLink id={SPELLS.DOUBLE_TIME_TALENT.id} /> or <SpellLink id={SPELLS.STORM_BOLT_TALENT.id} /> unless the CC is strictly needed.</span>,
    },
    {
      spell: SPELLS.BLOODBATH_TALENT,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 30,
      isActive: combatant => combatant.hasTalent(SPELLS.BLOODBATH_TALENT.id),
      recommendedCastEfficiency: 0.95,
    },
    {
      spell: SPELLS.BLADESTORM_TALENT,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 90,
      isActive: combatant => combatant.hasTalent(SPELLS.BLADESTORM_TALENT.id),
      recommendedCastEfficiency: 0.8,
    },
    {
      spell: SPELLS.DRAGON_ROAR_TALENT,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 25,
      isActive: combatant => combatant.hasTalent(SPELLS.DRAGON_ROAR_TALENT.id),
      recommendedCastEfficiency: 0.8,
    },
    {
      spell: SPELLS.WHIRLWIND_FURY,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL_AOE,
      getCooldown: haste => null,
      noSuggestion: true,
      noCanBeImproved: true,
      extraSuggestion: 'Only used in a combat with AoE or as a filler with the Wrecking Ball talent',
    },
    {
      spell: SPELLS.BERSERKER_RAGE,
      category: CastEfficiency.SPELL_CATEGORIES.UTILITY,
      getCooldown: haste => 60,
      noSuggestion: true,
      noCanBeImproved: true,
      extraSuggestion: <span>Only used in a combat with Fear, Sap or Incapacitate or if the <SpellLink id={SPELLS.OUTBURST_TALENT.id} /> is selected</span>,
    },
    {
      spell: SPELLS.ENRAGED_REGENERATION,
      category: CastEfficiency.SPELL_CATEGORIES.DEFENSIVE,
      getCooldown: haste => 120,
      noSuggestion: false,
      recommendedCastEfficiency: 0.01,
      noCanBeImproved: true,
      extraSuggestion: 'Use it to reduce damage taken for a short period.',
    },
    {
      spell: SPELLS.COMMANDING_SHOUT,
      category: CastEfficiency.SPELL_CATEGORIES.DEFENSIVE,
      getCooldown: haste => 180,
      noSuggestion: false,
      recommendedCastEfficiency: 0.01,
      noCanBeImproved: true,
      extraSuggestion: 'Use it to support your raid party.',
    },
    {
      spell: SPELLS.CHARGE,
      category: CastEfficiency.SPELL_CATEGORIES.UTILITY,
      getCooldown: haste => 17,
      noSuggestion: false,
      recommendedCastEfficiency: 0.01,
      noCanBeImproved: true,
      extraSuggestion: 'Use Charge to close the gap',
    },
    {
      spell: SPELLS.HEROIC_LEAP_FURY,
      category: CastEfficiency.SPELL_CATEGORIES.UTILITY,
      getCooldown: (haste, combatent) => combatent.hasTalent(SPELLS.BOUNDING_STRIDE_TALENT.id) ? 30 : 45,
      recommendedCastEfficiency: 0.01,
      extraSuggestion: <span>Consider using <SpellLink id={SPELLS.WARPAINT_TALENT.id} /> if the fight requires little mobility.</span>,
    },
    {
      spell: SPELLS.PUMMEL,
      category: CastEfficiency.SPELL_CATEGORIES.UTILITY,
      getCooldown: haste => 15,
      noSuggestion: true,
      noCanBeImproved: true,
    },
  ];
}

export default CastEfficiency;
