import SPELLS from 'common/SPELLS/index';

import Potion from './Potion';

/**
 * Tracks health potion cooldown.
 */
class HealthPotion extends Potion {
  static spells = [
    SPELLS.ABYSSAL_HEALING_POTION,
    SPELLS.COASTAL_HEALING_POTION,
  ];
  static recommendedEfficiency = 0;
  static extraAbilityInfo = {
    isDefensive: true,
  };
}

export default HealthPotion;
