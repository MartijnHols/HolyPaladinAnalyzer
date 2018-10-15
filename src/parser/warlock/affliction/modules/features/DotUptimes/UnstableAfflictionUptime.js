import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import Enemies from 'parser/shared/modules/Enemies';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';

import { formatPercentage, formatThousands } from 'common/format';
import SPELLS from 'common/SPELLS/index';
import SpellLink from 'common/SpellLink';

import StatisticListBoxItem from 'interface/others/StatisticListBoxItem';

import { UNSTABLE_AFFLICTION_DEBUFF_IDS } from '../../../constants';

const CONTAGION_DAMAGE_BONUS = 0.1; // former talent Contagion is now baked into UA

class UnstableAfflictionUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };

  buffedTime = 0;
  damage = 0;
  _buffStart = 0;
  _count = 0;

  on_byPlayer_applydebuff(event) {
    if (!UNSTABLE_AFFLICTION_DEBUFF_IDS.includes(event.ability.guid)) {
      return;
    }
    if (this._count === 0) {
      this._buffStart = event.timestamp;
    }
    this._count += 1;
  }

  on_byPlayer_removedebuff(event) {
    if (!UNSTABLE_AFFLICTION_DEBUFF_IDS.includes(event.ability.guid)) {
      return;
    }
    this._count -= 1;
    if (this._count === 0) {
      this.buffedTime += event.timestamp - this._buffStart;
    }
  }

  on_byPlayer_damage(event) {
    const enemy = this.enemies.getEntity(event);
    if (!enemy) {
      return;
    }
    if (UNSTABLE_AFFLICTION_DEBUFF_IDS.every(id => !enemy.hasBuff(id))) {
      return;
    }
    this.damage += calculateEffectiveDamage(event, CONTAGION_DAMAGE_BONUS);
  }

  get uptime() {
    return this.buffedTime / this.owner.fightDuration;
  }

  get suggestionThresholds() {
    // TODO: adjust for Cascading Calamity (+5%)
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.7,
        average: 0.6,
        major: 0.5,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(
          <>
            Your <SpellLink id={SPELLS.UNSTABLE_AFFLICTION_CAST.id} /> uptime is too low. Try spacing out your UAs a little more so that you get the most out of the internal 10% damage bonus, unless you're pooling for <SpellLink id={SPELLS.SUMMON_DARKGLARE.id} /> or focusing priority targets.
          </>
        )
          .icon(SPELLS.UNSTABLE_AFFLICTION_CAST.icon)
          .actual(`${formatPercentage(actual)}% Unstable Affliction uptime.`)
          .recommended(`> ${formatPercentage(recommended)}% is recommended`);
      });
  }

  subStatistic() {
    return (
      <StatisticListBoxItem
        title={<><SpellLink id={SPELLS.UNSTABLE_AFFLICTION_CAST.id} /> uptime</>}
        value={`${formatPercentage(this.uptime)} %`}
        valueTooltip={`Bonus damage from internal Contagion effect: ${formatThousands(this.damage)}`}
      />
    );
  }
}

export default UnstableAfflictionUptime;
