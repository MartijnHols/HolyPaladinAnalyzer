import React from 'react';

import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS/index';
import SpellLink from "common/SpellLink";
import ItemDamageDone from 'interface/others/ItemDamageDone';
import { formatPercentage } from 'common/format';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import StatisticListBoxItem from 'interface/others/StatisticListBoxItem';

/**
 * Your auto-shots have a 25% chance to cause a volley of arrows to rain down around the target, dealing Physical damage to each enemy within 8 yards.
 */

const PROC_CHANCE = 0.25;
const BUFFER_MS = 100;

class Volley extends Analyzer {

  damage = 0;
  autoShots = 0;
  procs = 0;
  lastVolleyHit = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.VOLLEY_TALENT.id);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.VOLLEY_DAMAGE.id && spellId !== SPELLS.AUTO_SHOT.id) {
      return;
    }
    if (spellId === SPELLS.VOLLEY_DAMAGE.id) {
      this.damage += event.amount + (event.absorbed || 0);
      if (event.timestamp > (this.lastVolleyHit + BUFFER_MS)) {
        this.procs++;
        this.lastVolleyHit = event.timestamp;
      }
    }
    if (spellId === SPELLS.AUTO_SHOT.id) {
      this.autoShots += 1;
    }
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
      k++;
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
    const binomCalc = this.binomialCalculation(this.procs, this.autoShots, PROC_CHANCE);

    return (
      <TalentStatisticBox
        talent={SPELLS.VOLLEY_TALENT.id}
        value={`${this.procs} procs`}
        tooltip={(
          <>
            You had {this.procs} {this.procs > 1 ? `procs` : `proc`}. <br />
            You had {formatPercentage(this.procs / this.expectedProcs, 1)}% procs of what you could expect to get over the encounter. <br />
            You had a total of {this.procs} procs, and your expected amount of procs was {this.expectedProcs}. <br />
            <ul>
              <li>You have a ~{formatPercentage(binomCalc)}% chance of getting this amount of procs or fewer in the future with this amount of autoattacks. </li>
              {/*these two will probably NEVER happen, but it'd be fun if they ever did.*/}
              {binomCalc === 1 && <li>You had so many procs that the chance of you getting fewer procs than what you had on this attempt is going to be de facto 100%. Consider yourself the luckiest man alive.</li>}
              {binomCalc === 0 && <li>You had so few procs that the chance of you getting fewer procs than what you had on this attempt is going to be de facto 0%. Consider yourself the unluckiest man alive.</li>}
              {/* eslint-disable-next-line yoda */}
              {(0 < binomCalc && binomCalc < 1) && (
                (this.pn > 10 || this.qn > 10) ?
                  <li>Due to normal approximation these results are within 2% margin of error.</li> :
                  <li>Because you had under {10 / PROC_CHANCE} auto attacks and due to normal approximation these results have a margin of error of over 2%.</li>
              )}
            </ul>
          </>
        )}
      />
    );
  }

  subStatistic() {
    return (
      <StatisticListBoxItem
        title={<SpellLink id={SPELLS.VOLLEY_TALENT.id} />}
        value={<ItemDamageDone amount={this.damage} />}
      />
    );
  }

}

export default Volley;
