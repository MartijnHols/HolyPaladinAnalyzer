import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

import Analyzer from 'parser/core/Analyzer';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';

/**
 *  Inspired by filler modules in Holy Paladin Analyzer
 */

const COOLDOWN_REDUCTION_MS = 1000;

class BlackoutKick extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    abilityTracker: AbilityTracker,
  };

  IMPORTANT_SPELLS = [
    SPELLS.RISING_SUN_KICK.id,
    SPELLS.FISTS_OF_FURY_CAST.id,
    SPELLS.WHIRLING_DRAGON_PUNCH_TALENT.id,
  ];

  effectiveRisingSunKickReductionMs = 0;
  wastedRisingSunKickReductionMs = 0;
  effectiveFistsOfFuryReductionMs = 0;
  wastedFistsOfFuryReductionMs = 0;

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.BLACKOUT_KICK.id) {
      return;
    }

    this.casts += 1;
    const hasImportantCastsAvailable = this.IMPORTANT_SPELLS.some(spellId => this.spellUsable.isAvailable(spellId));

    if (hasImportantCastsAvailable) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'You cast this Blackout Kick while more important spells were available';
    }

    if (!this.spellUsable.isOnCooldown(SPELLS.RISING_SUN_KICK.id)) {
      this.wastedRisingSunKickReductionMs += COOLDOWN_REDUCTION_MS;
    } else {
      const reductionMs = this.spellUsable.reduceCooldown(SPELLS.RISING_SUN_KICK.id, COOLDOWN_REDUCTION_MS);
      this.effectiveRisingSunKickReductionMs += reductionMs;
      this.wastedRisingSunKickReductionMs += COOLDOWN_REDUCTION_MS - reductionMs;
    }
    if (!this.spellUsable.isOnCooldown(SPELLS.FISTS_OF_FURY_CAST.id)) {
      this.wastedFistsOfFuryReductionMs += COOLDOWN_REDUCTION_MS;
    } else {
      const reductionMs = this.spellUsable.reduceCooldown(SPELLS.FISTS_OF_FURY_CAST.id, COOLDOWN_REDUCTION_MS);
      this.effectiveFistsOfFuryReductionMs += reductionMs;
      this.wastedFistsOfFuryReductionMs += COOLDOWN_REDUCTION_MS - reductionMs;
    }
  }

  get totalWastedReductionPerMinute() {
    return (this.wastedFistsOfFuryReductionMs + this.wastedRisingSunKickReductionMs) / (this.owner.fightDuration) * 60;
  }

  get suggestionThresholds() {
    return {
      actual: this.totalWastedReductionPerMinute,
      isGreaterThan: {
        minor: 0,
        average: 2,
        major: 4,
      },
      style: 'decimal',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest('You are wasting cooldown reduction by casting Blackout Kick while having important casts available')
        .icon(SPELLS.BLACKOUT_KICK.icon)
        .actual(`${this.totalWastedReductionPerMinute.toFixed(2)} wasted cooldown reduction per minute`)
        .recommended(`${recommended} is recommended`);
    });
  }

  statistic() {
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(5)}
        icon={<SpellIcon id={SPELLS.BLACKOUT_KICK.id} />}
        value={(
          <span style={{ fontsize: '75%' }}>
            {(this.effectiveRisingSunKickReductionMs / 1000).toFixed(1)}s{' '}
            <SpellIcon
              id={SPELLS.RISING_SUN_KICK.id}
              style={{
                height: '1.3em',
                marginTop: '-1.em',
              }}
            />
            <br />
            {(this.effectiveFistsOfFuryReductionMs / 1000).toFixed(1)}s{' '}
            <SpellIcon
              id={SPELLS.FISTS_OF_FURY_CAST.id}
              style={{
                height: '1.3em',
                marginTop: '-1.em',
              }}
            />
          </span>
        )}
        label="Cooldown reduction"
      />
    );
  }
}

export default BlackoutKick;
