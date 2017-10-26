import React from 'react';

import CoreAlwaysBeCasting from 'Parser/Core/Modules/AlwaysBeCasting';

import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import { STATISTIC_ORDER } from 'Main/StatisticBox';

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  static ABILITIES_ON_GCD = [
    // Channeled spells   
    SPELLS.FISTS_OF_FURY_CAST.id,
    SPELLS.CRACKLING_JADE_LIGHTNING.id,

    // rotational:
    SPELLS.BLACKOUT_KICK.id,
    SPELLS.RISING_SUN_KICK.id,
    SPELLS.TIGER_PALM.id,
    SPELLS.STRIKE_OF_THE_WINDLORD.id,
    SPELLS.SPINNING_CRANE_KICK.id,
    SPELLS.TOUCH_OF_DEATH.id,

    // talents:
    SPELLS.CHI_WAVE_TALENT.id,
    SPELLS.CHI_BURST_TALENT.id,
    SPELLS.LEG_SWEEP_TALENT.id,
    SPELLS.RING_OF_PEACE_TALENT.id,
    SPELLS.SUMMON_BLACK_OX_STATUE_TALENT.id,
    SPELLS.RUSHING_JADE_WIND_TALENT.id,
    SPELLS.WHIRLING_DRAGON_PUNCH_TALENT.id,

    // utility:
    SPELLS.PARALYSIS.id,
    SPELLS.EFFUSE.id,
    SPELLS.TRANSCENDENCE.id,
    SPELLS.TRANSCENDENCE_TRANSFER.id,
    SPELLS.FLYING_SERPENT_KICK.id,
    
  ];


  suggestions(when) {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    when(deadTimePercentage).isGreaterThan(0.2)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Your downtime can be improved. Try to Always Be Casting (ABC), try to reduce the delay between casting spells.</span>)
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(actual)}% downtime`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(recommended + 0.15).major(recommended + 0.2);
      });
  }

  showStatistic = true;
  statisticOrder = STATISTIC_ORDER.CORE(10);
}

export default AlwaysBeCasting;
