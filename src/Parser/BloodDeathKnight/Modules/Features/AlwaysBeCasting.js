import React from 'react';

import CoreAlwaysBeCasting from 'Parser/Core/Modules/AlwaysBeCasting';

import SPELLS from 'common/SPELLS';
import Icon from 'common/Icon';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import SpellLink from 'common/SpellLink';

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  static ABILITIES_ON_GCD = [
    SPELLS.CONSUMPTION.id,
    SPELLS.DEATH_AND_DECAY.id,
    SPELLS.BLOOD_BOIL.id,
    SPELLS.HEART_STRIKE.id,
    SPELLS.MARROWREND.id,
    SPELLS.DEATH_STRIKE.id,
    SPELLS.DEATHS_CARESS.id,
    SPELLS.BLOODDRINKER.id,
    // CDS
    SPELLS.ICEBOUND_FORTITUDE.id,
    SPELLS.DANCING_RUNE_WEAPON.id,
    SPELLS.VAMPIRIC_BLOOD.id,
    SPELLS.ANTI_MAGIC_SHELL.id,
    SPELLS.BLOOD_MIRROR.id,
    // CC
    SPELLS.ASPHYXIATE.id,
    SPELLS.DARK_COMMAND.id,
    SPELLS.DEATH_GRIP.id,
    SPELLS.MIND_FREEZE.id,
    SPELLS.GOREFIENDS_GRASP.id,
    // Movement
    SPELLS.WRAITH_WALK.id,
    // MISC
    SPELLS.CONTROL_UNDEAD.id,
    SPELLS.DEATH_GATE.id,
    SPELLS.RAISE_ALLY.id,

  ];

  suggestions(when) {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    when(deadTimePercentage).isGreaterThan(0.2)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Your dead GCD time can be improved. Try to Always Be Casting (ABC), try to reduce the delay between casting spells. Even if you have to move, try casting something instant - maybe refresh your dots or replenish your mana with <SpellLink id={SPELLS.LIFE_TAP.id} /></span>)
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(actual)}% dead GCD time`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(recommended + 0.15).major(recommended + 0.2);
      });
  }
  statistic() {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    return (
      <StatisticBox
        icon={<Icon icon="petbattle_health-down" alt="Dead time" />}
        value={`${formatPercentage(deadTimePercentage)} %`}
        label="Dead time"
        tooltip="Dead time is available casting time not used for casting any spell. This can be caused by latency, cast interrupting, not casting anything (e.g. due to movement/being stunned), etc."
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.CORE(1);
}

export default AlwaysBeCasting;
