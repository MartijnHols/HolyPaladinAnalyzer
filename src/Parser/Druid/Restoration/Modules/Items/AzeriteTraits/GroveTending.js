import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';
import {formatPercentage, formatNumber} from 'common/format';
import SPELLS from 'common/SPELLS';
import Mastery from 'Parser/Druid/Restoration/Modules/Core/Mastery';
import TraitStatisticBox, { STATISTIC_ORDER } from 'Interface/Others/TraitStatisticBox';
import StatWeights from '../../Features/StatWeights';
import {getPrimaryStatForItemLevel, findItemLevelByPrimaryStat} from '../AzeriteTraits/common';

/**
 Swiftmend heals the target for 2772 over 9 sec.
 */
class GroveTending extends Analyzer{
  static dependencies = {
    statWeights: StatWeights,
    mastery: Mastery,
  };

  healing = 0;
  avgItemLevel = 0;
  traitLevel = 0;

  constructor(...args){
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.GROVE_TENDING_TRAIT.id);
    if(this.active) {
      this.avgItemLevel = this.selectedCombatant.traitsBySpellId[SPELLS.GROVE_TENDING_TRAIT.id]
        .reduce((a, b) => a + b) / this.selectedCombatant.traitsBySpellId[SPELLS.GROVE_TENDING_TRAIT.id].length;
      this.traitLevel = this.selectedCombatant.traitsBySpellId[SPELLS.GROVE_TENDING_TRAIT.id].length;
    }
  }
  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

    if (spellId === SPELLS.GROVE_TENDING.id) {
      this.healing += event.amount + (event.absorbed || 0);
    }
  }

  statistic(){
    const throughputPercent = this.owner.getPercentageOfTotalHealingDone(this.healing + this.mastery.getMasteryHealing(SPELLS.GROVE_TENDING.id));
    const onePercentThroughputInInt = this.statWeights._ratingPerOnePercent(this.statWeights.totalOneInt);
    const intGain = onePercentThroughputInInt * throughputPercent * 100;
    const ilvlGain = findItemLevelByPrimaryStat(getPrimaryStatForItemLevel(this.avgItemLevel) + intGain) - this.avgItemLevel;

    return(
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.GROVE_TENDING_TRAIT.id}
        value={(
          <React.Fragment>
            {formatPercentage(throughputPercent)} %<br />
          </React.Fragment>
        )}
        tooltip={`Direct healing: <b>${formatPercentage(this.owner.getPercentageOfTotalHealingDone(this.healing))}%</b> Mastery: <b>${formatPercentage(this.owner.getPercentageOfTotalHealingDone(this.mastery.getMasteryHealing(SPELLS.GROVE_TENDING.id)))}%</b><br />
            Grove Tending gave you equivalent to <b>${formatNumber(intGain)}</b> (${formatNumber(intGain/this.traitLevel)}
            per level) int. This is worth roughly <b>${formatNumber(ilvlGain)}</b> (${formatNumber(ilvlGain/this.traitLevel)}
            per level) item levels.`}
      />
    );
  }
}

export default GroveTending;
