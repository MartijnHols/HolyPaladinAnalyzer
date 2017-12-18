import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import ISSUE_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';
import CoreAbilities from 'Parser/Core/Modules/Abilities';

/* eslint-disable no-unused-vars */

class Abilities extends CoreAbilities {
  static ABILITIES = [
    ...CoreAbilities.ABILITIES,
    // Riptide with EotE
    {
      spell: SPELLS.RIPTIDE,
      category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
      charges: 2,
      getCooldown: haste => 6,
      isActive: combatant => combatant.hasTalent(SPELLS.ECHO_OF_THE_ELEMENTS_TALENT.id) || combatant.hasFinger(ITEMS.SOUL_OF_THE_FARSEER.id),
      majorIssueEfficiency: 0.50,
      averageIssueEfficiency: 0.70,
      recommendedEfficiency: 0.90,
    },
    // Riptide without EotE
    {
      spell: SPELLS.RIPTIDE,
      category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
      getCooldown: haste => 6,
      isActive: combatant => !(combatant.hasTalent(SPELLS.ECHO_OF_THE_ELEMENTS_TALENT.id) || combatant.hasFinger(ITEMS.SOUL_OF_THE_FARSEER.id)),
      majorIssueEfficiency: 0.50,
      averageIssueEfficiency: 0.70,
      recommendedEfficiency: 0.90,
    },
    {
      spell: SPELLS.HEALING_STREAM_TOTEM_CAST,
      category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
      charges: 2,
      getCooldown: (haste, combatant) => {
        const has4PT19 = combatant.hasBuff(SPELLS.RESTORATION_SHAMAN_T19_4SET_BONUS_BUFF.id);

        if (!has4PT19) {
          return 30;
        }

        const abilityTracker = combatant.owner.modules.abilityTracker;

        const riptideCasts = abilityTracker.getAbility(SPELLS.RIPTIDE.id).casts || 0;
        const chainHealCasts = abilityTracker.getAbility(SPELLS.CHAIN_HEAL.id).casts || 0;
        const reducedCD = 3 * (riptideCasts + chainHealCasts);
        const extraHsts = reducedCD / 30;

        const fightDuration = combatant.owner.fightDuration / 1000;
        const potentialHstCasts = fightDuration / 30 + 1;
        const newPotentialHstCasts = potentialHstCasts + extraHsts;

        const cooldown = fightDuration / newPotentialHstCasts;

        return cooldown;
      },
      majorIssueEfficiency: 0.50,
      averageIssueEfficiency: 0.70,
      recommendedEfficiency: 0.90,
    },
    {
      spell: SPELLS.ASTRAL_SHIFT,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 90,
      recommendedEfficiency: 0.6,
      importance: ISSUE_IMPORTANCE.MINOR,
    },
    {
      spell: SPELLS.ARCANE_TORRENT_MANA,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 90,
      isUndetectable: true,
    },
    {
      spell: SPELLS.HEALING_RAIN_CAST,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 10,
      majorIssueEfficiency: 0.30,
      averageIssueEfficiency: 0.50,
      recommendedEfficiency: 0.70,
    },
    {
      spell: SPELLS.GIFT_OF_THE_QUEEN,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 45,
      majorIssueEfficiency: 0.6,
      averageIssueEfficiency: 0.8,
      recommendedEfficiency: 0.90,
    },
    {
      spell: SPELLS.CLOUDBURST_TOTEM_TALENT,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 30,
      isActive: combatant => combatant.lv90Talent === SPELLS.CLOUDBURST_TOTEM_TALENT.id,
      majorIssueEfficiency: 0.50,
      averageIssueEfficiency: 0.70,
      recommendedEfficiency: 0.90,
    },
    {
      spell: SPELLS.EARTHEN_SHIELD_TOTEM_TALENT,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 60,
      isActive: combatant => combatant.lv75Talent === SPELLS.EARTHEN_SHIELD_TOTEM_TALENT.id,
    },
    {
      spell: SPELLS.ANCESTRAL_GUIDANCE_TALENT,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 120,
      isActive: combatant => combatant.lv60Talent === SPELLS.ANCESTRAL_GUIDANCE_TALENT.id,
    },
    {
      spell: SPELLS.ASCENDANCE_TALENT_RESTORATION,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 180,
      isActive: combatant => combatant.lv100Talent === SPELLS.ASCENDANCE_TALENT_RESTORATION.id,
    },
    {
      spell: SPELLS.HEALING_TIDE_TOTEM_CAST,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 180,
      majorIssueEfficiency: 0.50,
      averageIssueEfficiency: 0.666,
      recommendedEfficiency: 1.0,
    },
    {
      spell: SPELLS.SPIRIT_LINK_TOTEM,
      category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
      getCooldown: haste => 180,
      majorIssueEfficiency: 0.50,
      averageIssueEfficiency: 0.666,
      recommendedEfficiency: 1.0,
    },
    {
      spell: SPELLS.HEALING_WAVE,
      name: `Filler ${SPELLS.HEALING_WAVE.name}`,
      category: Abilities.SPELL_CATEGORIES.OTHERS,
      getCasts: castCount => (castCount.casts || 0) - (castCount.healingTwHits || 0),
      getCooldown: haste => null,
    },
    {
      spell: SPELLS.HEALING_WAVE,
      name: `Tidal Waves ${SPELLS.HEALING_WAVE.name}`,
      category: Abilities.SPELL_CATEGORIES.OTHERS,
      getCasts: castCount => castCount.healingTwHits || 0,
      getCooldown: haste => null,
    },
    {
      spell: SPELLS.HEALING_SURGE_RESTORATION,
      name: `Filler ${SPELLS.HEALING_SURGE_RESTORATION.name}`,
      category: Abilities.SPELL_CATEGORIES.OTHERS,
      getCasts: castCount => (castCount.casts || 0) - (castCount.healingTwHits || 0),
      getCooldown: haste => null,
    },
    {
      spell: SPELLS.HEALING_SURGE_RESTORATION,
      name: `Tidal Waves ${SPELLS.HEALING_SURGE_RESTORATION.name}`,
      category: Abilities.SPELL_CATEGORIES.OTHERS,
      getCasts: castCount => castCount.healingTwHits || 0,
      getCooldown: haste => null,
    },
  ];
}

export default Abilities;
