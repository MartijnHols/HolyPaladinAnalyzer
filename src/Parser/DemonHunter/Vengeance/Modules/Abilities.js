import React from 'react';
import SPELLS from 'common/SPELLS/index';
import ITEMS from 'common/ITEMS/index';
import ItemLink from 'common/ItemLink';
import SpellLink from 'common/SpellLink';
import CoreAbilities from 'Parser/Core/Modules/Abilities';

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.IMMOLATION_AURA,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 15 / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
          extraSuggestion: <React.Fragment>This is a great Pain filler spell. Try to always cast it on cooldown, specially when using <ItemLink id={ITEMS.KIREL_NARAK.id} /> legendary to trigger it's passive and/or using the <SpellLink id={SPELLS.FALLOUT_TALENT.id} /> talent in order to maximize your <SpellLink id={SPELLS.SOUL_FRAGMENT.id} /> generation.</React.Fragment>,
        },
      },
      {
        spell: SPELLS.DEMON_SPIKES,
        buffSpellId: SPELLS.DEMON_SPIKES_BUFF.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: haste => 15 / (1 + haste),
        charges: combatant.hasTalent(SPELLS.RAZOR_SPIKES_TALENT.id) ? 3 : 2,
      },
      {
        spell: SPELLS.FELBLADE_TALENT,
        enabled: combatant.hasTalent(SPELLS.FELBLADE_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 15,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: <React.Fragment>This is a great Pain generator spell and it does a single target DPS increase by just 30 Pain per cast. The only moment you can delay it's cast is if you already have 5 unused <SpellLink id={SPELLS.SOUL_FRAGMENT.id} />. </React.Fragment>,
        },
      },
      {
        spell: SPELLS.FEL_DEVASTATION_TALENT,
        enabled: combatant.hasTalent(SPELLS.FEL_DEVASTATION_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        cooldown: 60,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.75,
          extraSuggestion: <React.Fragment>This is a great healing and AoE damage burst spell. It costs just 30 Pain and should be definitively used as soon as it gets available. The only moment you can delay it's cast is if your <SpellLink id={SPELLS.FIERY_BRAND.id} /> (with the <SpellLink id={SPELLS.FIERY_DEMISE.id} /> artifact trait) is almost available. </React.Fragment>,
        },
      },
      {
        spell: SPELLS.SOUL_BARRIER_TALENT,
        buffSpellId: SPELLS.SOUL_BARRIER_TALENT.id,
        enabled: combatant.hasTalent(SPELLS.SOUL_BARRIER_TALENT.id),
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 30,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.50,
          extraSuggestion: <React.Fragment>This usage can be improved with <SpellLink id={SPELLS.SOUL_CARVER.id} /> for maximum efficiency. Also, this can be used more to soak burst instant damage when used with <SpellLink id={SPELLS.DEMON_SPIKES.id} /> for physical damage. </React.Fragment>,
        },
      },
      {
        spell: SPELLS.FRACTURE_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        enabled: combatant.hasTalent(SPELLS.FRACTURE_TALENT.id),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.FIERY_BRAND,
        buffSpellId: SPELLS.FIERY_BRAND_DEBUFF.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 60,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.50,
          extraSuggestion: <React.Fragment>Powerful CD. Use it during high damage moments.</React.Fragment>,
        },
      },
      {
        spell: SPELLS.METAMORPHOSIS_TANK,
        buffSpellId: SPELLS.METAMORPHOSIS_TANK.id,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 180,
      },
      {
        spell: SPELLS.THROW_GLAIVE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 3,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SHEAR,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SOUL_CLEAVE,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SPIRIT_BOMB_TALENT,
        buffSpellId: SPELLS.FRAILTY_SPIRIT_BOMB_DEBUFF.id,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SIGIL_OF_FLAME,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL_AOE,
        cooldown: 30 * (1 - combatant.hasTalent(SPELLS.QUICKENED_SIGILS_TALENT.id) ? 0.2 : 0),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.90,
          extraSuggestion: combatant.hasTalent(SPELLS.FLAME_CRASH_TALENT.id)?<React.Fragment>Line this up with <SpellLink id={SPELLS.INFERNAL_STRIKE.id} /> to double stack <SpellLink id={SPELLS.SIGIL_OF_FLAME.id} /> because of the <SpellLink id={SPELLS.FLAME_CRASH_TALENT.id} /> talent.</React.Fragment>:`Cast on cooldown for a dps increase.`,
        },
      },
      {
        spell: SPELLS.INFERNAL_STRIKE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 20,
        charges: 2,
      },
      {
        spell: SPELLS.SIGIL_OF_SILENCE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60 * (1 - combatant.hasTalent(SPELLS.QUICKENED_SIGILS_TALENT.id) ? 0.2 : 0),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.SIGIL_OF_MISERY,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60 * (1 - combatant.hasTalent(SPELLS.QUICKENED_SIGILS_TALENT.id) ? 0.2 : 0),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.IMPRISON,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.TORMENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
      },
      {
        spell: SPELLS.CONSUME_MAGIC,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
      },
      {
        spell: SPELLS.SIGIL_OF_CHAINS_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        enabled: combatant.hasTalent(SPELLS.SIGIL_OF_CHAINS_TALENT.id),
        cooldown: 90,
        gcd: {
          base: 1500,
        },
      },

    ];
  }
}

export default Abilities;
