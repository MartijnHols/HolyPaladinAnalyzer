import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';

import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import { formatPercentage } from 'common/format';
import RageTracker from '../core/RageTracker';

class Vengeance extends Analyzer {
  static dependencies = {
    rageTracker: RageTracker,
  };

  buffedIgnoreCasts = 0;
  buffedRevengeCasts = 0;
  ignoreBuffsOverwritten = 0;
  revengeBuffsOverwritten = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.VENGEANCE_TALENT.id);
  }

  on_byPlayer_cast(event) {
    if (event.ability.guid !== SPELLS.IGNORE_PAIN.id && event.ability.guid !== SPELLS.REVENGE.id) {
      return;
    }

    if (this.selectedCombatant.hasBuff(SPELLS.VENGEANCE_IGNORE_PAIN.id) && event.ability.guid === SPELLS.REVENGE.id) {
      this.ignoreBuffsOverwritten += 1;
      return;
    }

    if (this.selectedCombatant.hasBuff(SPELLS.VENGEANCE_REVENGE.id) && event.ability.guid === SPELLS.IGNORE_PAIN.id) {
      this.revengeBuffsOverwritten += 1;
      return;
    }

    if (event.ability.guid === SPELLS.REVENGE.id && this.selectedCombatant.hasBuff(SPELLS.VENGEANCE_REVENGE.id)) {
      this.buffedRevengeCasts += 1;
      return;
    }

    if (event.ability.guid === SPELLS.IGNORE_PAIN.id && this.selectedCombatant.hasBuff(SPELLS.VENGEANCE_IGNORE_PAIN.id)) {
      this.buffedIgnoreCasts += 1;
      return;
    }
  }

  get buffUsage() {
    return (this.ignoreBuffsOverwritten + this.revengeBuffsOverwritten) / (this.buffedIgnoreCasts + this.buffedRevengeCasts + this.ignoreBuffsOverwritten + this.revengeBuffsOverwritten);
  }

  get uptimeSuggestionThresholds() {
    return {
      actual: this.buffUsage,
      isGreaterThan: {
        minor: 0,
        average: .1,
        major: .2,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.uptimeSuggestionThresholds)
        .addSuggestion((suggest, actual, recommended) => {
          return suggest(<>Avoid casting <SpellLink id={SPELLS.IGNORE_PAIN.id} /> and <SpellLink id={SPELLS.REVENGE.id} /> back to back without using it's counterpart. <SpellLink id={SPELLS.VENGEANCE_TALENT.id} /> requires you to weave between those two spells to get the most rage and damage out of it.</>)
            .icon(SPELLS.VENGEANCE_TALENT.icon)
            .actual(`${formatPercentage(actual)}% overwritten`)
            .recommended(`${formatPercentage(recommended)}% recommended`);
        });
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.VENGEANCE_TALENT.id} />}
        value={`${formatPercentage(this.buffUsage)}%`}
        label="Buffs unused"
        tooltip={`
          ${this.buffedIgnoreCasts} buffed ${SPELLS.IGNORE_PAIN.name} casts<br/>
          ${this.buffedRevengeCasts} buffed ${SPELLS.REVENGE.name} casts<br/>
          You refreshed your "${SPELLS.VENGEANCE_IGNORE_PAIN.name}" buff ${this.ignoreBuffsOverwritten} times<br/>
          You refreshed your "${SPELLS.VENGEANCE_REVENGE.name}" buff ${this.revengeBuffsOverwritten} times<br/><br/>

          You saved <b>${this.rageTracker.rageSavedByVengeance}</b> Rage by casting ${SPELLS.IGNORE_PAIN.name} and ${SPELLS.REVENGE.name} with Vengeance up.
        `}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(5);
}

export default Vengeance;
