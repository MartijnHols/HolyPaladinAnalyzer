import React from 'react';

import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';

import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

const BUFF_DURATION = 20000;

class DemonicCalling extends Analyzer {
  wastedProcs = 0;
  _expectedBuffEnd = undefined;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.DEMONIC_CALLING_TALENT.id);
  }

  on_toPlayer_applybuff(event) {
    if (event.ability.guid !== SPELLS.DEMONIC_CALLING_BUFF.id) {
      return;
    }
    this._expectedBuffEnd = event.timestamp + BUFF_DURATION;
  }

  on_toPlayer_refreshbuff(event) {
    if (event.ability.guid !== SPELLS.DEMONIC_CALLING_BUFF.id) {
      return;
    }
    this.wastedProcs += 1;
    this._expectedBuffEnd = event.timestamp + BUFF_DURATION;
  }

  on_toPlayer_removebuff(event) {
    if (event.ability.guid !== SPELLS.DEMONIC_CALLING_BUFF.id) {
      return;
    }
    if (event.timestamp >= this._expectedBuffEnd) {
      // the buff fell off, another wasted instant
      this.wastedProcs += 1;
    }
  }

  get suggestionThresholds() {
    const wastedPerMinute = this.wastedProcs / this.owner.fightDuration * 1000 * 60;
    return {
      actual: wastedPerMinute,
      isGreaterThan: {
        minor: 1,
        average: 1.5,
        major: 2,
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>You should try to use your cheaper <SpellLink id={SPELLS.CALL_DREADSTALKERS.id} /> as much as possible as Dreadstalkers make a great portion of your damage.<br /><br /><small>NOTE: Some wasted procs are probably unavoidable (e.g. <SpellLink id={SPELLS.CALL_DREADSTALKERS.id} /> on cooldown, proc waiting but gets overwritten by another)</small></>)
          .icon(SPELLS.DEMONIC_CALLING_TALENT.icon)
          .actual(`${actual.toFixed(2)} wasted procs per minute`)
          .recommended(`< ${recommended} is recommended`);
      });
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.DEMONIC_CALLING_TALENT.id} />}
        value={this.wastedProcs}
        label="Wasted cheaper Dreadstalkers"
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.OPTIONAL(0);
}

export default DemonicCalling;
