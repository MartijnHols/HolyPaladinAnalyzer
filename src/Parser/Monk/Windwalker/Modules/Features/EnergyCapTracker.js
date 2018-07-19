import React from 'react';
import Icon from 'common/Icon';
import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import RESOURCE_TYPES from 'common/RESOURCE_TYPES';
import { formatDuration, formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import RegenResourceCapTracker from 'Parser/Core/Modules/RegenResourceCapTracker';

/**
 * The analyzer is set up for BfA-prepatch where legendaries and other special 110 items are still
 * active. You can disable the efects when checking accuracy on logs with players above 115.
 */
const debugIsPlayerAbove115 = false;

// If you want to see debug information from RegenResourceCapTracker, you need to set debug there.

const BASE_ENERGY_REGEN = 10;
const ASCENSION_REGEN_MULTIPLIER = 1.1;

const BASE_ENERGY_MAX = 100;
const ASCENSION_ENERGY_MAX_ADDITION = 20;
const STABILIZED_ENERGY_PENDANT_MAX_MULTIPLIER = 1.05;

const RESOURCE_REFUND_ON_MISS = 0.8;

/**
 * Sets up RegenResourceCapTracker to accurately track the regenerating energy of a Windwalker monk.
 * Taking into account the effect of buffs, talents, and items on the energy cost of abilities,
 * the maximum energy amount, and the regeneration rate.
 * Note that some cost reduction effects are already accounted for in the log.
 */
class EnergyCapTracker extends RegenResourceCapTracker {
  static resourceType = RESOURCE_TYPES.ENERGY;
  static baseRegenRate = BASE_ENERGY_REGEN;
  static isRegenHasted = true;
  static cumulativeEventWindow = 400;
  static resourceRefundOnMiss = RESOURCE_REFUND_ON_MISS;

  naturalRegenRate() {
    let regen = super.naturalRegenRate();
    if (this.selectedCombatant.hasTalent(SPELLS.ASCENSION_TALENT.id)) {
      regen *= ASCENSION_REGEN_MULTIPLIER;
    }
    return regen;
  }

  currentMaxResource() {
    let max = BASE_ENERGY_MAX;
    if (!debugIsPlayerAbove115 && this.selectedCombatant.getItem(ITEMS.STABILIZED_ENERGY_PENDANT.id)) {
      // BFA: Pendant's effect will stop working after level 115.
      // multiplier is applied after the additions
      max *= STABILIZED_ENERGY_PENDANT_MAX_MULTIPLIER;
    }
    if (this.selectedCombatant.hasTalent(SPELLS.ASCENSION_TALENT.id)) {
      max += ASCENSION_ENERGY_MAX_ADDITION;
    }
    // What should be x.5 becomes x in-game.
    return Math.floor(max);
  }

  statistic() {
    return (
      <StatisticBox
        icon={<Icon icon="spell_shadow_shadowworddominate" alt="Capped Energy" />}
        value={`${formatPercentage(this.cappedProportion)}%`}
        label="Time with capped energy"
        tooltip={`Although it can be beneficial to wait and let your energy pool ready to be used at the right time, you should still avoid letting it reach the cap.<br/>
        You spent <b>${formatPercentage(this.cappedProportion)}%</b> of the fight at capped energy, causing you to miss out on <b>${this.missedRegenPerMinute.toFixed(1)}</b> energy per minute from regeneration.`}
        footer={(
          <div className="statistic-bar">
            <div
              className="stat-healing-bg"
              style={{ width: `${(1 - this.cappedProportion) * 100}%` }}
              data-tip={`Not at capped energy for ${formatDuration((this.owner.fightDuration - this.atCap) / 1000)}`}
            >
              <img src="/img/sword.png" alt="Uncapped Energy" />
            </div>

            <div
              className="remainder DeathKnight-bg"
              data-tip={`At capped energy for ${formatDuration(this.atCap / 1000)}`}
            >
              <img src="/img/overhealing.png" alt="Capped Energy" />
            </div>
          </div>
        )}
        footerStyle={{ overflow: 'hidden' }}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(8);
}
export default EnergyCapTracker;
