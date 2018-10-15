import React from 'react';

import CoreChecklist, { Rule, Requirement } from 'parser/shared/modules/features/Checklist';
import Abilities from 'parser/shared/modules/Abilities';
import { PreparationRule } from 'parser/shared/modules/features/Checklist/Rules';
import { GenericCastEfficiencyRequirement } from 'parser/shared/modules/features/Checklist/Requirements';
import PrePotion from 'parser/shared/modules/items/PrePotion';
import SPELLS from 'common/SPELLS';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import AlwaysBeCasting from 'parser/hunter/marksmanship/modules/features/AlwaysBeCasting';
import Trueshot from 'parser/hunter/marksmanship/modules/spells/Trueshot';
import CancelledCasts from 'parser/hunter/shared/modules/features/CancelledCasts';
import TimeFocusCapped from 'parser/hunter/shared/modules/features/TimeFocusCapped';
import SpellLink from 'common/SpellLink';
import Icon from "common/Icon";
import EnchantChecker from 'parser/shared/modules/items/EnchantChecker';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import ResourceIcon from 'common/ResourceIcon';

class Checklist extends CoreChecklist {
  static dependencies = {
    abilities: Abilities,

    //preparation rules
    prePotion: PrePotion,
    enchantChecker: EnchantChecker,

    //features:
    castEfficiency: CastEfficiency,
    alwaysBeCasting: AlwaysBeCasting,
    cancelledCasts: CancelledCasts,
    timeFocusCapped: TimeFocusCapped,

    //spells
    trueshot: Trueshot,
  };

  rules = [
    new Rule({
      name: 'Use core spells as often as possible',
      description: <>Spells such as <SpellLink id={SPELLS.TRUESHOT.id} /> and <SpellLink id={SPELLS.A_MURDER_OF_CROWS_TALENT_SHARED.id} /> should be used as often as possible (unless nearing execute). <SpellLink id={SPELLS.WINDBURST.id} /> should be used as often as possible in situations where you need to open <SpellLink id={SPELLS.VULNERABLE.id} /> windows. Any added talents that need activation are generally used on cooldown. <a href="https://www.icy-veins.com/wow/marksmanship-hunter-pve-dps-rotation-cooldowns-abilities" target="_blank" rel="noopener noreferrer">More info.</a></>,
      requirements: () => {
        const combatant = this.selectedCombatant;
        return [
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.A_MURDER_OF_CROWS_TALENT,
            when: combatant.hasTalent(SPELLS.A_MURDER_OF_CROWS_TALENT.id),
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.TRUESHOT,
            onlyWithSuggestion: false,
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.PIERCING_SHOT_TALENT,
            when: combatant.hasTalent(SPELLS.PIERCING_SHOT_TALENT.id),
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.EXPLOSIVE_SHOT_TALENT,
            when: combatant.hasTalent(SPELLS.EXPLOSIVE_SHOT_TALENT.id),
          }),
          new GenericCastEfficiencyRequirement({
            spell: SPELLS.BARRAGE_TALENT,
            when: combatant.hasTalent(SPELLS.BARRAGE_TALENT.id),
          }),
        ];
      },
    }),

    new Rule({
      name: <>Use <SpellLink id={SPELLS.TRUESHOT.id} /> effectively</>,
      description: <>Since <SpellLink id={SPELLS.TRUESHOT.id} /> is a marksmanship hunters only cooldown, it's important to maximize the potential of it.</>,
      requirements: () => {
        return [
          new Requirement({
            name: <>Average <SpellLink id={SPELLS.AIMED_SHOT.id} /> casts per <SpellLink id={SPELLS.TRUESHOT.id} /></>,
            check: () => this.trueshot.aimedShotThreshold,
          }),
          new Requirement({
            name: <>Average <Icon
              icon="ability_hunter_focusfire"
              alt="Average Focus At Trueshot Cast"
              style={{
                height: '1.3em',
                marginTop: '-.1em',
              }}
            /> <a href="http://www.wowhead.com/focus">Focus</a> when casting <SpellLink id={SPELLS.TRUESHOT.id} /></>,
            check: () => this.trueshot.focusThreshold,
          }),
          new Requirement({
            name: <>Average <SpellLink id={SPELLS.TRUESHOT.id} /> uptime per cast</>,
            check: () => this.trueshot.uptimeThreshold,
          }),
        ];
      },
    }),
    new Rule({
      name: <>Execute and <SpellLink id={SPELLS.BULLSEYE_TRAIT.id} /></>,
      description: <>It's important for a marksmanship hunter to combine <SpellLink id={SPELLS.BULLSEYE_TRAIT.id} /> with a <SpellLink id={SPELLS.TRUESHOT.id} />, because of the increased crit damage added into <SpellLink id={SPELLS.TRUESHOT.id} /> from <SpellLink id={SPELLS.RAPID_KILLING.id} />.</>,
      requirements: () => {
        return [
          new Requirement({
            name: <><SpellLink id={SPELLS.A_MURDER_OF_CROWS_TALENT_SHARED.id} /> casts right before execute</>,
            check: () => this.aMurderOfCrows.shouldHaveSavedThreshold,
          }),
          new Requirement({
            name: <><SpellLink id={SPELLS.TRUESHOT.id} /> casts with <SpellLink id={SPELLS.BULLSEYE_BUFF.id} /> up</>,
            check: () => this.trueshot.executeTrueshotThreshold,
          }),
          new Requirement({
            name: <><SpellLink id={SPELLS.BULLSEYE_BUFF.id} /> lost while boss was under 20% </>,
            check: () => this.bullseye.bullseyeResetThreshold,
          }),
        ];
      },
    }),
    new Rule({
      name: 'Downtime, cancelled casts and focus capping',
      description: <>
        Try to minimize your time spent not casting. Use your instant casts (<SpellLink id={SPELLS.ARCANE_SHOT.id} /> or <SpellLink id={SPELLS.MULTISHOT_MM.id} />) while moving to avoid spending time doing nothing. Even while using <SpellLink id={SPELLS.SIDEWINDERS_TALENT.id} />, you can have too much downtime so try and spend the natural downtime moving, and utilise the rest of the time to cast your damaging spells.
      </>,
      requirements: () => {
        return [
          new Requirement({
            name: <><Icon
              icon="spell_mage_altertime"
              alt="Casting downtime"
              style={{
                height: '1.3em',
                marginTop: '-.1em',
              }}
            /> Downtime</>,
            check: () => this.alwaysBeCasting.suggestionThresholds,
          }),
          new Requirement({
            name: <><Icon
              icon="inv_misc_map_01"
              alt="Cancelled casts"
              style={{
                height: '1.3em',
                marginTop: '-.1em',
              }}
            /> Channeled casts cancelled</>,
            check: () => this.cancelledCasts.suggestionThresholds,
          }),
          new Requirement({
            name: <><ResourceIcon id={RESOURCE_TYPES.FOCUS.id} /> Time focus capped</>,
            check: () => this.timeFocusCapped.suggestionThresholds,
          }),
        ];
      },
    }),
    new Rule({
      name: <><SpellLink id={SPELLS.VULNERABLE.id} /> efficiency </>,
      description: <>Try to limit the amount of casts outside of <SpellLink id={SPELLS.VULNERABLE.id} /> to a minimum. If <SpellLink id={SPELLS.PATIENT_SNIPER_TALENT.id} /> is selected, try to optimise the damage from it by casting one or two <SpellLink id={SPELLS.ARCANE_SHOT.id} /> or <SpellLink id={SPELLS.MULTISHOT_MM.id} /> after opening <SpellLink id={SPELLS.VULNERABLE.id} />. This is to delay your <SpellLink id={SPELLS.AIMED_SHOT.id} /> until later in the <SpellLink id={SPELLS.VULNERABLE.id} /> window, increasing the benefit from <SpellLink id={SPELLS.PATIENT_SNIPER_TALENT.id} />. However, remember to not stand around waiting, doing nothing and to not focus cap, as they are more impactful in comparison to optimising <SpellLink id={SPELLS.PATIENT_SNIPER_TALENT.id} /> is.</>,
      requirements: () => {
        return [
          new Requirement({
            name: <><SpellLink id={SPELLS.AIMED_SHOT.id} />s outside <SpellLink id={SPELLS.VULNERABLE.id} /></>,
            check: () => this.aimedInVulnerableTracker.nonVulnerableAimedShotThreshold,
          }),
          new Requirement({
            name: <><ResourceIcon id={RESOURCE_TYPES.FOCUS.id} /> Focus dump <SpellLink id={SPELLS.AIMED_SHOT.id} />s</>,
            check: () => this.aimedInVulnerableTracker.focusDumpThreshold,
          }),
          new Requirement({
            name: <><SpellLink id={SPELLS.PATIENT_SNIPER_TALENT.id} /> damage contribution</>,
            check: () => this.patientSniperDetails.patientSniperDamageThresholds,
          }),
          new Requirement({
            name: <><SpellLink id={SPELLS.VULNERABLE.id} /> uptime</>,
            check: () => this.vulnerableUptime.uptimeThreshold,
          }),
        ];
      },
    }),
    new PreparationRule(),
  ];
}

export default Checklist;
