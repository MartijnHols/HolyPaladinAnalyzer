import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatNumber, formatPercentage } from 'common/format';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';


import { STATISTIC_ORDER } from 'interface/others/StatisticBox';

import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';

const LC_MANA_PER_SECOND_RETURN_MINOR = 80;
const LC_MANA_PER_SECOND_RETURN_AVERAGE = LC_MANA_PER_SECOND_RETURN_MINOR - 15;
const LC_MANA_PER_SECOND_RETURN_MAJOR = LC_MANA_PER_SECOND_RETURN_MINOR - 15;

const debug = false;

class Lifecycles extends Analyzer {
  manaSaved = 0;
  manaSavedViv = 0;
  manaSavedEnm = 0;
  castsRedEnm = 0;
  castsRedViv = 0;
  castsNonRedViv = 0;
  castsNonRedEnm = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.LIFECYCLES_TALENT.id);
    if(!this.active){
      return;
    }
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.VIVIFY), this.vivifyCast);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.ENVELOPING_MIST), this.envelopingMistCast);
  }

  vivifyCast(event){
    if (this.selectedCombatant.hasBuff(SPELLS.LIFECYCLES_VIVIFY_BUFF.id)) {

      // Checking for TFT->Viv and classify as non-reduced Viv
      if (this.selectedCombatant.hasBuff(SPELLS.THUNDER_FOCUS_TEA.id)) {
        this.castsNonRedViv += 1;
        return;
      }
      this.manaSaved += SPELLS.VIVIFY.manaCost * (SPELLS.LIFECYCLES_VIVIFY_BUFF.manaPercRed);
      this.manaSavedViv += SPELLS.VIVIFY.manaCost * (SPELLS.LIFECYCLES_VIVIFY_BUFF.manaPercRed);
      this.castsRedViv += 1;
      debug && console.log('Viv Reduced');
    } else {
      this.castsNonRedViv += 1;
    }
  }

  envelopingMistCast(event){
    // Checking to ensure player has cast Enveloping Mists and has the mana reduction buff
    if (this.selectedCombatant.hasBuff(SPELLS.LIFECYCLES_ENVELOPING_MIST_BUFF.id)) {
      this.manaSaved += SPELLS.ENVELOPING_MIST.manaCost * (SPELLS.LIFECYCLES_ENVELOPING_MIST_BUFF.manaPercRed);
      this.manaSavedEnm += SPELLS.ENVELOPING_MIST.manaCost * (SPELLS.LIFECYCLES_ENVELOPING_MIST_BUFF.manaPercRed);
      this.castsRedEnm += 1;
      debug && console.log('ENM Reduced');
    } else {
      this.castsNonRedEnm += 1;
    }
  }

  get suggestionThresholds() {
    return {
      actual: this.manaSaved,
      isLessThan: {
        minor: LC_MANA_PER_SECOND_RETURN_MINOR * (this.owner.fightDuration / 1000),
        average: LC_MANA_PER_SECOND_RETURN_AVERAGE * (this.owner.fightDuration / 1000),
        major: LC_MANA_PER_SECOND_RETURN_MAJOR * (this.owner.fightDuration / 1000),
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
        return suggest(
          <>
            Your current spell usage is not taking full advantage of the <SpellLink id={SPELLS.LIFECYCLES_TALENT.id} /> talent. You should be trying to alternate the use of these spells as often as possible to take advantage of the buff.
          </>,
        )
          .icon(SPELLS.LIFECYCLES_TALENT.icon)
          .actual(`${formatNumber(actual)} mana saved through Lifecycles`)
          .recommended(`${formatNumber(recommended)} is the recommended amount of mana savings`);
      });
  }

  statistic() {
    return (
      <TalentStatisticBox
        talent={SPELLS.LIFECYCLES_TALENT.id}
        position={STATISTIC_ORDER.OPTIONAL(70)}
        value={`${formatNumber(this.manaSaved)}`}
        label="Mana Saved"
        tooltip={(
          <>
            You saved a total of {this.manaSaved} mana from the Lifecycles talent.
            <ul>
              <li>On {this.castsRedViv} Vivify casts, you saved {(this.manaSavedViv / 1000).toFixed(0)}k mana. ({formatPercentage(this.castsRedViv / (this.castsRedViv + this.castsNonRedViv))}%)</li>
              <li>On {this.castsRedEnm} Enveloping Mists casts, you saved {(this.manaSavedEnm / 1000).toFixed(0)}k mana. ({formatPercentage(this.castsRedEnm / (this.castsRedEnm + this.castsNonRedEnm))}%)</li>
              <li>You casted {this.castsNonRedViv} Vivify's and {this.castsNonRedEnm} Enveloping Mists at full mana.</li>
            </ul>
          </>
        )}
      />
    );
  }

  on_fightend() {
    if (debug) {
      console.log(`Mana Reduced:${this.manaSaved}`);
      console.log(`Viv Mana Reduced:${this.manaSavedViv}`);
      console.log(`EnM Mana Reduced:${this.manaSavedEnm}`);
    }
  }
}

export default Lifecycles;
