import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import getDamageBonusStacked from 'Parser/DeathKnight/Shared/getDamageBonusStacked';

const VEINRENDER_INCREASE = 0.03;

/**
 * Veinrender
 * Increases the damage of Heart Strike by 3%
 */
class Veinrender extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  rank = 0;
  damage = 0;

  on_initialized() {
    this.rank = this.combatants.selected.traitsBySpellId[SPELLS.VEINRENDER_TRAIT.id];
    this.active = this.rank > 0;
  }

  on_byPlayer_damage(event) {
    if(event.ability.guid !== SPELLS.HEART_STRIKE.id){
      return;
    }
    this.damage += getDamageBonusStacked(event, VEINRENDER_INCREASE, this.rank);
  }

  subStatistic() {
    return (
      <div className="flex">
        <div className="flex-main">
          <SpellLink id={SPELLS.VEINRENDER_TRAIT.id}>
            <SpellIcon id={SPELLS.VEINRENDER_TRAIT.id} noLink /> Veinrender
          </SpellLink>
        </div>
        <div className="flex-sub text-right">
          {formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.damage))} %
        </div>
      </div>
    );
  }
}

export default Veinrender;
