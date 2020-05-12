import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

import Analyzer from 'parser/core/Analyzer';
import Enemies from 'parser/shared/modules/Enemies';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import { encodeTargetString } from 'parser/shared/modules/EnemyInstances';

class ScourgeStrikeEfficiency extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };
  constructor(...args) {
    super(...args);
    this.active = !this.selectedCombatant.hasTalent(SPELLS.CLAWING_SHADOWS_TALENT.id);
  }
  // used to track how many stacks a target has
  targets = {};

  totalScourgeStrikeCasts = 0;
  scourgeStrikeCastsZeroWounds = 0;

  on_byPlayer_applydebuffstack(event){
    const spellId = event.ability.guid;
    if(spellId === SPELLS.FESTERING_WOUND.id){
		this.targets[encodeTargetString(event.targetID, event.targetInstance)] = event.stack;
	}
  }

  on_byPlayer_removedebuffstack(event){
    const spellId = event.ability.guid;
    if(spellId === SPELLS.FESTERING_WOUND.id){
		this.targets[encodeTargetString(event.targetID, event.targetInstance)] = event.stack;
    }
  }

  on_byPlayer_removedebuff(event){
    const spellId = event.ability.guid;
    if(spellId === SPELLS.FESTERING_WOUND.id){
		this.targets[encodeTargetString(event.targetID, event.targetInstance)] = 0;
	}
  }

  on_byPlayer_cast(event){
    const spellId = event.ability.guid;
    if(spellId === SPELLS.SCOURGE_STRIKE.id){
		this.totalScourgeStrikeCasts += 1;
		if(this.targets.hasOwnProperty(encodeTargetString(event.targetID, event.targetInstance))) {
			const currentTargetWounds = this.targets[encodeTargetString(event.targetID, event.targetInstance)];
			if(currentTargetWounds < 1){
				this.scourgeStrikeCastsZeroWounds += 1;
			}
		} else {
			this.scourgeStrikeCastsZeroWounds += 1;
		}
	}
  }

  suggestions(when) {
    const percentCastZeroWounds = this.scourgeStrikeCastsZeroWounds/this.totalScourgeStrikeCasts;
    const strikeEfficiency = 1 - percentCastZeroWounds;
    when(strikeEfficiency).isLessThan(0.90)
        .addSuggestion((suggest, actual, recommended) => {
          return suggest(<span>You are casting <SpellLink id={SPELLS.SCOURGE_STRIKE.id} /> too often.  When spending runes remember to cast <SpellLink id={SPELLS.FESTERING_STRIKE.id} /> instead on targets with no stacks of <SpellLink id={SPELLS.FESTERING_WOUND.id} /></span>)
            .icon(SPELLS.SCOURGE_STRIKE.icon)
            .actual(`${formatPercentage(actual)}% of Scourge Strikes were used with Wounds on the target`)
            .recommended(`>${formatPercentage(recommended)}% is recommended`)
            .regular(recommended - 0.10).major(recommended - 0.20);
        });
  }

  statistic() {
    const percentCastZeroWounds = this.scourgeStrikeCastsZeroWounds/this.totalScourgeStrikeCasts;
    const strikeEfficiency = 1 - percentCastZeroWounds;
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.SCOURGE_STRIKE.id} />}
        value={`${formatPercentage(strikeEfficiency)} %`}
        label="Scourge Strike Efficiency"
        tooltip={`${this.scourgeStrikeCastsZeroWounds} out of ${this.totalScourgeStrikeCasts} Scourge Strikes were used with no Festering Wounds on the target.`}
      />
    );
  }

  statisticOrder = STATISTIC_ORDER.CORE(3);
}

export default ScourgeStrikeEfficiency;
