import React from 'react';
import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import TraitStatisticBox, { STATISTIC_ORDER } from 'interface/others/TraitStatisticBox';
import { calculateAzeriteEffects } from 'common/stats';
import { formatNumber, formatThousands } from 'common/format';
import HolyWordSanctify from 'parser/priest/holy/modules/spells/holyword/HolyWordSanctify';
import ItemHealingDone from 'interface/others/ItemHealingDone';

// Example Log: https://www.warcraftlogs.com/reports/7rLHkgCBhJZ3t1KX#fight=6&type=healing
class WordOfMending extends Analyzer {
  static dependencies = {
    sanctify: HolyWordSanctify,
  };

  totalWoM = 0;
  healingBonus = 0;
  totalAdditionalHealing = 0;
  totalAdditionalOverHealing = 0;
  totalCooldownReduction = 0;
  totalCooldownReductionWasted = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.WORD_OF_MENDING.id);
    this.ranks = this.selectedCombatant.traitRanks(SPELLS.WORD_OF_MENDING.id) || [];

    this.healingBonus = this.ranks.map((rank) => calculateAzeriteEffects(SPELLS.WORD_OF_MENDING.id, rank)[0]).reduce((total, bonus) => total + bonus, 0);
    this.totalWoM = this.ranks.length;
  }

  get effectiveHealing() {
    return this.totalAdditionalHealing + this.totalAdditionalOverHealing;
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.PRAYER_OF_MENDING_HEAL.id) {
      let eventHealing = this.healingBonus;
      let eventOverhealing = 0;

      if (event.overheal) {
        eventOverhealing = Math.min(this.healingBonus, event.overheal);
        eventHealing -= eventOverhealing;
      }

      this.totalAdditionalHealing += eventHealing;
      this.totalAdditionalOverHealing += eventOverhealing;
    }
  }

  statistic() {
    return (
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.WORD_OF_MENDING.id}
        value={(
<>
          <ItemHealingDone amount={this.totalAdditionalHealing} /><br />
          {formatNumber(this.sanctify.baseHolyWordReductionBySpell[SPELLS.PRAYER_OF_MENDING_CAST.id] / 1000)}s Sanctify Cooldown
        </>
)}
        tooltip={`${formatThousands(this.totalAdditionalHealing)} Total Healing`}
      />
    );
  }
}

export default WordOfMending;
