import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import AbilityTracker from 'Parser/Core/Modules/AbilityTracker';
import Haste from 'Parser/Core/Modules/Haste';
import ISSUE_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';
import CoreAbilities from 'Parser/Core/Modules/Abilities';
import UnleashedDemons from './Traits/UnleashedDemons';

class Abilities extends CoreAbilities {
  static dependencies = {
    unleashedDemons: UnleashedDemons,
    abilityTracker: AbilityTracker,
    haste: Haste,
  };

  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.FURY_OF_THE_ILLIDARI,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
          extraSuggestion: `This does a huge ammount of AoE passive damage and it's one of the main damage spells for Havoc Demon Hunters. You should cast it as soon as it become available. The only moment you can delay it's cast is if you already expect an add wave to maximize it's efficiency and damage output.`,
        },
      },
      {
        spell: SPELLS.METAMORPHOSIS_HAVOC,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 300 - this.unleashedDemons.traitCooldownReduction,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
        },
      },
      {
        spell: SPELLS.NEMESIS_TALENT,
        enabled: combatant.hasTalent(SPELLS.NEMESIS_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
          extraSuggestion: 'This is your main damage increase buff. You should use it as much as you can to maximize your damage output.',
        },
      },
      {
        spell: SPELLS.CHAOS_BLADES_TALENT,
        enabled: combatant.hasTalent(SPELLS.CHAOS_BLADES_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 120,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
          extraSuggestion: `This plus Nemesis and Metamorphosis make up your huge windows.`,
          importance: ISSUE_IMPORTANCE.MAJOR,
        },
      },
      {
        spell: SPELLS.FEL_ERUPTION_TALENT,
        enabled: combatant.hasTalent(SPELLS.FEL_ERUPTION_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 30,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.95,
          extraSuggestion: 'This is a great Chaos burst damage spell and it does a huge single target DPS increase by just 10 Fury per cast. Should definitively be used as soon as it gets available.',
        },
      },
      {
        spell: SPELLS.FEL_BARRAGE_TALENT,
        enabled: combatant.hasTalent(SPELLS.FEL_BARRAGE_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.85,
          extraSuggestion: `This is a great AoE damage spell, but also does a great damage on single target. You should cast it as soon as it gets off cooldown. The only moment you can delay it's cast is if you already expect an add wave to maximize it's efficiency and damage output.`,
        },
      },
      {
        spell: SPELLS.FELBLADE_TALENT,
        enabled: combatant.hasTalent(SPELLS.FELBLADE_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 15 / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.85,
          extraSuggestion: 'This is your main Fury filler spell. Try to always cast on cooldown, but beware to not waste the Fury generation it provides. So use it when you have 30 or more Fury missing. And also it can be used to charge to the desired target, making it very strong movement spell.',
        },
      },
      {
        spell: SPELLS.EYE_BEAM,
        enabled: !combatant.hasTalent(SPELLS.DEMONIC_TALENT.id) && !combatant.hasBuff(SPELLS.HAVOC_T21_4PC_BONUS.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 45,
        gcd: {
          base: 1500,
        },
      },
      //T21 Eye Beam
      {
        spell: SPELLS.EYE_BEAM,
        enabled: combatant.hasTalent(SPELLS.DEMONIC_TALENT.id) || combatant.hasBuff(SPELLS.HAVOC_T21_4PC_BONUS.id),
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 45,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: .9,
          extraSuggestion: <React.Fragment>With <SpellLink id={SPELLS.DEMONIC_TALENT.id} icon /> or <SpellLink id={SPELLS.HAVOC_T21_4PC_BONUS.id} icon /> you should be using <SpellLink id={SPELLS.EYE_BEAM.id} icon /> as much as possible to have high uptime on <SpellLink id={SPELLS.METAMORPHOSIS_HAVOC.id} icon /> and/or <SpellLink id={SPELLS.HAVOC_T21_4PC_BUFF.id} icon />.</React.Fragment>,
        },
      },
      {
        spell: SPELLS.DEMONS_BITE,
        enabled: !combatant.hasTalent(SPELLS.DEMON_BLADES_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.CHAOS_STRIKE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.ANNIHILATION,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLADE_DANCE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, //10 / (1 + haste),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.DEATH_SWEEP,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL, //8 / (1+ haste),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.THROW_GLAIVE_HAVOC,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        charges: combatant.hasTalent(SPELLS.MASTER_OF_THE_GLAIVE_TALENT.id) ? 2 : 1,
        cooldown: haste => 10 / (1 + haste),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FEL_RUSH,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        charges: 2,
        cooldown: 10,
        gcd: {
          static: 250,
        },
      },
      {
        spell: SPELLS.VENGEFUL_RETREAT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 25,
        // Not actually on the GCD but blocks all spells during its animation for 1 second. The issue is you can follow up any ability on the GCD with Vengeful Retreat, so it can still cause overlap.
        gcd: null,
      },
      {
        spell: SPELLS.BLUR,
        buffSpellId: SPELLS.BLUR.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 60,
      },
      {
        spell: SPELLS.DARKNESS,
        buffSpellId: SPELLS.DARKNESS.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 180,
      },
      {
        spell: SPELLS.CHAOS_NOVA,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: combatant.hasTalent(SPELLS.UNLEASHED_POWER_TALENT.id) ? 40 : 60,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.NETHERWALK_TALENT,
        enabled: combatant.hasTalent(SPELLS.NETHERWALK_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 120,
      },
    ];
  }
}

export default Abilities;
