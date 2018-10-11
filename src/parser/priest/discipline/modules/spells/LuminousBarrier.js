import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';

import { formatNumber, formatPercentage } from 'common/format';

import Analyzer from 'parser/core/Analyzer';

import StatisticBox from 'interface/others/StatisticBox';

import SuggestionThresholds from '../../SuggestionThresholds';

class LuminousBarrier extends Analyzer {
  totalAbsorb = 0;
  wastedAbsorb = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.LUMINOUS_BARRIER_TALENT.id);
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.LUMINOUS_BARRIER_TALENT.id) {
      return;
    }
    this.totalAbsorb += event.absorb;
  }

  on_byPlayer_removebuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.LUMINOUS_BARRIER_TALENT.id) {
      return;
    }

    if (event.absorb > 0) {
      this.wastedAbsorb += event.absorb;
    }
  }

  statistic() {

    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.LUMINOUS_BARRIER_TALENT.id} />}
        value={`${formatNumber(this.wastedAbsorb / this.owner.fightDuration * 1000)} HPS`}
        label={(
          <dfn data-tip={`The amount of shield absorb remaining on Luminous Barrier instances that have expired. There was a total of ${formatNumber(this.wastedAbsorb)} (${formatPercentage(this.wastedAbsorb / this.totalAbsorb)} %) unused Luminous Barrier absorb on a total of ${formatNumber(this.totalAbsorb)} applied.`}>
            Unused LB absorb
          </dfn>
        )}
      />
    );
  }

  suggestions(when) {
    const wastedPourcentage = this.wastedAbsorb / this.totalAbsorb || 0;

    when(wastedPourcentage).isGreaterThan(SuggestionThresholds.LUMINOUS_BARRIER_TALENT_WASTED.minor)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Your <SpellLink id={SPELLS.LUMINOUS_BARRIER_TALENT.id} /> usage can be improved.</span>)
          .icon(SPELLS.LUMINOUS_BARRIER_TALENT.icon)
          .actual(`${formatPercentage(wastedPourcentage)}% wasted`)
          .recommended(`<${Math.round(formatPercentage(recommended))}% is recommended`)
          .regular(SuggestionThresholds.LUMINOUS_BARRIER_TALENT_WASTED.regular).major(SuggestionThresholds.LUMINOUS_BARRIER_TALENT_WASTED.major);
      });
  }
}

export default LuminousBarrier;
