import React from 'react';

import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';
import Events, { DamageEvent } from 'parser/core/Events';

import SPELLS from 'common/SPELLS';
import { formatThousands, formatNumber, formatPercentage } from 'common/format';
import SpellLink from 'common/SpellLink';

import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';

const AC_DAMAGE_BONUS = 0.15;

class AbsoluteCorruption extends Analyzer {
  bonusDmg = 0;

  constructor(options: any) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(SPELLS.ABSOLUTE_CORRUPTION_TALENT.id);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.CORRUPTION_DEBUFF), this.onCorruptionDamage);
  }

  onCorruptionDamage(event: DamageEvent) {
    this.bonusDmg += calculateEffectiveDamage(event, AC_DAMAGE_BONUS);
  }

  get dps() {
    return this.bonusDmg / this.owner.fightDuration * 1000;
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(2)}
        size="small"
        tooltip={(
          <>
            {formatThousands(this.bonusDmg)} bonus damage<br /><br />

            Note: This only accounts for the passive 15% increased damage of Corruption. Actual bonus damage should be higher due to saved GCDs.
          </>
        )}
      >
        <div className="pad">
          <label><SpellLink id={SPELLS.ABSOLUTE_CORRUPTION_TALENT.id} /> bonus damage</label>
          <div className="value">
            {formatNumber(this.dps)} DPS <small>{formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.bonusDmg))} % of total</small>
          </div>
        </div>
      </Statistic>
    );
  }
}

export default AbsoluteCorruption;
