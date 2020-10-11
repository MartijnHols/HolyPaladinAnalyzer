import React from 'react';
import { AutoSizer } from 'react-virtualized';

import { formatThousands, formatPercentage } from 'common/format';
import rankingColor from 'common/getRankingColor';
import makeWclUrl from 'common/makeWclUrl';
import Tooltip from 'common/Tooltip';
import StatisticBar from 'interface/statistics/StatisticBar';
import ThroughputPerformance, { UNAVAILABLE } from 'interface/report/Results/ThroughputPerformance';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import Analyzer from 'parser/core/Analyzer';
import FlushLineChart from 'interface/others/FlushLineChart';

import HealingValue from '../HealingValue';

class HealingDone extends Analyzer {
  _total = new HealingValue();
  get total() {
    return this._total;
  }
  _healingByAbsorbs = new HealingValue();
  get healingByAbsorbs() {
    return this._healingByAbsorbs;
  }

  bySecond = {};

  _byAbility = {};
  byAbility(spellId) {
    if (!this._byAbility[spellId]) {
      return new HealingValue();
    }
    return this._byAbility[spellId];
  }

  on_heal(event) {
    if (this.owner.byPlayer(event) || this.owner.byPlayerPet(event)) {
      this._addHealing(event, event.amount, event.absorbed, event.overheal);
    }
  }
  on_absorbed(event) {
    if (this.owner.byPlayer(event) || this.owner.byPlayerPet(event)) {
      this._addHealingByAbsorb(event, event.amount, 0, 0);
    }
  }
  on_removebuff(event) {
    if (this.owner.byPlayer(event) || this.owner.byPlayerPet(event)) {
      if (event.absorb) {
        this._addHealingByAbsorb(event, 0, 0, event.absorb);
      }
    }
  }

  _addHealing(event, amount = 0, absorbed = 0, overheal = 0) {
    this._total = this._total.add(amount, absorbed, overheal);

    const spellId = event.ability.guid;
    this._byAbility[spellId] = (this._byAbility[spellId] || new HealingValue()).add(amount, absorbed, overheal);

    const secondsIntoFight = Math.floor((event.timestamp - this.owner.fight.start_time) / 1000);
    this.bySecond[secondsIntoFight] = (this.bySecond[secondsIntoFight] || new HealingValue()).add(amount, absorbed, overheal);
  }
  _addHealingByAbsorb(event, amount = 0, absorbed = 0, overhealing = 0) {
    this._addHealing(event, amount, absorbed, overhealing);
    this._healingByAbsorbs = this._healingByAbsorbs.add(amount, absorbed, overhealing);
  }
  _subtractHealing(event, amount = 0, absorbed = 0, overheal = 0) {
    return this._addHealing(event, -amount, -absorbed, -overheal);
  }
  _subtractHealingByAbsorb(event, amount = 0, absorbed = 0, overheal = 0) {
    return this._addHealingByAbsorb(event, -amount, -absorbed, -overheal);
  }

  showStatistic = true;
  subStatistic() { // rendered by ThroughputStatisticGroup
    if (!this.showStatistic) {
      return null;
    }

    const data = Object.entries(this.bySecond).map(([sec, val]) => ({'time': sec, 'val': val.effective}));

    const perSecond = this.total.effective / this.owner.fightDuration * 1000;
    const wclUrl = makeWclUrl(this.owner.report.code, {
      fight: this.owner.fightId,
      source: this.owner.playerId,
      type: 'healing',
    });

    return (
      <StatisticBar
        position={STATISTIC_ORDER.CORE(2)}
        ultrawide
        style={{ marginBottom: 19, overflow: 'hidden' }} // since this is in a group, reducing margin should be fine
      >
        <div className="flex">
          <div className="flex-sub icon">
            <img
              src="/img/healing.png"
              alt="Healing"
            />
          </div>
          <Tooltip content={<>Total healing done: <strong>{formatThousands(this.total.effective)}</strong></>}>
            <div
              className="flex-sub value"
              style={{ width: 190 }}
            >
              {formatThousands(perSecond)} HPS
            </div>
          </Tooltip>
          <div className="flex-sub" style={{ width: 110, textAlign: 'center', padding: '10px 5px' }}>
            <ThroughputPerformance throughput={perSecond} metric="hps">
              {({ performance, topThroughput }) => performance && performance !== UNAVAILABLE && (
                <Tooltip
                  content={(
                    <>
                      Your HPS compared to the HPS of a top 100 player. To become a top 100 <span className={this.selectedCombatant.spec.className.replace(' ', '')}>{this.selectedCombatant.spec.specName} {this.selectedCombatant.spec.className}</span> on this fight you need to do at least <strong>{formatThousands(topThroughput)} HPS</strong>.
                    </>
                  )}
                >
                  <div
                    className={rankingColor(performance)}
                    style={{ cursor: 'help' }}
                  >
                    {performance >= 1 ? 'TOP 100' : `${formatPercentage(performance, 0)}%`}
                  </div>
                </Tooltip>
              )}
            </ThroughputPerformance>
          </div>
          <div className="flex-main chart" style={{ padding: 0 }}>
            <a href={wclUrl}>
              {perSecond > 0 && (
                <AutoSizer disableWidth>
                  {({ height }) => (
                    <FlushLineChart data={data} duration={this.owner.fightDuration / 1000} height={height} />
                  )}
                </AutoSizer>
              )}
            </a>
          </div>
        </div>
      </StatisticBar>
    );
  }
}

export default HealingDone;
