import React from 'react';

import BaseModule from 'parser/shared/modules/features/Checklist/Module';
import CastEfficiency from 'parser/shared/modules/CastEfficiency';
import Combatants from 'parser/shared/modules/Combatants';
import PreparationRuleAnalyzer from 'parser/shared/modules/features/Checklist/PreparationRuleAnalyzer';

// Buffs-Debuffs
import SpiritBombFrailtyDebuff from '../../talents/SpiritBombFrailtyDebuff';
import VoidReaverDebuff from '../../talents/VoidReaverDebuff';

// Talents
import SpiritBombSoulsConsume from '../../talents/SpiritBombSoulsConsume';
import SoulBarrier from '../../talents/SoulBarrier';

//Spells
import SoulCleaveSoulsConsumed from '../../spells/SoulCleaveSoulsConsumed';
import DemonSpikes from '../../spells/DemonSpikes';

// Resources
import PainDetails from '../../pain/PainDetails';
import SoulsOvercap from '../../statistics/SoulsOvercap';

import AlwaysBeCasting from '../AlwaysBeCasting';

import Component from './Component';

class Checklist extends BaseModule {
  static dependencies = {
    combatants: Combatants,
    castEfficiency: CastEfficiency,
    alwaysBeCasting: AlwaysBeCasting,
    preparationRuleAnalyzer: PreparationRuleAnalyzer,

    // Buffs-Debuffs
    spiritBombFrailtyDebuff: SpiritBombFrailtyDebuff,
    voidReaverDebuff: VoidReaverDebuff,

    // Talents
    spiritBombSoulsConsume: SpiritBombSoulsConsume,
    soulBarrier: SoulBarrier,

    // Spells
    soulCleaveSoulsConsumed: SoulCleaveSoulsConsumed,
    demonSpikes: DemonSpikes,

    // Resources
    painDetails: PainDetails,
    soulsOvercap: SoulsOvercap,
  };
  protected combatants!: Combatants;
  protected castEfficiency!: CastEfficiency;
  protected alwaysBeCasting!: AlwaysBeCasting;
  protected preparationRuleAnalyzer!: PreparationRuleAnalyzer;
  protected spiritBombFrailtyDebuff!: SpiritBombFrailtyDebuff;
  protected voidReaverDebuff!: VoidReaverDebuff;
  protected spiritBombSoulsConsume!: SpiritBombSoulsConsume;
  protected soulBarrier!: SoulBarrier;
  protected soulCleaveSoulsConsumed!: SoulCleaveSoulsConsumed;
  protected demonSpikes!: DemonSpikes;
  protected painDetails!: PainDetails;
  protected soulsOvercap!: SoulsOvercap;

  render() {
    return (
      <Component
        combatant={this.combatants.selected}
        castEfficiency={this.castEfficiency}
        thresholds={{
          ...this.preparationRuleAnalyzer.thresholds,

          downtimeSuggestionThresholds: this.alwaysBeCasting.downtimeSuggestionThresholds,
          spiritBombFrailtyDebuff: this.spiritBombFrailtyDebuff.uptimeSuggestionThresholds,
          voidReaverDebuff: this.voidReaverDebuff.uptimeSuggestionThresholds,
          spiritBombSoulsConsume: this.spiritBombSoulsConsume.suggestionThresholdsEfficiency,
          soulBarrier: this.soulBarrier.suggestionThresholdsEfficiency,
          soulCleaveSoulsConsumed: this.soulCleaveSoulsConsumed.suggestionThresholdsEfficiency,
          demonSpikes: this.demonSpikes.suggestionThresholdsEfficiency,
          painDetails: this.painDetails.suggestionThresholds,
          soulsOvercap: this.soulsOvercap.suggestionThresholdsEfficiency,
        }}
      />
    );
  }
}

export default Checklist;
