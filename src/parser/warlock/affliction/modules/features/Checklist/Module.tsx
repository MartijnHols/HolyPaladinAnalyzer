import React from 'react';

import BaseChecklist from 'parser/shared/modules/features/Checklist/Module';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist/PreparationRuleAnalyzer';

import AlwaysBeCasting from '../AlwaysBeCasting';
import AgonyUptime from '../DotUptimes/AgonyUptime';
import CorruptionUptime from '../DotUptimes/CorruptionUptime';
import UnstableAfflictionUptime from '../DotUptimes/UnstableAfflictionUptime';
import SiphonLifeUptime from '../../talents/SiphonLifeUptime';
import SoulShardDetails from '../../soulshards/SoulShardDetails';
import SoulShardTracker from '../../soulshards/SoulShardTracker';

import Component from './Component';

class Checklist extends BaseChecklist {
  static dependencies = {
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    alwaysBeCasting: AlwaysBeCasting,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,

    agonyUptime: AgonyUptime,
    corruptionUptime: CorruptionUptime,
    siphonLifeUptime: SiphonLifeUptime,
    unstableAfflictionUptime: UnstableAfflictionUptime,
    soulShardDetails: SoulShardDetails,
    soulShardTracker: SoulShardTracker,
  };
  protected combatants!: Combatants;
  protected castEfficiency!: CastEfficiency;
  protected alwaysBeCasting!: AlwaysBeCasting;
  protected preparationRuleAnalyzer!: PreparationRuleAnalyzer;
  protected agonyUptime!: AgonyUptime;
  protected corruptionUptime!: CorruptionUptime;
  protected siphonLifeUptime!: SiphonLifeUptime;
  protected unstableAfflictionUptime!: UnstableAfflictionUptime;
  protected soulShardDetails!: SoulShardDetails;
  protected soulShardTracker!: SoulShardTracker;

  render() {
    return (
      <Component
        castEfficiency={this.castEfficiency}
        combatant={this.combatants.selected}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,

          agony: this.agonyUptime.suggestionThresholds,
          corruption: this.corruptionUptime.suggestionThresholds,
          unstableAffliction: this.unstableAfflictionUptime.suggestionThresholds,
          siphonLife: this.siphonLifeUptime.suggestionThresholds,
          soulShards: this.soulShardDetails.suggestionThresholds,
          downtime: this.alwaysBeCasting.suggestionThresholds,
        }}
        shardTracker={this.soulShardTracker}
      />
    );
  }
}

export default Checklist;
