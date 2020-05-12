import React from 'react';

import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import Abilities from 'parser/core/modules/Abilities';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

/**
 * Your ranged auto attacks have a 5% chance to trigger Lock and Load, causing your next Aimed Shot to cost no Focus and be instant.
 *
 * Example log: https://www.warcraftlogs.com/reports/v6nrtTxNKGDmYJXy#fight=16&type=auras&source=6
 */

const PROC_CHANCE = 0.05;

class LockAndLoad extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    abilities: Abilities,
  };

  hasLnLBuff = false;
  noGainLNLProcs = 0;
  totalProcs = 0;
  autoShots = 0;
  wastedInstants = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.LOCK_AND_LOAD_TALENT.id);
  }

  on_byPlayer_applybuff(event) {
    const buffId = event.ability.guid;
    if (buffId !== SPELLS.LOCK_AND_LOAD_BUFF.id) {
      return;
    }
    this.totalProcs += 1;
    this.hasLnLBuff = true;
    if (this.spellUsable.isOnCooldown(SPELLS.AIMED_SHOT.id)) {
      const newChargeCDR = this.abilities.getExpectedCooldownDuration(SPELLS.AIMED_SHOT.id, this.spellUsable.cooldownTriggerEvent(SPELLS.AIMED_SHOT.id)) - this.spellUsable.cooldownRemaining(SPELLS.AIMED_SHOT.id);
      this.spellUsable.endCooldown(SPELLS.AIMED_SHOT.id, false, event.timestamp, newChargeCDR);
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (!this.selectedCombatant.hasBuff(SPELLS.LOCK_AND_LOAD_BUFF.id, event.timestamp) || spellId !== SPELLS.AIMED_SHOT.id) {
      return;
    }
    this.hasLnLBuff = false;
  }

  on_byPlayer_refreshbuff(event) {
    const buffId = event.ability.guid;
    if (buffId !== SPELLS.LOCK_AND_LOAD_BUFF.id) {
      return;
    }
    if (this.hasLnLBuff) {
      this.noGainLNLProcs += 1;
      this.wastedInstants += 1;
    }
    this.totalProcs += 1;
  }

  on_byPlayer_damage(event) {
    const spellID = event.ability.guid;
    if (spellID !== SPELLS.AUTO_SHOT.id) {
      return;
    }
    this.autoShots += 1;
  }

  get expectedProcs() {
    return (this.autoShots * PROC_CHANCE).toFixed(2);
  }

  GetZPercent(z) {
    // If z is greater than 6.5 standard deviations from the mean
    // the number of significant digits will be outside of a reasonable
    // range.
    if (z < -6.5) {
      return 0.0;
    }

    if (z > 6.5) {
      return 1.0;
    }

    let factK = 1;
    let sum = 0;
    let term = 1;
    let k = 0;
    const loopStop = Math.exp(-23);

    while (Math.abs(term) > loopStop) {
      term = 0.3989422804 * Math.pow(-1, k) * Math.pow(z, k) / (2 * k + 1) /
        Math.pow(2, k) * Math.pow(z, k + 1) / factK;
      sum += term;
      k += 1;
      factK *= k;
    }
    sum += 0.5;

    return sum;
  }

  binomialCalculation(procs, tries, procChance) {
    //Correcting for continuity we add 0.5 to procs, because we're looking for the probability of getting at most the amount of procs we received
    // if P(X <= a), then P(X<a+0.5)
    const correctedProcs = procs + 0.5;
    const nonProcChance = 1 - procChance;

    const stddev = Math.sqrt(procChance * nonProcChance * tries);
    //zScore is calculated by saying (X - M) / stddev
    const zScore = (correctedProcs - this.pn) / stddev;

    return this.GetZPercent(zScore);
  }

  //pn is the mean value of procs
  get pn() {
    return PROC_CHANCE * this.autoShots;
  }

  //qn is the mean value of non-procs
  get qn() {
    return (1 - PROC_CHANCE) * this.autoShots;
  }

  statistic() {
    const binomCalc = this.binomialCalculation(this.totalProcs, this.autoShots, PROC_CHANCE);
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(10)}
        size="flexible"
        category={'TALENTS'}
        tooltip={(
          <>
            You had {this.noGainLNLProcs} {this.noGainLNLProcs > 1 || this.noGainLNLProcs === 0 ? `procs` : `proc`} with LnL already active. <br />
            You had {formatPercentage(this.totalProcs / this.expectedProcs, 1)}% procs of what you could expect to get over the encounter. <br />
            You had a total of {this.totalProcs} procs, and your expected amount of procs was {this.expectedProcs}. <br />
            <ul>
              <li>You have a ~{formatPercentage(binomCalc)}% chance of getting this amount of procs or fewer in the future with this amount of autoattacks.</li>
              {/*this two first tooltipText additions will probably NEVER happen, but it'd be fun if they ever did*/}
              {binomCalc === 0 && <li>You had so few procs that the chance of you getting fewer procs than what you had on this attempt is going to be de facto 0%. Consider yourself the unluckiest man alive.</li>}
              {binomCalc === 1 && <li>You had so many procs that the chance of you getting fewer procs than what you had on this attempt is going to be de facto 100%. Consider yourself the luckiest man alive.</li>}
              {/* eslint-disable-next-line yoda */}
              {(0 < binomCalc && binomCalc < 1) && (
                (this.pn > 10 || this.qn > 10) ?
                  <li>Due to normal approximation these results are within 2% margin of error.</li> :
                  <li>Because you had under {10 / PROC_CHANCE} auto attacks and due to normal approximation these results have a margin of error of over 2%.</li>
              )}
            </ul>
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.LOCK_AND_LOAD_TALENT}>
          <>
            {this.wastedInstants} ({formatPercentage(this.wastedInstants / (this.totalProcs))}%) <small>lost procs</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default LockAndLoad;
