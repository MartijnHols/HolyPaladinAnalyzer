import React from 'react';

import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import { formatPercentage } from 'common/format';

import Analyzer from 'parser/core/Analyzer';
import calculateEffectiveHealing from 'parser/core/calculateEffectiveHealing';
import StatisticListBoxItem from 'interface/others/StatisticListBoxItem';
import { HealEvent } from 'parser/core/Events';

const UNDULATION_HEALING_INCREASE = 0.5;
const BUFFER_MS = 300;

class Undulation extends Analyzer {
  healing = 0;

  constructor(options : any) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(SPELLS.UNDULATION_TALENT.id);
  }

  on_byPlayer_heal(event : HealEvent) {
    const spellId = event.ability.guid;

    if (spellId === SPELLS.HEALING_WAVE.id || spellId === SPELLS.HEALING_SURGE_RESTORATION.id) {
      const hasUndulation = this.selectedCombatant.hasBuff(SPELLS.UNDULATION_BUFF.id, event.timestamp, BUFFER_MS, BUFFER_MS);

      if (hasUndulation) {
        this.healing += calculateEffectiveHealing(event, UNDULATION_HEALING_INCREASE);
      }
    }
  }

  subStatistic() {
    return (
      <StatisticListBoxItem
        title={<SpellLink id={SPELLS.UNDULATION_TALENT.id} />}
        value={`${formatPercentage(this.owner.getPercentageOfTotalHealingDone(this.healing))} %`}
      />
    );
  }

}

export default Undulation;
