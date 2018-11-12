import React from 'react';

import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import { ABILITIES_AFFECTED_BY_DAMAGE_INCREASES } from '../../constants';

// This module looks at the relative amount of damage buffed rather than strict uptime to be more accurate for fights with high general downtime

class Inquisition extends Analyzer {
  buffedDamage = 0;
  unbuffedDamage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.INQUISITION_TALENT.id);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (!ABILITIES_AFFECTED_BY_DAMAGE_INCREASES.includes(spellId)) {
      return;
    }
    if (this.selectedCombatant.hasBuff(SPELLS.INQUISITION_TALENT.id)) {
      this.buffedDamage += event.amount + (event.absorbed || 0);
    }
    else {
      this.unbuffedDamage += event.amount + (event.absorbed || 0);
    }
  }
  get efficiency() {
    return this.buffedDamage / (this.buffedDamage + this.unbuffedDamage);
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.INQUISITION_TALENT.id) / this.owner.fightDuration;
  }

  get suggestionThresholds() {
    return {
      actual: this.efficiency,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: 0.85,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<>Your <SpellLink id={SPELLS.INQUISITION_TALENT.id} icon /> efficiency is low. You should aim to have it active as often as possible while dealing damage</>)
        .icon(SPELLS.INQUISITION_TALENT.icon)
        .actual(`${formatPercentage(this.efficiency)}% of damage buffed`)
        .recommended(`>${formatPercentage(recommended)}% is recommended`);
    });
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.INQUISITION_TALENT.id} />}
        value={`${formatPercentage(this.efficiency)}%`}
        label="Damage done while buffed"
        tooltip={`Relative amount of damage done while Inquisition was active. You had Inquisition active for ${formatPercentage(this.uptime)}% of the fight`}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(5);
}

export default Inquisition;
