import React from 'react';

import BaseChecklist from 'parser/shared/modules/features/Checklist2/Module';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import ManaValues from 'parser/shared/modules/ManaValues';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist2/PreparationRuleAnalyzer';

import AlwaysBeCasting from '../AlwaysBeCasting';
import TidalWaves from '../TidalWaves';
import ChainHeal from '../../spells/ChainHeal';
import HealingRain from '../../spells/HealingRain';
import Wellspring from '../../talents/Wellspring';
import HealingSurge from '../../spells/HealingSurge';
import HealingWave from '../../spells/HealingWave';

import Component from './Component';

class Checklist extends BaseChecklist {
  static dependencies = {
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    alwaysBeCasting: AlwaysBeCasting,
    manaValues: ManaValues,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,
    tidalWaves: TidalWaves,
    chainHeal: ChainHeal,
    healingRain: HealingRain,
    wellspring: Wellspring,
    healingSurge: HealingSurge,
    healingWave: HealingWave,
  };

  render() {
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,
          
          nonHealingTimeSuggestionThresholds: this.alwaysBeCasting.nonHealingTimeSuggestionThresholds,
          downtimeSuggestionThresholds: this.alwaysBeCasting.downtimeSuggestionThresholds,
          unusedTidalWavesThresholds: this.tidalWaves.suggestionThresholds,
          unbuffedHealingSurgesThresholds: this.healingSurge.suggestedThreshold,
          unbuffedHealingWavesThresholds: this.healingWave.suggestedThreshold,
          chainHealTargetThresholds: this.chainHeal.suggestionThreshold,
          healingRainTargetThreshold: this.healingRain.suggestionThreshold,
          wellspringTargetThreshold: this.wellspring.suggestionThreshold,
          manaLeft: this.manaValues.suggestionThresholds,
        }}
      />
    );
  }
}

export default Checklist;
