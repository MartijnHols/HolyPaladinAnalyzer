import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';

import Module from 'Parser/Core/Module';
import Combatants from 'Parser/Core/Modules/Combatants';

const T21_4SET_YSERAS_BOOST = 5;

class T21_4Set extends Module {
  static dependencies = {
    combatants: Combatants,
  };

  yserasDuringAwakenedHealing = 0;

  on_initialized() {
    this.active = this.combatants.selected.hasBuff(SPELLS.RESTO_DRUID_T21_4SET_BONUS_BUFF.id);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    const amount = event.amount + (event.absorbed || 0);

    if (this.combatants.selected.hasBuff(SPELLS.AWAKENED.id) && (spellId === SPELLS.YSERAS_GIFT_1.id || spellId === SPELLS.YSERAS_GIFT_2.id)) {
      this.yserasDuringAwakenedHealing += amount;
    }
  }

  item() {
    const t21_4set_healing = this.yserasDuringAwakenedHealing * (1 - (1 / T21_4SET_YSERAS_BOOST));

    return {
      id: `spell-${SPELLS.RESTO_DRUID_T21_4SET_BONUS_BUFF.id}`,
      icon: <SpellIcon id={SPELLS.RESTO_DRUID_T21_4SET_BONUS_BUFF.id} />,
      title: <SpellLink id={SPELLS.RESTO_DRUID_T21_4SET_BONUS_BUFF.id} />,
      // result: this.owner.formatItemHealingDone(healing),
      result: (
        <dfn data-tip={'This is the amount of healing done by the extra Ysera\'s Gift ticks only. Healing from the additional applications of Dreamer are counted under the T21 2Set number'}>
          {this.owner.formatItemHealingDone(t21_4set_healing)}
        </dfn>
      ),
    };
  }
}

export default T21_4Set;
