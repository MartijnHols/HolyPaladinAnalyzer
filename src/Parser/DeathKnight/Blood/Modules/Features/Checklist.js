import React from 'react';

import SPELLS from 'common/SPELLS';
//import ITEMS from 'common/ITEMS';

import SpellLink from 'common/SpellLink';
import Wrapper from 'common/Wrapper';

import CoreChecklist, { Rule, Requirement } from 'Parser/Core/Modules/Features/Checklist';
import { PreparationRule } from 'Parser/Core/Modules/Features/Checklist/Rules';
import { GenericCastEfficiencyRequirement } from 'Parser/Core/Modules/Features/Checklist/Requirements';
import CastEfficiency from 'Parser/Core/Modules/CastEfficiency';
import Combatants from 'Parser/Core/Modules/Combatants';
import LegendaryUpgradeChecker from 'Parser/Core/Modules/Items/LegendaryUpgradeChecker';
import LegendaryCountChecker from 'Parser/Core/Modules/Items/LegendaryCountChecker';
import PrePotion from 'Parser/Core/Modules/Items/PrePotion';
import EnchantChecker from 'Parser/Core/Modules/Items/EnchantChecker';

import BoneShieldUptime from './BoneShieldUptime';
import OssuaryUptime from './OssuaryUptime';
import BloodPlagueUptime from './BloodPlagueUptime';
import AlwaysBeCasting from './AlwaysBeCasting';

import RunicPowerDetails from '../RunicPower/RunicPowerDetails';
import RuneTracker from '../../../Shared/RuneTracker';

class Checklist extends CoreChecklist {
  static dependencies = {
    castEfficiency: CastEfficiency,
    combatants: Combatants,
    legendaryCountChecker: LegendaryCountChecker,
    legendaryUpgradeChecker: LegendaryUpgradeChecker,
    prePotion: PrePotion,
    bloodplagueUptime: BloodPlagueUptime,
    alwaysBeCasting: AlwaysBeCasting,
    enchantChecker: EnchantChecker,
    runicPowerDetails: RunicPowerDetails,
    boneShieldUptime: BoneShieldUptime,
    ossuaryUptime: OssuaryUptime,
    runeTracker: RuneTracker,
  };

  rules = [
    new Rule({
      name: 'Use your short cooldowns',
      description: 'These should generally always be recharging to maximize efficiency.',
      requirements: () => {
        return [
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.BLOOD_BOIL,
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.DEATH_AND_DECAY,
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.BLOOD_TAP_TALENT,
            when: this.combatants.selected.hasTalent(SPELLS.BLOOD_TAP_TALENT.id),
          }),
        ];
      },
    }),

        new Rule({
      name: 'Do not overcap your resources',
      description: 'Death Knights are a resource based class, relying on Runes and Runic Power to cast core abilities. Try to spend Runic Power before reaching the maximum amount and always keep atleast 3 Runes on cooldown to avoid wasting resources.',
      requirements: () => {
        return [
          new Requirement({
            name: 'Runic Power Efficiency',
            check: () => this.runicPowerDetails.efficiencySuggestionThresholds,
          }),
          new Requirement({
            name: 'Rune Efficiency',
            check: () => this.runeTracker.suggestionThresholdsEfficiency,
          }),
        ];
      },
    }),

    new Rule({
      name: 'Use your offensive cooldowns',
      description: 'You should aim to use these cooldowns as often as you can to maximize your damage output unless you are saving them for their defensive value.',
      requirements: () => {
        return [
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.DANCING_RUNE_WEAPON,
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.BLOOD_MIRROR_TALENT,
            when: this.combatants.selected.hasTalent(SPELLS.BLOOD_MIRROR_TALENT.id),
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.BLOODDRINKER_TALENT,
            when: this.combatants.selected.hasTalent(SPELLS.BLOODDRINKER_TALENT.id),
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.CONSUMPTION,
          }),
        ];
      },
    }),
    new Rule({
      name: 'Maintain your buffs and debuffs',
      description: 'It is important to maintain these as they contribute a large amount to your DPS and HPS.',
      requirements: () => {
        return [
          new Requirement({
            name: <Wrapper><SpellLink id={SPELLS.BLOOD_PLAGUE.id}/> Uptime</Wrapper>,
            check: () => this.bloodplagueUptime.uptimeSuggestionThresholds,
          }),
          new Requirement({
            name: <Wrapper><SpellLink id={SPELLS.BONE_SHIELD.id}/> Uptime</Wrapper>,
            check: () => this.boneShieldUptime.uptimeSuggestionThresholds,
          }),
          new Requirement({
            name: <Wrapper><SpellLink id={SPELLS.OSSUARY.id}/> Uptime</Wrapper>,
            when: this.combatants.selected.hasTalent(SPELLS.OSSUARY_TALENT.id),
            check: () => this.ossuaryUptime.uptimeSuggestionThresholds,
          }),
        ];
      },
    }),

    new Rule({
      name: 'Use your defensive cooldowns',
      description: 'Use these to block damage spikes and keep damage smooth to reduce external healing required.',
      requirements: () => {
        return [
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.VAMPIRIC_BLOOD,
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.ICEBOUND_FORTITUDE,
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.ANTI_MAGIC_SHELL,
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.RUNE_TAP_TALENT,
            when: this.combatants.selected.hasTalent(SPELLS.RUNE_TAP_TALENT.id),
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.MARK_OF_BLOOD_TALENT,
            when: this.combatants.selected.hasTalent(SPELLS.MARK_OF_BLOOD_TALENT.id),
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.TOMBSTONE_TALENT,
            when: this.combatants.selected.hasTalent(SPELLS.TOMBSTONE_TALENT.id),
          }),
        ];
      },
    }),

    new PreparationRule(),
  ]
}

export default Checklist;
