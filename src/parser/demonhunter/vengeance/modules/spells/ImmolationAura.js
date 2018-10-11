import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';

import SPELLS from 'common/SPELLS/index';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage, formatThousands, formatDuration } from 'common/format';

import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

class ImmolationAura extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
  };
  statistic() {
    const immolationAuraUptime = this.selectedCombatant.getBuffUptime(SPELLS.IMMOLATION_AURA.id);

    const immolationAuraUptimePercentage = immolationAuraUptime / this.owner.fightDuration;

    this.immolationAuraDamage = this.abilityTracker.getAbility(SPELLS.IMMOLATION_AURA_FIRST_STRIKE.id).damageEffective + this.abilityTracker.getAbility(SPELLS.IMMOLATION_AURA_BUFF.id).damageEffective;

    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(4)}
        icon={<SpellIcon id={SPELLS.IMMOLATION_AURA.id} />}
        value={`${formatPercentage(immolationAuraUptimePercentage)}%`}
        label="Immolation Aura uptime"
        tooltip={`The Immolation Aura total damage was ${formatThousands(this.immolationAuraDamage)}.<br/>The Immolation Aura total uptime was ${formatDuration(immolationAuraUptime / 1000)}.`}
      />
    );
  }
}

export default ImmolationAura;
