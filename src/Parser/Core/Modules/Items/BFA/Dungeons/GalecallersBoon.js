import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import Analyzer from 'Parser/Core/Analyzer';
import { formatPercentage, formatNumber } from 'common/format';
import { calculateSecondaryStatDefault } from 'common/stats';

/**
 * Galecaller's Boon
 * Place a ward on the ground for 10 sec which increases your Haste by [x] and your Speed by [x] while you stand within it.
 */
class GalecallersBoon extends Analyzer {
  statBuff = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrinket(ITEMS.GALECALLERS_BOON.id);

    if (this.active) {
      this.statBuff = calculateSecondaryStatDefault(310, 917, this.selectedCombatant.getItem(ITEMS.GALECALLERS_BOON.id).itemLevel);
    }
  }

  get totalBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.GALECALLERS_BOON_BUFF.id) / this.owner.fightDuration;
  }

  item() {
    return {
      item: ITEMS.GALECALLERS_BOON,
      result: (
        <React.Fragment>
          {formatPercentage(this.totalBuffUptime)}% uptime<br />
          {formatNumber(this.totalBuffUptime * this.statBuff)} average Haste/Speed
        </React.Fragment>
      ),
    };
  }
}

export default GalecallersBoon;
