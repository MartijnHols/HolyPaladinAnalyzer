import SPELLS from 'common/SPELLS/bfa/enchants';
import Navigation from 'parser/shared/modules/items/bfa/enchants/Navigation';

/**
 * Quick Navigation
 * Permanently enchant a weapon to sometimes increase Haste by 50 for 30 sec, stacking up to 5 times. Upon reaching 5 stacks, all stacks are consumed to grant you 600 Haste for 10 sec.
 *
 * Example: https://www.warcraftlogs.com/reports/j7XQrN8LcJKw1qM3#fight=29&type=auras&view=timeline&target=36
 */
class QuickNavigation extends Navigation {
  static enchantId = 5963; // Weapon Enchant - Quick Navigation
  static smallBuffId = SPELLS.QUICK_NAVIGATION_BUFF_SMALL.id;
  static bigBuffId = SPELLS.QUICK_NAVIGATION_BUFF_BIG.id;
  static primaryStat = 'Haste';
}

export default QuickNavigation;
