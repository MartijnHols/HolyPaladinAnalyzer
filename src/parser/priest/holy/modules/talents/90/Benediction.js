import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import TalentStatisticBox, { STATISTIC_ORDER } from 'interface/others/TalentStatisticBox';
import React from 'react';
import ItemHealingDone from 'interface/ItemHealingDone';
import Renew from 'parser/priest/holy/modules/spells/Renew';

// Example Log: /report/PNYB4zgrnR86h7Lc/6-Normal+Zek'voz,+Herald+of+N'zoth/Khadaj
class Benediction extends Analyzer {
  static dependencies = {
    renew: Renew,
  };

  get renewsFromBenediction() {
    return this.renew.renewsFromBenediction;
  }

  get healingFromBenedictionRenews() {
    const healing = this.renew.healingFromRenew(this.renew.renewsFromBenediction);
    return healing;
  }

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.BENEDICTION_TALENT.id);
  }

  statistic() {
    return (
      <TalentStatisticBox
        talent={SPELLS.BENEDICTION_TALENT.id}
        value={<ItemHealingDone amount={this.healingFromBenedictionRenews} />}
        tooltip={`${this.renewsFromBenediction} total Renews from Benediction`}
        position={STATISTIC_ORDER.CORE(6)}
      />
    );
  }
}

export default Benediction;
