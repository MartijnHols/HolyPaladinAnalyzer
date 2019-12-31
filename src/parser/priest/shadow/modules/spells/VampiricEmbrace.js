import React from 'react';

import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import ItemHealingDone from 'interface/ItemHealingDone';
import DamageTracker from 'parser/shared/modules/AbilityTracker';
import { formatNumber } from 'common/format';

// Example log: /report/TzhG7rkfJAWP8MQp/32-Mythic+G'huun+-+Wipe+11+(8:21)/16-Constiince/changelog
class VampiricEmbrace extends Analyzer {
  static dependencies = {
    abilityTracker: DamageTracker,
  };

  get casts() {
    return this.abilityTracker.getAbility(SPELLS.VAMPIRIC_EMBRACE.id).casts;
  }

  get healingDone() {
    return this.abilityTracker.getAbility(SPELLS.VAMPIRIC_EMBRACE_HEAL.id).healingEffective || 0;
  }

  statistic() {
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(3)}
        icon={<SpellIcon id={SPELLS.VAMPIRIC_EMBRACE.id} />}
        value={<ItemHealingDone amount={this.healingDone} />}
        label="Vampiric Embrace healing"
        tooltip={`${formatNumber(this.healingDone)} healing done in ${this.casts || 0} cast(s).`}
      />
    );
  }
}

export default VampiricEmbrace;
