import React from 'react';

import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';

import Analyzer from 'Parser/Core/Analyzer';

import CooldownThroughputTracker from '../Features/CooldownThroughputTracker';

class Wellspring extends Analyzer {
  static dependencies = {
    cooldownThroughputTracker: CooldownThroughputTracker,
  };
  healing = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.WELLSPRING_TALENT.id);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;

    if (spellId !== SPELLS.WELLSPRING_HEAL.id) {
      return;
    }

    this.healing += event.amount + (event.absorbed || 0);
  }

  subStatistic() {
    const feeding = this.cooldownThroughputTracker.getIndirectHealing(SPELLS.WELLSPRING_HEAL.id);
    return (
      <div className="flex">
        <div className="flex-main">
          <SpellLink id={SPELLS.WELLSPRING_TALENT.id} />
        </div>
        <div className="flex-sub text-right">
          {formatPercentage(this.owner.getPercentageOfTotalHealingDone(this.healing + feeding))} %
        </div>
      </div>
    );
  }

}

export default Wellspring;

