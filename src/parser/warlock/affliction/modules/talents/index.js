import React from 'react';

import Analyzer from 'parser/core/Analyzer';

import StatisticsListBox, { STATISTIC_ORDER } from 'interface/others/StatisticsListBox';

import AbsoluteCorruption from './AbsoluteCorruption';
import Deathbolt from './Deathbolt';
import DrainSoul from './DrainSoul';
import DrainSoulSniping from './DrainSoulSniping';
import Haunt from './Haunt';
import Nightfall from './Nightfall';
import PhantomSingularity from './PhantomSingularity';
import SiphonLifeUptime from './SiphonLifeUptime';
import SoulConduit from './SoulConduit';

class TalentStatisticBox extends Analyzer {
  static dependencies = {
    nightfall: Nightfall,
    drainSoul: DrainSoul,
    drainSoulSniping: DrainSoulSniping,
    deathbolt: Deathbolt,
    absoluteCorruption: AbsoluteCorruption,
    siphonLifeUptime: SiphonLifeUptime,
    phantomSingularity: PhantomSingularity,
    haunt: Haunt,
    soulConduit: SoulConduit,
  };

  constructor(...args) {
    super(...args);
    this.active = Object.keys(this.constructor.dependencies)
      .map(name => this[name].active)
      .includes(true);
  }

  statistic() {
    return (
      <StatisticsListBox
        position={STATISTIC_ORDER.CORE(4)}
        title="Talents">
        {
          Object.keys(this.constructor.dependencies)
            .map(name => this[name])
            .filter(module => module.active)
            .map(module => module.subStatistic())
        }
      </StatisticsListBox>
    );
  }
}

export default TalentStatisticBox;
