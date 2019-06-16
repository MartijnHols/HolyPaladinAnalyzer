import React from 'react';

import SpellIcon from 'common/SpellIcon';
import { formatDuration, formatPercentage } from 'common/format';
import SpellLink from 'common/SpellLink';
import StatisticBox from 'interface/others/StatisticBox';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import UptimeIcon from 'interface/icons/Uptime';
import CriticalStrikeIcon from 'interface/icons/CriticalStrike';
import Analyzer from 'parser/core/Analyzer';

/**
 * Navigation Enchants
 * Permanently enchant a weapon to sometimes increase <stat> by 50 for 30 sec, stacking up to 5 times. Upon reaching 5 stacks, all stacks are consumed to grant you 600 <stat> for 10 sec.
 */
class Navigation extends Analyzer {
  static enchantableSlots = {
    15: 'MainHand',
    16: 'OffHand',
  };
  static enchantId = null;
  static smallBuffId = null;
  static bigBuffId = null;
  static primaryStat = "";
  static statPerStack = 50;
  static statAtMax = 600;

  getEnchantableGear() {
    return Object.keys(this.constructor.enchantableSlots).reduce((obj, slot) => {
      obj[slot] = this.selectedCombatant._getGearItemBySlotId(slot);
      return obj;
    }, {});
  }
  itemHasTrackedEnchant(item) {
    return item && item.permanentEnchant === this.constructor.enchantId;
  }
  hasTrackedEnchant() {
    const items = this.getEnchantableGear();
    return Object.values(items).some(item => this.itemHasTrackedEnchant(item));
  }
  constructor(...args) {
    super(...args);
    this.active = this.hasTrackedEnchant();
  }

  get smallStackBuffUptime() {
    return this.selectedCombatant.getBuffUptime(this.constructor.smallBuffId);
  }
  get maxStackBuffUptime() {
    return this.selectedCombatant.getBuffUptime(this.constructor.bigBuffId);
  }
  get averageStat() {
    const buffStacks = this.selectedCombatant.getStackBuffUptimes(this.constructor.smallBuffId);

    const smallBuffDuration = Object.keys(buffStacks).reduce((total, stackSize) => {
      return total + (buffStacks[stackSize] * stackSize);
    }, 0);

    const smallBuffIncrease = smallBuffDuration * this.constructor.statPerStack;
    const bigBuffIncrease = this.maxStackBuffUptime * this.constructor.statAtMax;

    return ((smallBuffIncrease + bigBuffIncrease) / this.owner.fightDuration).toFixed(0);
  }
  statistic() {
    const buffStacks = this.selectedCombatant.getStackBuffUptimes(this.constructor.smallBuffId);
    const maxStackBuffDuration = this.maxStackBuffUptime;
    return (
      <StatisticBox
        icon={<SpellIcon id={this.constructor.smallBuffId} />}
        value={(
          <>
            <UptimeIcon /> {formatPercentage((this.smallStackBuffUptime + maxStackBuffDuration) / this.owner.fightDuration, 0)}% <small>uptime</small><br />
            <CriticalStrikeIcon /> {this.averageStat} <small>average {this.constructor.primaryStat} gained</small>
          </>
        )}
        label={<SpellLink id={this.constructor.smallBuffId} icon={false} />}
        category={STATISTIC_CATEGORY.ITEMS}
      >
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>{this.constructor.primaryStat}-Bonus</th>
              <th>Time (s)</th>
              <th>Time (%)</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(buffStacks).map((stackSize) => {
                let totalStackDuration = buffStacks[stackSize];

                if (stackSize === '0'){
                  totalStackDuration -= maxStackBuffDuration;
                }

                return (
                  <tr key={stackSize}>
                    <th>{(stackSize * this.constructor.statPerStack).toFixed(0)}</th>
                    <td>{formatDuration(totalStackDuration / 1000)}</td>
                    <td>{formatPercentage(totalStackDuration / this.owner.fightDuration)}%</td>
                  </tr>
                );
              })
            }
            <tr key="max">
              <th>{this.constructor.statAtMax}</th>
              <td>{formatDuration(maxStackBuffDuration / 1000)}</td>
              <td>{formatPercentage(maxStackBuffDuration / this.owner.fightDuration)}%</td>
            </tr>
          </tbody>
        </table>
      </StatisticBox>
    );
  }
}
export default Navigation;
