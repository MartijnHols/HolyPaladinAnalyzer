import React from 'react';

import CoreAlwaysBeCasting from 'Parser/Core/Modules/AlwaysBeCasting';

import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';
import { STATISTIC_ORDER } from 'Main/StatisticBox';
import SpellLink from 'common/SpellLink';

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  static ABILITIES_ON_GCD = [
    // artifact
    SPELLS.APOCALYPSE.id,
    // core unholy abilities
    SPELLS.ARMY_OF_THE_DEAD.id,
    SPELLS.DARK_TRANSFORMATION.id,
    SPELLS.DEATH_COIL.id,
    SPELLS.FESTERING_STRIKE.id,
    SPELLS.OUTBREAK.id,
    SPELLS.RAISE_DEAD.id,
    SPELLS.SCOURGE_STRIKE.id,
    SPELLS.SUMMON_GARGOYLE.id,

    // unholy active talents
    SPELLS.EPIDEMIC_TALENT.id,
    SPELLS.BLIGHTED_RUNE_WEAPON_TALENT.id,
    SPELLS.CLAWING_SHADOWS_TALENT.id,
    SPELLS.ASPHYXIATE_TALENT.id,
    SPELLS.CORPSE_SHIELD_TALENT.id,
    SPELLS.DARK_ARBITER_TALENT.id,
    SPELLS.DEFILE_TALENT.id,
    SPELLS.SOUL_REAPER_TALENT.id,

    // shared abilities
    SPELLS.ANTI_MAGIC_SHELL.id,
    SPELLS.CHAINS_OF_ICE.id,
    SPELLS.DARK_COMMAND.id,
    SPELLS.DEATH_GRIP.id,
    SPELLS.MIND_FREEZE.id,
    SPELLS.DEATH_AND_DECAY.id,
    SPELLS.DEATH_STRIKE.id,
    SPELLS.ICEBOUND_FORTITUDE.id,
    SPELLS.CONTROL_UNDEAD.id,
    SPELLS.RAISE_ALLY.id,
    SPELLS.WRAITH_WALK.id,
  ];

  suggestions(when) {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    when(deadTimePercentage).isGreaterThan(0.2)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Your downtime can be improved. Try to Always Be Casting (ABC), reducing time away from the boss unless due to mechanics.  If you do have to move, try casting filler spells, such as <SpellLink id={SPELLS.DEATH_COIL.id}/> or <SpellLink id={SPELLS.OUTBREAK.id}/>.</span>)
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(actual)}% downtime`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(recommended + 0.15).major(recommended + 0.2);
      });
  }

  showStatistic = true;
  statisticOrder = STATISTIC_ORDER.CORE(1);
}

export default AlwaysBeCasting;
