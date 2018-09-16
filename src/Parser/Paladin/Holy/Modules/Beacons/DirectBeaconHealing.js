import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';
import Analyzer from 'Parser/Core/Analyzer';
import StatisticBox, { STATISTIC_ORDER } from 'Interface/Others/StatisticBox';

import Abilities from '../Abilities';
import PaladinAbilityTracker from '../PaladinCore/PaladinAbilityTracker';
import { BEACON_TRANSFERING_ABILITIES } from '../../Constants';

class DirectBeaconHealing extends Analyzer {
  static dependencies = {
    abilityTracker: PaladinAbilityTracker,
    abilities: Abilities,
  };

  get totalHealsOnBeaconPercentage() {
    const abilityTracker = this.abilityTracker;
    const getCastCount = spellId => abilityTracker.getAbility(spellId);

    let casts = 0;
    let castsOnBeacon = 0;

    this.abilities.activeAbilities
      .filter(ability => BEACON_TRANSFERING_ABILITIES[ability.spell.id] !== undefined)
      .forEach(ability => {
        const castCount = getCastCount(ability.spell.id);
        casts += castCount.healingHits || 0;
        castsOnBeacon += castCount.healingBeaconHits || 0;
      });

    return castsOnBeacon / casts;
  }

  get suggestionThresholds() {
    return {
      actual: this.totalHealsOnBeaconPercentage,
      isGreaterThan: {
        minor: 0.2,
        average: 0.25,
        major: 0.35,
      },
      style: 'percentage',
    };
  }
  suggestions(when) {
    when(this.suggestionThresholds.actual).isGreaterThan(this.suggestionThresholds.isGreaterThan.minor)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest('You cast a lot of direct heals on beacon targets. Direct healing beacon targets is inefficient. Try to only cast on beacon targets when they would otherwise die.')
          .icon('ability_paladin_beaconoflight')
          .actual(`${formatPercentage(actual)}% of all your healing spell casts were on a beacon target`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(this.suggestionThresholds.isGreaterThan.average).major(this.suggestionThresholds.isGreaterThan.major);
      });
  }
  statistic() {
    const abilityTracker = this.abilityTracker;
    const getAbility = spellId => abilityTracker.getAbility(spellId);

    const flashOfLight = getAbility(SPELLS.FLASH_OF_LIGHT.id);
    const holyLight = getAbility(SPELLS.HOLY_LIGHT.id);

    const flashOfLightHeals = flashOfLight.casts || 0;
    const holyLightHeals = holyLight.casts || 0;
    const totalFolsAndHls = flashOfLightHeals + holyLightHeals;

    const beaconFlashOfLights = flashOfLight.healingBeaconHits || 0;
    const beaconHolyLights = holyLight.healingBeaconHits || 0;
    const totalFolsAndHlsOnBeacon = beaconFlashOfLights + beaconHolyLights;
    const totalHealsOnBeaconPercentage = this.totalHealsOnBeaconPercentage;

    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(50)}
        icon={<SpellIcon id={SPELLS.BEACON_OF_LIGHT_CAST_AND_BUFF.id} />}
        value={`${formatPercentage(totalHealsOnBeaconPercentage)} %`}
        label="Direct beacon healing"
        tooltip={`The amount of heals cast on beacon targets. ${formatPercentage(totalFolsAndHlsOnBeacon / totalFolsAndHls)} % of your Flash of Lights and Holy Lights were cast on a beacon target. You cast ${beaconFlashOfLights} Flash of Lights and ${beaconHolyLights} Holy Lights on beacon targets.`}
      />
    );
  }
}

export default DirectBeaconHealing;
