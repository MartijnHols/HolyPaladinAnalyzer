import React from 'react';
import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import { calculateAzeriteEffects } from 'common/stats';
import { formatNumber, formatPercentage } from 'common/format';
import TraitStatisticBox, { STATISTIC_ORDER } from 'interface/others/TraitStatisticBox';
import StatTracker from 'parser/shared/modules/StatTracker';

const TON_SCALE = {
  [SPELLS.LIGHT_STAGGER_DEBUFF.id]: 1,
  [SPELLS.MODERATE_STAGGER_DEBUFF.id]: 2,
  [SPELLS.HEAVY_STAGGER_DEBUFF.id]: 3,
};

export function trainingOfNiuzaoStats(combatant) {
  if(!combatant.hasTrait(SPELLS.TRAINING_OF_NIUZAO.id)) {
    return null;
  }
  return {
    mastery: combatant.traitsBySpellId[SPELLS.TRAINING_OF_NIUZAO.id]
              .reduce((total, rank) => total + calculateAzeriteEffects(SPELLS.TRAINING_OF_NIUZAO.id, rank)[0], 0),
  };
}

const NULL_MASTERY = {mastery: 0};

export const MASTERY_FNS = {
  [SPELLS.LIGHT_STAGGER_DEBUFF.id]: combatant => (trainingOfNiuzaoStats(combatant) || NULL_MASTERY).mastery * TON_SCALE[SPELLS.LIGHT_STAGGER_DEBUFF.id],
  [SPELLS.MODERATE_STAGGER_DEBUFF.id]: combatant => (trainingOfNiuzaoStats(combatant) || NULL_MASTERY).mastery * TON_SCALE[SPELLS.MODERATE_STAGGER_DEBUFF.id],
  [SPELLS.HEAVY_STAGGER_DEBUFF.id]: combatant => (trainingOfNiuzaoStats(combatant) || NULL_MASTERY).mastery * TON_SCALE[SPELLS.HEAVY_STAGGER_DEBUFF.id],
};

/**
 * Training of Niuzao
 *
 * Gain up to X mastery based on your level of Stagger.
 *
 * The effect size from scaling code is actually the amount given at
 * *Light* stagger, not the tooltip value.
 *
 * Scaling calculation is disconnected from this class so it can be
 * re-used by the StatTracker.
 *
 * Example Report: https://www.warcraftlogs.com/reports/X4kZzGnym1YMJwPd/#fight=32&source=7
 */
class TrainingOfNiuzao extends Analyzer {
  mastery = 0;
  constructor(...args) {
    super(...args);
    if(!this.selectedCombatant.hasTrait(SPELLS.TRAINING_OF_NIUZAO.id)) {
      this.active = false;
      return;
    }
    
    this.mastery = trainingOfNiuzaoStats(this.selectedCombatant).mastery;
  }

  get avgMastery() {
    return Object.entries(TON_SCALE).reduce((current, [buff, scale]) => this.selectedCombatant.getBuffUptime(buff) / this.owner.fightDuration * scale * this.mastery + current, 0);
  }

  statistic() {
    const lightUptime = this.selectedCombatant.getBuffUptime(SPELLS.LIGHT_STAGGER_DEBUFF.id) / this.owner.fightDuration;
    const moderateUptime = this.selectedCombatant.getBuffUptime(SPELLS.MODERATE_STAGGER_DEBUFF.id) / this.owner.fightDuration;
    const heavyUptime = this.selectedCombatant.getBuffUptime(SPELLS.HEAVY_STAGGER_DEBUFF.id) / this.owner.fightDuration;

    const lightMastery = TON_SCALE[SPELLS.LIGHT_STAGGER_DEBUFF.id] * this.mastery;
    const moderateMastery = TON_SCALE[SPELLS.MODERATE_STAGGER_DEBUFF.id] * this.mastery;
    const heavyMastery = TON_SCALE[SPELLS.HEAVY_STAGGER_DEBUFF.id] * this.mastery;

    // the `this.owner.getModule(StatTracker)` bit is used because atm
    // StatTracker ALSO imports this module so that the mastery
    // calculation isn't done inline over there. it is possible to
    // import StatTracker, but not to set it as a dependency.
    return (
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.TRAINING_OF_NIUZAO.id}
        value={`${formatPercentage(this.owner.getModule(StatTracker).masteryPercentage(this.avgMastery, false))}% Avg. Mastery`}
        tooltip={`Contribution Breakdown:
          <ul>
          <li>No Stagger: <b>${formatPercentage(1 - lightUptime - moderateUptime - heavyUptime)}%</b> of the fight.</li>
          <li>Light Stagger: <b>${formatPercentage(lightUptime)}%</b> of the fight at <b>${formatNumber(lightMastery)} Mastery</b>.</li>
          <li>Moderate Stagger: <b>${formatPercentage(moderateUptime)}%</b> of the fight at <b>${formatNumber(moderateMastery)} Mastery</b>.</li>
          <li>Heavy Stagger: <b>${formatPercentage(heavyUptime)}%</b> of the fight at <b>${formatNumber(heavyMastery)} Mastery</b>.</li>
          </ul>`}
        />
    );
  }

  statisticOrder = STATISTIC_ORDER.OPTIONAL();
}

export default TrainingOfNiuzao;
