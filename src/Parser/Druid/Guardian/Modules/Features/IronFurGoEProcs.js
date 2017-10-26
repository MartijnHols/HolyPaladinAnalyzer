import React from 'react';
import { formatPercentage } from 'common/format';
import SpellIcon from 'common/SpellIcon';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import SPELLS from 'common/SPELLS';
import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';

import GuardianOfElune from './GuardianOfElune';

class IronFurGoEProcs extends Analyzer {
  static dependencies = {
    combatants: Combatants,
    guardianOfElune: GuardianOfElune,
  };

  on_initialized() {
    this.active = this.combatants.selected.hasTalent(SPELLS.GUARDIAN_OF_ELUNE_TALENT.id);
  }

  statistic() {
    const nonGoEIronFur = this.guardianOfElune.nonGoEIronFur;
    const GoEIronFur = this.guardianOfElune.GoEIronFur;
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.IRONFUR.id} />}
        value={`${formatPercentage(nonGoEIronFur / (nonGoEIronFur + GoEIronFur))}%`}
        label="Unbuffed Ironfur"
        tooltip={`You cast <b>${nonGoEIronFur + GoEIronFur}</b> total ${SPELLS.IRONFUR.name} and <b>${GoEIronFur}</b> were buffed by 2s.`}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(9);
}

export default IronFurGoEProcs;
