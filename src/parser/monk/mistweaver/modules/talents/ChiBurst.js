import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';

import Analyzer from 'parser/core/Analyzer';
import Combatants from 'parser/shared/modules/Combatants';

const debug = false;

class ChiBurst extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  castChiBurst = 0;
  healing = 0;
  targetsChiBurst = 0;
  raidSize = 0;


  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.CHI_BURST_TALENT.id);
    this.raidSize = Object.keys(this.combatants.players).length;
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;

    if (spellId === SPELLS.CHI_BURST_TALENT.id) {
      this.castChiBurst += 1;
    }
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    const targetId = event.targetID;

    if (!this.combatants.players[targetId]) {
      return;
    }

    if (spellId === SPELLS.CHI_BURST_HEAL.id) {
      this.healing += (event.amount || 0) + (event.absorbed || 0);
      this.targetsChiBurst += 1;
    }
  }

  get avgTargetsHitPerCB() {
    return this.targetsChiBurst / this.castChiBurst || 0;
  }

  get suggestionThresholds() {
    return {
      actual: this.avgTargetsHitPerCB,
      isLessThan: {
        minor: this.raidSize * 0.3,
        average: this.raidSize * 0.25,
        major: this.raidSize * 0.2,
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
        return suggest(
          <>
            You are not utilizing your <SpellLink id={SPELLS.CHI_BURST_TALENT.id} /> talent as effectively as you should. You should work on both your positioning and aiming of the spell. Always aim for the highest concentration of players, which is normally melee.
          </>,
        )
          .icon(SPELLS.CHI_BURST_TALENT.icon)
          .actual(`${this.avgTargetsHitPerCB.toFixed(2)} targets hit per Chi Burst cast - ${formatPercentage(this.avgTargetsHitPerCB / this.raidSize)}% of raid hit`)
          .recommended('30% of the raid hit is recommended');
      });
  }

  on_fightend() {
    if (debug) {
      console.log(`ChiBurst Casts: ${this.castChiBurst}`);
      console.log(`Total Chi Burst Healing: ${this.healing}`);
      console.log(`Chi Burst Targets Hit: ${this.targetsChiBurst}`);
    }
  }
}

export default ChiBurst;
