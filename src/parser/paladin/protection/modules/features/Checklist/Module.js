import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Abilities from 'parser/shared/modules/Abilities';
import Combatants from 'parser/shared/modules/Combatants';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist2/PreparationRuleAnalyzer';

import ShieldOfTheRighteous from '../ShieldOfTheRighteous';
import Consecration from '../Consecration';

import Component from './Component';



class Checklist extends Analyzer{
  static dependencies = {
    castEfficiency: CastEfficiency,
    combatants: Combatants,
    abilities: Abilities,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,
    shieldOfTheRighteous: ShieldOfTheRighteous,
    consecration: Consecration,
  };

  render(){
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,
          consecration: this.consecration.uptimeSuggestionThresholds,
          shieldOfTheRighteous: this.shieldOfTheRighteous.suggestionThresholds,
        }}
      />
    );
  }
}

export default Checklist;
