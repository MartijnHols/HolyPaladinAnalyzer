import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatNumber, formatPercentage } from 'common/format';
import { TooltipElement } from 'common/Tooltip';
import Analyzer from 'parser/core/Analyzer';
import calculateEffectiveHealing from 'parser/core/calculateEffectiveHealing';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import { AbsorbedEvent, DamageEvent, HealEvent } from 'parser/core/Events';
import { SuggestionFactory, When } from 'parser/core/ParseResults';
import { Options } from 'parser/core/Module';

import { ABILITIES_AFFECTED_BY_HEALING_INCREASES } from '../../constants';

const TWIST_OF_FATE_HEALING_INCREASE = 0.2;

class TwistOfFate extends Analyzer {
  healing = 0;
  damage = 0;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(SPELLS.TWIST_OF_FATE_TALENT_DISCIPLINE.id);
  }

  on_byPlayer_damage(event: DamageEvent) {
    if (!this.selectedCombatant.hasBuff(SPELLS.TWIST_OF_FATE_BUFF_DISCIPLINE.id, event.timestamp)) {
      return;
    }

    const raw = event.amount + (event.absorbed || 0);
    this.damage += raw - raw / 1.2;
  }

  on_byPlayer_heal(event: HealEvent) {
    this.parseHeal(event);
  }

  on_byPlayer_absorbed(event: AbsorbedEvent) {
    this.parseHeal(event);
  }

  parseHeal(event: HealEvent | AbsorbedEvent) {
    const spellId = event.ability.guid;
    if (!ABILITIES_AFFECTED_BY_HEALING_INCREASES.includes(spellId)) {
      return;
    }
    if (!this.selectedCombatant.hasBuff(SPELLS.TWIST_OF_FATE_BUFF_DISCIPLINE.id, event.timestamp)) {
      return;
    }

    this.healing += calculateEffectiveHealing(event, TWIST_OF_FATE_HEALING_INCREASE);
  }

  suggestions(when: When) {
    when(this.owner.getPercentageOfTotalHealingDone(this.healing)).isLessThan(0.05)
      .addSuggestion((suggest: SuggestionFactory, actual: number, recommended: number) => suggest(<span>Consider picking a different talent than <SpellLink id={SPELLS.TWIST_OF_FATE_TALENT_DISCIPLINE.id} />. Castigation will give a consistent 3-5% increase and Schism provides a significant DPS increase if more healing is not needed.</span>)
          .icon(SPELLS.TWIST_OF_FATE_TALENT_DISCIPLINE.icon)
          .actual(`${formatPercentage(actual)}% of total healing`)
          .recommended(`>${formatPercentage(recommended)}% is recommended.`)
          .regular(0.045)
          .major(0.025));

  }

  statistic() {
    if (!this.active) {
      return null;
    }

    const healing = this.healing || 0;
    const damage = this.damage || 0;
    const tofPercent = this.owner.getPercentageOfTotalHealingDone(healing);
    const tofDamage = this.owner.getPercentageOfTotalDamageDone(damage);

    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.TWIST_OF_FATE_TALENT_DISCIPLINE.id} />}
        value={this.owner.formatItemHealingDone(healing)}
        label={(
          <TooltipElement
            content={
              `The effective healing contributed by Twist of Fate was ${formatPercentage(tofPercent)}% of total healing done. Twist of Fate also contributed ${formatNumber(damage / this.owner.fightDuration * 1000)} DPS (${formatPercentage(tofDamage)}% of total damage); the healing gain of this damage was included in the shown numbers.`
            }
          >
            Twist of Fate Healing
          </TooltipElement>
        )}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.OPTIONAL();
}

export default TwistOfFate;
