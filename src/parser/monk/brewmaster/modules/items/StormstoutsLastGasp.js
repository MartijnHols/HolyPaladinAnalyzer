import React from 'react';
import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import { formatNumber } from 'common/format';

import Analyzer from 'parser/core/Analyzer';

import getDamageBonus from '../core/GetDamageBonus';

const KEG_SMASH_DMG_BONUS = 0.25;

/**
 * The Brewmaster legendary shoulders, Stormstout's Last Gasp.
 *
 * Grants an additional charge to Keg Smash, and increases Keg Smash
 * damage by 25%. 
 */ 
class StormstoutsLastGasp extends Analyzer {
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasShoulder(ITEMS.STORMSTOUTS_LAST_GASP.id);
  }

  on_byPlayer_damage(event) {
    if(event.ability.guid === SPELLS.KEG_SMASH.id) {
      this.damage += getDamageBonus(event, KEG_SMASH_DMG_BONUS);
    }
  }

  item() {
    return {
      item: ITEMS.STORMSTOUTS_LAST_GASP,
      result: (
        <dfn data-tip={`Keg Smash dealt an additional <b>${formatNumber(this.damage)}</b> damage due to Stormstout's Last Gasp.<br/>Additional casts are not considered.`}>{this.owner.formatItemDamageDone(this.damage)}</dfn>
      ),
    };
  }
}

export default StormstoutsLastGasp;
