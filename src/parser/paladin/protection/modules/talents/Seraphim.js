import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import Analyzer from 'parser/core/Analyzer';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import SpellUsable from 'parser/core/modules/SpellUsable';
import { formatPercentage } from 'common/format';

/**
 * Consumes up to 2 SotR charges to provice 1007 Haste+Vers+Mastery+Crit for 8sec per consumed charge
*/

const SERAPHIM_STAT_BUFF = 1007;

class Seraphim extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.SERAPHIM_TALENT.id);
  }

  on_byPlayer_cast(event) {
    if (event.ability.guid !== SPELLS.SERAPHIM_TALENT.id) {
      return;
    }
   
    //should end up always with 0 charges when cast with <2 charges (seraphim can consume charges that are not fully recharges)
    //proper tracking of SotR charges used by seraphim only possible once SotR charges are 100% accurate
    this.spellUsable.beginCooldown(SPELLS.SHIELD_OF_THE_RIGHTEOUS.id, event.timestamp);
    this.spellUsable.beginCooldown(SPELLS.SHIELD_OF_THE_RIGHTEOUS.id, event.timestamp);
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.SERAPHIM_TALENT.id) / this.owner.fightDuration;
  }

  statistic() {

    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.SERAPHIM_TALENT.id} />}
        value={`${ formatPercentage(this.uptime) }%`}
        label="Seraphim uptime"
        tooltip={`Resulting in an average stat increase of ${ (SERAPHIM_STAT_BUFF * this.uptime).toFixed(0) } Haste, Critical Strike, Mastery, and Versatility`}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(3);

}

export default Seraphim;
