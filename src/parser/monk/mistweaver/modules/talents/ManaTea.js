// Modified from Original Code by Blazyb and his Innervate module.
import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatNumber, formatThousands } from 'common/format';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';

import AbilityTracker from 'parser/shared/modules/AbilityTracker';

import Analyzer from 'parser/core/Analyzer';

import { STATISTIC_ORDER } from 'interface/others/StatisticBox';

const debug = false;

const manaTeaReduction = 0.5;

class ManaTea extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
  };

  manaSavedMT = 0;
  manateaCount = 0;

  effCasts = 0;
  enmCasts = 0;
  efCasts = 0;
  lcCasts = 0;
  remCasts = 0;
  revCasts = 0;
  vivCasts = 0;
  rjwCasts = 0;

  nonManaCasts = 0;
  castsUnderManaTea = 0;

  hasLifeCycles = false;
  casted = false;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.MANA_TEA_TALENT.id);
    if (this.selectedCombatant.hasTalent(SPELLS.LIFECYCLES_TALENT.id)) {
      this.hasLifeCycles = true;
    }
  }

  on_toPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    if (SPELLS.MANA_TEA_TALENT.id === spellId) {
      this.manateaCount += 1;
      debug && console.log(`Mana Tea Cast +1. Total:${this.manateaCount}`);
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;

    if (this.selectedCombatant.hasBuff(SPELLS.MANA_TEA_TALENT.id)) {
      if (SPELLS.ENVELOPING_MIST.id === spellId) {
        this.addToManaSaved(SPELLS.ENVELOPING_MIST.manaCost, spellId);
        this.castsUnderManaTea += 1;
        this.enmCasts += 1;
        this.casted = true;
      }
      if (SPELLS.ESSENCE_FONT.id === spellId) {
        this.addToManaSaved(SPELLS.ESSENCE_FONT.manaCost, spellId);
        this.castsUnderManaTea += 1;
        this.efCasts += 1;
        this.casted = true;
      }
      if (SPELLS.LIFE_COCOON.id === spellId) {
        this.addToManaSaved(SPELLS.LIFE_COCOON.manaCost, spellId);
        this.castsUnderManaTea += 1;
        this.lcCasts += 1;
        this.casted = true;
      }
      if (SPELLS.RENEWING_MIST.id === spellId) {
        this.addToManaSaved(SPELLS.RENEWING_MIST.manaCost, spellId);
        this.castsUnderManaTea += 1;
        this.remCasts += 1;
        this.casted = true;
      }
      if (SPELLS.REVIVAL.id === spellId) {
        this.addToManaSaved(SPELLS.REVIVAL.manaCost, spellId);
        this.castsUnderManaTea += 1;
        this.revCasts += 1;
        this.casted = true;
      }
      if (SPELLS.VIVIFY.id === spellId) {
        this.addToManaSaved(SPELLS.VIVIFY.manaCost, spellId);
        this.castsUnderManaTea += 1;
        this.vivCasts += 1;
        this.casted = true;
      }
      if (SPELLS.REFRESHING_JADE_WIND_TALENT.id === spellId) {
        this.addToManaSaved(SPELLS.REFRESHING_JADE_WIND_TALENT.manaCost, spellId);
        this.castsUnderManaTea += 1;
        this.rjwCasts += 1;
        this.casted = true;
      }
      // Capture any Non Mana casts during Mana Tea
      if (!this.casted) {
        this.nonManaCasts += 1;
        this.casted = false;
      }
    }
  }

  addToManaSaved(spellBaseMana, spellId) {
    // If we cast TFT -> Viv, mana cost of Viv is 0
    if (this.selectedCombatant.hasBuff(SPELLS.THUNDER_FOCUS_TEA.id) && SPELLS.VIVIFY.id === spellId) {
      this.nonManaCasts += 1;
      return;
    }
    // Lifecycles reduces the mana cost of both Vivify and Enveloping Mists.  We must take that into account when calculating mana saved.
    if (this.hasLifeCycles) {
      if (this.selectedCombatant.hasBuff(SPELLS.LIFECYCLES_VIVIFY_BUFF.id) && spellId === SPELLS.VIVIFY.id) {
        this.manaSavedMT += ((spellBaseMana * (1 - (SPELLS.LIFECYCLES_VIVIFY_BUFF.manaPercRed))) * (1 - manaTeaReduction));
        debug && console.log('LC Viv Cast');
      } else if ((this.selectedCombatant.hasBuff(SPELLS.LIFECYCLES_ENVELOPING_MIST_BUFF.id) && spellId === SPELLS.ENVELOPING_MIST.id)) {
        this.manaSavedMT += ((spellBaseMana * (1 - (SPELLS.LIFECYCLES_ENVELOPING_MIST_BUFF.manaPercRed))) * (1 - manaTeaReduction));
      } else {
        this.manaSavedMT += (spellBaseMana * (1 - manaTeaReduction));
      }
    } else {
      this.manaSavedMT += (spellBaseMana * (1 - manaTeaReduction));
    }
  }
  on_fightend() {
    if (debug) {
      console.log(`Mana Tea Casted: ${this.manateaCount}`);
      console.log(`Mana saved: ${this.manaSavedMT}`);
      console.log(`Avg. Mana saved: ${this.manaSavedMT / this.manateaCount}`);
      console.log(`Total Casts under Mana Tea: ${this.castsUnderManaTea}`);
      console.log(`Avg Casts under Mana Tea: ${this.castsUnderManaTea / this.manateaCount}`);
      console.log(`Free spells cast: ${this.nonManaCasts}`);
    }
  }

  get avgMtSaves() {
    const abilityTracker = this.abilityTracker;
    const getAbility = spellId => abilityTracker.getAbility(spellId);

    const manaTea = getAbility(SPELLS.MANA_TEA_TALENT.id);
    const mtCasts = manaTea.casts || 0;

    return this.manaSavedMT / mtCasts || 0;
  }

  get suggestionThresholds() {
    return {
      actual: this.avgMtSaves,
      isLessThan: {
        minor: 13000,
        average: 11000,
        major: 9000,
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <>
          Your mana spent during <SpellLink id={SPELLS.MANA_TEA_TALENT.id} /> can be improved. Always aim to cast your highest mana spells such as <SpellLink id={SPELLS.ESSENCE_FONT.id} /> or <SpellLink id={SPELLS.VIVIFY.id} />.
        </>
      )
        .icon(SPELLS.MANA_TEA_TALENT.icon)
        .actual(`${formatNumber(this.avgMtSaves)} average mana saved per Mana Tea cast`)
        .recommended(`${(recommended / 1000).toFixed(0)}k average mana saved is recommended`);
    });
  }

  statistic() {
    return (
      <TalentStatisticBox
        talent={SPELLS.MANA_TEA_TALENT.id}
        position={STATISTIC_ORDER.CORE(25)}
        value={`${formatNumber(this.avgMtSaves)}`}
        label="Average mana saved"
        tooltip={(
          <>
            During your {this.manateaCount} Mana Teas saved the following mana ({formatThousands(this.manaSavedMT / this.owner.fightDuration * 1000 * 5)} MP5):
            <ul>
              {this.efCasts > 0 && <li>{(this.efCasts)} Essence Font casts</li>}
              {this.efCasts > 0 && <li>{(this.vivCasts)} Vivfy casts</li>}
              {this.efCasts > 0 && <li>{(this.enmCasts)} Enveloping Mists casts</li>}
              <li>{(this.rjwCasts + this.revCasts + this.remCasts + this.lcCasts + this.effCasts)} other spells casted.</li>
              <li>{(this.nonManaCasts)} non-mana casts during Mana Tea</li>
            </ul>
          </>
        )}
      />
    );
  }
}

export default ManaTea;
