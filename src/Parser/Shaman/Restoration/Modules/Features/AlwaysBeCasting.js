import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';

import CoreAlwaysBeCastingHealing from 'Parser/Core/Modules/AlwaysBeCastingHealing';

const HEALING_ABILITIES_ON_GCD = [
  SPELLS.HEALING_WAVE.id,
  SPELLS.CHAIN_HEAL.id,
  SPELLS.HEALING_SURGE_RESTORATION.id,
  SPELLS.RIPTIDE.id,
  SPELLS.HEALING_RAIN_CAST.id,
  SPELLS.HEALING_STREAM_TOTEM_CAST.id,
  SPELLS.HEALING_TIDE_TOTEM_CAST.id,
  SPELLS.SPIRIT_LINK_TOTEM.id,
  SPELLS.GIFT_OF_THE_QUEEN.id,
  SPELLS.WELLSPRING_TALENT.id,
  SPELLS.CLOUDBURST_TOTEM_TALENT.id,
  SPELLS.EARTHEN_SHIELD_TOTEM_TALENT.id,
  SPELLS.UNLEASH_LIFE_TALENT.id,
];

class AlwaysBeCasting extends CoreAlwaysBeCastingHealing {
  static HEALING_ABILITIES_ON_GCD = HEALING_ABILITIES_ON_GCD;
  static ABILITIES_ON_GCD = [
    ...HEALING_ABILITIES_ON_GCD,
    192063, // Gust of Wind
    192077, // Wind Rush Totem
    192058, // Lightning Surge Totem
    51485, // Earthgrab totem
    196932, // Voodoo totem
    207399, // APT
    403, // Lightning Bolt
    188838, // Flame shock
    2484, // Earthbind totem
    51505, // Lava Burst
    6196, // Far sight
    2645, // Ghost wolf
    77130, // Purify spirit
    421, // Chain lightning
    546, // water walking
    211004, 51514, 211010, 210873, 211015, // Variants of hex
    556, // Astral recall
    370, // purge
  ];

  suggestions(when) {
    const nonHealingTimePercentage = this.totalHealingTimeWasted / this.owner.fightDuration;
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;
    when(nonHealingTimePercentage).isGreaterThan(0.3)
      .addSuggestion((suggest, actual, recommended) =>
        suggest(`Your non healing time can be improved. Try to cast heals more regularly (${Math.round(nonHealingTimePercentage * 100)}% non healing time).`)
          .icon('petbattle_health-down')
          .actual(`${formatPercentage(actual)}% non healing time`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(recommended + 0.1).major(recommended + 0.15)
      );
    when(deadTimePercentage).isGreaterThan(0.2)
      .addSuggestion((suggest, actual, recommended) =>
        suggest(`Your downtime can be improved. Try to Always Be Casting (ABC); when you're not healing try to contribute some damage.`)
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(actual)}% downtime`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(recommended + 0.15).major(recommended + 0.2)
      );
  }

  showStatistic = true;
}

export default AlwaysBeCasting;
