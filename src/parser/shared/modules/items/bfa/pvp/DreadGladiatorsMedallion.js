import React from 'react';

import SPELLS from 'common/SPELLS/index';
import ITEMS from 'common/ITEMS/index';
import Analyzer from 'parser/core/Analyzer';
import { formatPercentage, formatNumber } from 'common/format';
import { calculateSecondaryStatDefault } from 'common/stats';

/**
 * Dread Gladiator's Medallion -
 * Use: Increases Versatility by 429 for 20 sec. (2 Min Cooldown)
 */
class DreadGladiatorsMedallion extends Analyzer {
  statBuff = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrinket(ITEMS.DREAD_GLADIATORS_MEDALLION.id);

    if(this.active) {
      this.statBuff = calculateSecondaryStatDefault(300, 576, this.selectedCombatant.getItem(ITEMS.DREAD_GLADIATORS_MEDALLION.id).itemLevel);
    }
  }

  get totalBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.RAPID_ADAPTATION.id) / this.owner.fightDuration;
  }

  item() {
    return {
      item: ITEMS.DREAD_GLADIATORS_MEDALLION,
      result: (
        <>
          {formatPercentage(this.totalBuffUptime)}% uptime<br />
          {formatNumber(this.totalBuffUptime * this.statBuff)} average Versatility
        </>
      ),
    };
  }
}

export default DreadGladiatorsMedallion;
