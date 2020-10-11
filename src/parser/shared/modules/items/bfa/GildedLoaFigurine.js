import React from 'react';

import SPELLS from 'common/SPELLS/index';
import ITEMS from 'common/ITEMS/index';
import Analyzer from 'parser/core/Analyzer';
import UptimeIcon from 'interface/icons/Uptime';
import PrimaryStatIcon from 'interface/icons/PrimaryStat';
import ItemStatistic from 'interface/statistics/ItemStatistic';
import BoringItemValueText from 'interface/statistics/components/BoringItemValueText';
import { formatPercentage, formatNumber } from 'common/format';
import { calculatePrimaryStat } from 'common/stats';

/**
 * Gilded Loa Figurine -
 * Equip: Your spells and abilities have a chance to increase your primary stat by 814 for 10 sec.
 *
 * Test Log(int): https://www.warcraftlogs.com/reports/7Bzx2VWX9TPtYGdK#fight=48&type=damage-done&source=6
 * Test Log(agi): https://www.warcraftlogs.com/reports/JRYakMh4PyVtBxFq#fight=8&type=damage-done&source=270
 * Test log(str): https://www.warcraftlogs.com/reports/rw2H3AKDfN1ghv4B#fight=3&type=damage-done&source=24
 */
class GildedLoaFigurine extends Analyzer {
  statBuff = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrinket(ITEMS.GILDED_LOA_FIGURINE.id);

    if(this.active) {
      this.statBuff = calculatePrimaryStat(280, 676, this.selectedCombatant.getItem(ITEMS.GILDED_LOA_FIGURINE.id).itemLevel);
    }
  }

  get buffTriggerCount() {
    return this.selectedCombatant.getBuffTriggerCount(SPELLS.WILL_OF_THE_LOA.id);
  }

  get totalBuffUptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.WILL_OF_THE_LOA.id) / this.owner.fightDuration;
  }

  statistic() {
    return (
      <ItemStatistic
        size="flexible"
        tooltip={`Procced ${this.buffTriggerCount} times`}
      >
        <BoringItemValueText item={ITEMS.GILDED_LOA_FIGURINE}>
          <UptimeIcon /> {formatPercentage(this.totalBuffUptime)}% uptime<br />
          <PrimaryStatIcon stat={this.selectedCombatant.spec.primaryStat} /> {formatNumber(this.totalBuffUptime * this.statBuff)} <small>average {this.selectedCombatant.spec.primaryStat} gained</small>
        </BoringItemValueText>
      </ItemStatistic>
    );
  }
}

export default GildedLoaFigurine;
