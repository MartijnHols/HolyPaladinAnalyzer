import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

import Analyzer from 'parser/core/Analyzer';
import { formatPercentage } from 'common/format';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import { BeginCastEvent, CastEvent } from 'parser/core/Events';
import { When } from 'parser/core/ParseResults';

class HealingWave extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    spellUsable: SpellUsable,
  };

  protected abilityTracker!: AbilityTracker;
  protected spellUsable!: SpellUsable;

  _isCurrentCastInefficient = false;
  on_byPlayer_begincast(event: BeginCastEvent) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.HEALING_WAVE.id) {
      return;
    }
    if (this._isInefficientCastEvent(event)) {
      this._isCurrentCastInefficient = true;
    } else {
      this._isCurrentCastInefficient = false;
    }
  }

  _isInefficientCastEvent(event: BeginCastEvent) {
    const hasTidalWave = this.selectedCombatant.hasBuff(SPELLS.TIDAL_WAVES_BUFF.id, event.timestamp, -1);
    const hasFlashFlood = this.selectedCombatant.hasBuff(SPELLS.FLASH_FLOOD_BUFF.id, event.timestamp, -1);
    if (hasTidalWave || hasFlashFlood) {
      return false;
    }

    const hasRiptideAvailable = this.spellUsable.isAvailable(SPELLS.RIPTIDE.id);
    if (!hasRiptideAvailable) {
      return false;
    }
    return true;
  }

  /**
   * This marks spells as inefficient casts in the timeline.
   * @param event
   */
  on_byPlayer_cast(event: CastEvent) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.HEALING_WAVE.id) {
      return;
    }
    if (this._isCurrentCastInefficient) {
      event.meta = event.meta || {};
      event.meta.isInefficientCast = true;
      event.meta.inefficientCastReason = 'Riptide was off cooldown when you started casting this unbuffed Healing Wave. Casting Riptide into Healing Wave to generate and use a Tidal Wave stack, or using a Flash Flood buff (if talented) is a lot more efficient compared to casting a full-length Healing Wave.';
    }
  }

  get suggestedThreshold() {
    const healingWave = this.abilityTracker.getAbility(SPELLS.HEALING_WAVE.id);

    const twHealingWaves = healingWave.healingTwHits || 0;
    const healingWaveCasts = healingWave.casts || 0;
    const unbuffedHealingWaves = healingWaveCasts - twHealingWaves;
    const unbuffedHealingWavesPerc = unbuffedHealingWaves / healingWaveCasts;

    return {
      actual: unbuffedHealingWavesPerc,
      isGreaterThan: {
        minor: 0.20,
        average: 0.40,
        major: 0.60,
      },
      style: 'percentage',
    };
  }

  suggestions(when: When) {
    const suggestedThreshold = this.suggestedThreshold;
    when(suggestedThreshold.actual).isGreaterThan(suggestedThreshold.isGreaterThan.minor)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Casting <SpellLink id={SPELLS.HEALING_WAVE.id} /> without <SpellLink id={SPELLS.TIDAL_WAVES_BUFF.id} icon /> is slow and generally inefficient. Consider casting a riptide first to generate <SpellLink id={SPELLS.TIDAL_WAVES_BUFF.id} icon /></span>)
          .icon(SPELLS.HEALING_WAVE.icon)
          .actual(`${formatPercentage(suggestedThreshold.actual)}% of unbuffed Healing Waves`)
          .recommended(`${formatPercentage(suggestedThreshold.isGreaterThan.minor)}% of unbuffed Healing Waves`)
          .regular(suggestedThreshold.isGreaterThan.average).major(suggestedThreshold.isGreaterThan.major);
      });
  }
}

export default HealingWave;
