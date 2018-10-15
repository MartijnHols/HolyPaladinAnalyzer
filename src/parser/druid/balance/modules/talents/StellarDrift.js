import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage, formatNumber } from 'common/format';

import Analyzer from 'parser/core/Analyzer';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';

import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

const STARFALL_BONUS_DAMAGE = 0.25;

class StellarDrift extends Analyzer {
  bonusDamage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.STELLAR_DRIFT_TALENT.id);
  }

  on_byPlayer_damage(event) {
    if (event.ability.guid !== SPELLS.STARFALL.id) {
      return;
    }
      this.bonusDamage += calculateEffectiveDamage(event, STARFALL_BONUS_DAMAGE);
  }

  get damagePercent() {
    return this.owner.getPercentageOfTotalDamageDone(this.bonusDamage);
  }

  get perSecond() {
    return this.bonusDamage / (this.owner.fightDuration / 1000);
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.STELLAR_DRIFT_TALENT.id} />}
        value={`${formatPercentage(this.damagePercent)} %`}
        label="Of total damage"
        tooltip={`Contributed ${formatNumber(this.perSecond)} DPS (${formatNumber(this.bonusDamage)} total damage). This does not account for any extra damage gained from the increased radius or the ability to move while casting.`}
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.OPTIONAL();
}

export default StellarDrift;
