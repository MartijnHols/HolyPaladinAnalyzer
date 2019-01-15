import React from 'react';

import SPELLS from 'common/SPELLS/index';
import ITEMS from 'common/ITEMS/index';
import Analyzer from 'parser/core/Analyzer';
import { formatPercentage, formatNumber } from 'common/format';
import { calculateSecondaryStatDefault } from 'common/stats';
import Abilities from 'parser/core/modules/Abilities';

/**
 * Galecaller's Boon
 * Place a ward on the ground for 10 sec which increases your Haste by [x] and your Speed by [x] while you stand within it.
 *
 * Example: https://www.warcraftlogs.com/reports/BhLHrn1PzQRJ6XVZ/#fight=6&source=8&type=auras&ability=268311
 */
class GalecallersBoon extends Analyzer {
  static dependencies = {
    abilities: Abilities,
  };

  statBuff = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrinket(ITEMS.GALECALLERS_BOON.id);

    if (this.active) {
      this.statBuff = calculateSecondaryStatDefault(310, 917, this.selectedCombatant.getItem(ITEMS.GALECALLERS_BOON.id).itemLevel);
      this.abilities.add({
        spell: SPELLS.GALECALLERS_BOON_CAST,
        buffSpellId: SPELLS.GALECALLERS_BOON_BUFF.id,
        name: ITEMS.GALECALLERS_BOON.name,
        category: Abilities.SPELL_CATEGORIES.ITEMS,
        cooldown: 60,
        castEfficiency: {
          suggestion: true,
        },
      });
    }
  }

  get totalBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.GALECALLERS_BOON_BUFF.id) / this.owner.fightDuration;
  }

  statistic() {
    return {
      item: ITEMS.GALECALLERS_BOON,
      result: (
        <>
          {formatPercentage(this.totalBuffUptime)}% uptime<br />
          {formatNumber(this.totalBuffUptime * this.statBuff)} average Haste/Speed
        </>
      ),
    };
  }
}

export default GalecallersBoon;
