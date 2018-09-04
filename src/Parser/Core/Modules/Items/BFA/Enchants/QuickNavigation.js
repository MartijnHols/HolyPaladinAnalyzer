import React from 'react';

import ITEMS from 'common/ITEMS';
import Analyzer from 'Parser/Core/Analyzer';
import { formatPercentage, formatNumber } from 'common/format';
import SPELLS from 'common/SPELLS/BFA/Enchants';

/**
 * Quick Navigation
 * Permanently enchant a weapon to sometimes increase Haste by 50 for 30 sec, stacking up to 5 times. Upon reaching 5 stacks, all stacks are consumed to grant you 600 Haste for 10 sec.
 */
const HASTE_PER_STACK = 50;
const HASTE_AT_MAX = 600;

class QuickNavigation extends Analyzer {
  statBuff = 0;
  static ENCHANTABLE_SLOTS = { 15: 'MainHand' };
  static MAX_ENCHANT_IDS = [
    5963, //Quick Navigation
  ];
  /**
   * The below getters are temporary until PR 2115 is passed
   */
  get enchantableGear() {
    return Object.keys(this.constructor.ENCHANTABLE_SLOTS).reduce((obj, slot) => {
      obj[slot] = this.selectedCombatant._getGearItemBySlotId(slot);
      return obj;
    }, {});
  }
  hasEnchant(item) {
    return !!item.permanentEnchant;
  }
  hasMaxEnchant(item) {
    return this.constructor.MAX_ENCHANT_IDS.includes(item.permanentEnchant);
  }
  get slotsMissingMaxEnchant() {
    const gear = this.enchantableGear;
    return Object.keys(gear).filter(slot => this.hasEnchant(gear[slot]) && !this.hasMaxEnchant(gear[slot]));
  }
  get numSlotsMissingMaxEnchant() {
    return this.slotsMissingMaxEnchant.length;
  }

  constructor(...args) {
    super(...args);
    this.active = this.numSlotsMissingMaxEnchant === 0;
  }
  averageStatGain(spellId) {
    const averageStacks = this.selectedCombatant.getStackWeightedBuffUptime(spellId) / this.owner.fightDuration;
    const maxStacksUptime = this.selectedCombatant.getBuffUptime(SPELLS.QUICK_NAVIGATION_BUFF_BIG.id) / this.owner.fightDuration;
    return averageStacks * HASTE_PER_STACK + maxStacksUptime * HASTE_AT_MAX;
  }

  get stackBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.QUICK_NAVIGATION_BUFF_SMALL.id) / this.owner.fightDuration;
  }

  get maxStackBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.QUICK_NAVIGATION_BUFF_BIG.id) / this.owner.fightDuration;

  }

  item() {
    return {
      item: ITEMS.GALECALLERS_BOON,
      result: (
        <React.Fragment>
          {formatPercentage(this.stackBuffUptime)}% uptime<br />
          {formatPercentage(this.maxStackBuffUptime)}% max stack uptime <br />
          {formatNumber(this.averageStatGain(SPELLS.QUICK_NAVIGATION_BUFF_SMALL.id))} average Haste
        </React.Fragment>
      ),
    };
  }
}

export default QuickNavigation;
