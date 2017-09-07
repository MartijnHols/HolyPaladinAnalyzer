import React from 'react';
import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import ItemLink from 'common/ItemLink';
import SpellLink from 'common/SpellLink';
import CoreCastEfficiency from 'Parser/Core/Modules/CastEfficiency';

class CastEfficiency extends CoreCastEfficiency {
  static CPM_ABILITIES = [
    ...CoreCastEfficiency.CPM_ABILITIES,
    {
      spell: SPELLS.IMMOLATION_AURA,
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 15 / (1 + haste),
      recommendedCastEfficiency: 0.95,
      extraSuggestion: <span>This is a great Pain filler spell. Try to always cast it on cooldown, specially when using <ItemLink id={ITEMS.KIREL_NARAK.id} /> legendary to trigger it's passive and/or using the <SpellLink id={SPELLS.FALLOUT_TALENT.id} /> talent in order to maximize your <SpellLink id={SPELLS.SOUL_FRAGMENT.id} /> generation. </span>,
    },
    {
      spell: SPELLS.SIGIL_OF_FLAME_DEBUFF,
      isActive: combatant => (combatant.hasTalent(SPELLS.FLAME_CRASH_TALENT.id) || combatant.hasWrists(ITEMS.THE_DEFILERS_LOST_VAMBRACES.id)),
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 9,
      recommendedCastEfficiency: 0.9,
      extraSuggestion: <span>This is a great fire DoT spell. Try to always cast it on cooldown, specially when using <SpellLink id={SPELLS.FLAME_CRASH_TALENT.id} /> talent to apply it just by using <SpellLink id={SPELLS.INFERNAL_STRIKE.id} /> ability and/or using the <ItemLink id={ITEMS.THE_DEFILERS_LOST_VAMBRACES.id} /> legendary to reduce it's cooldown. </span>,
    },
    {
      spell: SPELLS.SIGIL_OF_FLAME_DEBUFF,
      isActive: combatant => !(combatant.hasTalent(SPELLS.FLAME_CRASH_TALENT.id) || combatant.hasWrists(ITEMS.THE_DEFILERS_LOST_VAMBRACES.id)),
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 30 / (1 + haste),
      recommendedCastEfficiency: 0.8,
      extraSuggestion: <span>This is a great fire DoT spell. Try to always cast it on cooldown. </span>,
    },
    {
      spell: SPELLS.DEMON_SPIKES,
      isActive: combatant => combatant.hasTalent(SPELLS.RAZOR_SPIKES_TALENT.id),
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 15 / (1 + haste),
      recommendedCastEfficiency: 1.0,
      extraSuggestion: <span>This is a great physical reduction spell and it also provides a great physical damage increase in your case, giving your <SpellLink id={SPELLS.RAZOR_SPIKES_TALENT.id} /> talent choice. Try to always cast it on cooldown. </span>,
    },
    {
      spell: SPELLS.DEMON_SPIKES,
      isActive: combatant => !(combatant.hasTalent(SPELLS.RAZOR_SPIKES_TALENT.id)),
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 15 / (1 + haste),
      recommendedCastEfficiency: 0.75,
      extraSuggestion: <span>This is a great physical reduction spell. Try to always cast it as soons as it gets available or when you expect a higher physical damage. </span>,
    },
    {
      spell: SPELLS.SOUL_CARVER,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 40,
      recommendedCastEfficiency: 0.9,
      extraSuggestion: <span>This is your cooldown <SpellLink id={SPELLS.SOUL_FRAGMENT.id} /> generator spell and it does the higher damage / casting time of all your abilities. The only moment you can delay it's cast is if you already have 5 unused <SpellLink id={SPELLS.SOUL_FRAGMENT.id} /> or if you are waiting for a damage burst combo with <SpellLink id={SPELLS.FIERY_BRAND.id} /> (with the <SpellLink id={SPELLS.FIERY_DEMISE.id} /> artifact trait). </span>,
    },
    {
      spell: SPELLS.FRACTURE_TALENT,
      isActive: combatant => combatant.hasTalent(SPELLS.FRACTURE_TALENT.id),
      category: CastEfficiency.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 5,
      recommendedCastEfficiency: 0.7,
      extraSuggestion: <span>This is your main <SpellLink id={SPELLS.SOUL_FRAGMENT.id} /> generator spell and it does a single target DPS increase by just 30 Pain per cast. The only moment you can delay it's cast is if you already have 5 unused <SpellLink id={SPELLS.SOUL_FRAGMENT.id} />. </span>,
    },
    {
      spell: SPELLS.FELBLADE_TALENT,
      isActive: combatant => combatant.hasTalent(SPELLS.FELBLADE_TALENT.id),
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 15,
      recommendedCastEfficiency: 0.90,
      extraSuggestion: <span>This is a great Pain generator spell and it does a single target DPS increase by just 30 Pain per cast. The only moment you can delay it's cast is if you already have 5 unused <SpellLink id={SPELLS.SOUL_FRAGMENT.id} />. </span>,
    },
    {
      spell: SPELLS.FEL_ERUPTION_TALENT,
      isActive: combatant => combatant.hasTalent(SPELLS.FEL_ERUPTION_TALENT.id),
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 30,
      recommendedCastEfficiency: 0.95,
      extraSuggestion: <span>This is a great Chaos burst damage spell and it does a huge single target DPS increase by just 10 Pain per cast. Should definitively be used as soon as it gets available. </span>,
    },
    {
      spell: SPELLS.FEL_DEVASTATION_TALENT,
      isActive: combatant => combatant.hasTalent(SPELLS.FEL_DEVASTATION_TALENT.id),
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 60,
      recommendedCastEfficiency: 0.55,
      extraSuggestion: <span>This is a great healing and AoE damage burst spell. It costs just 30 Pain and should be definitively used as soon as it gets available. The only moment you can delay it's cast is if your <SpellLink id={SPELLS.FIERY_BRAND.id} /> (with the <SpellLink id={SPELLS.FIERY_DEMISE.id} /> artifact trait) is almost available. </span>,
    },
    {
      spell: SPELLS.SOUL_BARRIER_TALENT,
      isActive: combatant => combatant.hasTalent(SPELLS.SOUL_BARRIER_TALENT.id),
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 30,
      recommendedCastEfficiency: 0.50,
      extraSuggestion: <span>This usage can be improved with <SpellLink id={SPELLS.SOUL_CARVER.id} /> for maximum efficiency. Also, this can be used more to soak burst instant damage when used with <SpellLink id={SPELLS.DEMON_SPIKES.id} /> for physical damage or with <SpellLink id={SPELLS.EMPOWER_WARDS.id} /> for magical damage. </span>,
    },
    {
      spell: SPELLS.EMPOWER_WARDS,
      category: CastEfficiency.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 20,
      recommendedCastEfficiency: 0.50,
      noSuggestion: true,
    },
  ];
}

export default CastEfficiency;
