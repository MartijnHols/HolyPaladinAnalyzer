import React from 'react';

import BaseChecklist from 'parser/shared/modules/features/Checklist/Module';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import ManaValues from 'parser/shared/modules/ManaValues';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist/PreparationRuleAnalyzer';

import AlwaysBeCasting from '../AlwaysBeCasting';
import ChainHeal from '../../spells/ChainHeal';
import HealingRain from '../../spells/HealingRain';
import Wellspring from '../../talents/Wellspring';
import EarthenWallTotem from '../../talents/EarthenWallTotem';

import Component from './Component';

class Checklist extends BaseChecklist {
  static dependencies = {
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    alwaysBeCasting: AlwaysBeCasting,
    manaValues: ManaValues,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,
    chainHeal: ChainHeal,
    healingRain: HealingRain,
    wellspring: Wellspring,
    earthenWallTotem: EarthenWallTotem,
  };

  protected combatants!: Combatants;
  protected castEfficiency!: CastEfficiency;
  protected alwaysBeCasting!: AlwaysBeCasting;
  protected manaValues!: ManaValues;
  protected preparationRuleAnalyzer!: PreparationRuleAnalyzer;
  protected chainHeal!: ChainHeal;
  protected healingRain!: HealingRain;
  protected wellspring!: Wellspring;
  protected earthenWallTotem!: EarthenWallTotem;

  render() {
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,

          nonHealingTimeSuggestionThresholds: this.alwaysBeCasting.nonHealingTimeSuggestionThresholds,
          downtimeSuggestionThresholds: this.alwaysBeCasting.downtimeSuggestionThresholds,
          chainHealTargetThresholds: this.chainHeal.suggestionThreshold,
          healingRainTargetThreshold: this.healingRain.suggestionThreshold,
          wellspringTargetThreshold: this.wellspring.suggestionThreshold,
          ewtTargetThreshold: this.earthenWallTotem.suggestionThreshold,
          manaLeft: this.manaValues.suggestionThresholds,
        }}
      />
    );
  }
}

export default Checklist;
