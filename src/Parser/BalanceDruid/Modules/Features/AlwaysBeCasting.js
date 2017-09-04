import React from 'react';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import CoreAlwaysBeCasting from 'Parser/Core/Modules/AlwaysBeCasting';
import SPELLS from 'common/SPELLS';
import Icon from 'common/Icon';

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  static ABILITIES_ON_GCD = [
    // Moonkin:
    SPELLS.MOONFIRE.id,
    SPELLS.SUNFIRE_CAST.id,
    SPELLS.STARSURGE_MOONKIN.id,
    SPELLS.STARFALL_CAST.id,
    SPELLS.LUNAR_STRIKE.id,
    SPELLS.SOLAR_WRATH_MOONKIN.id,
    SPELLS.NEW_MOON.id,
    SPELLS.HALF_MOON.id,
    SPELLS.FULL_MOON.id,
    SPELLS.MOONKIN_FORM,

    // Talents
    SPELLS.DISPLACER_BEAST_TALENT.id,
    SPELLS.TYPHOON.id,
    SPELLS.MASS_ENTANGLEMENT_TALENT.id,
    SPELLS.FORCE_OF_NATURE_TALENT.id,
    SPELLS.WILD_CHARGE_TALENT.id,
  ];
  ///TODO Add Moonkin haste buffs
  
  suggestions(when) {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;
    
    when(deadTimePercentage).isGreaterThan(0.02)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span> Your downtime can be improved. Try to Always Be Casting (ABC)...</span>)
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(actual)}% downtime`)
          .recommended(`${Math.round(formatPercentage(recommended))}% or more is recommended`)
          .regular(recommended + 0.03).major(recommended + 0.08);
      });
  }

  statistic() {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;
   
    return (
      <StatisticBox
        icon={<Icon icon="spell_mage_altertime" alt="Downtime" />}
        value={`${formatPercentage(deadTimePercentage)} %`}
        label='Downtime'
        tooltip='Downtime is available casting time not used. This can be caused by latency, cast interrupting, not casting anything (e.g. due to movement/stunned), etc.'
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(0);
}

export default AlwaysBeCasting;
