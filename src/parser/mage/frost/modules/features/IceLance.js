import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import Statistic from 'interface/statistics/Statistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import EnemyInstances, { encodeTargetString } from 'parser/shared/modules/EnemyInstances';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import Analyzer from 'parser/core/Analyzer';
import { SHATTER_DEBUFFS } from '../../constants';

const CAST_BUFFER_MS = 100;

class IceLance extends Analyzer {
  static dependencies = {
    enemies: EnemyInstances,
    abilityTracker: AbilityTracker,
  };

  hadFingersProc;
  iceLanceTargetId = 0;
  nonShatteredCasts = 0;

  iceLanceCastTimestamp;
  totalFingersProcs = 0;
  overwrittenFingersProcs = 0;
  expiredFingersProcs = 0;

  constructor(...args) {
    super(...args);
    this.active = this.owner.build === undefined;
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.ICE_LANCE.id) {
      return;
    }
    this.iceLanceCastTimestamp = event.timestamp;
    if (event.targetID) {
      this.iceLanceTargetId = encodeTargetString(event.targetID, event.targetInstance);
    }
    this.hadFingersProc = false;
    if (this.selectedCombatant.hasBuff(SPELLS.FINGERS_OF_FROST.id)) {
      this.hadFingersProc = true;
    }
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    const damageTarget = encodeTargetString(event.targetID, event.targetInstance);
    if (spellId !== SPELLS.ICE_LANCE_DAMAGE.id || this.iceLanceTargetId !== damageTarget) {
      return;
    }
    const enemy = this.enemies.getEntity(event);
    if (enemy && !SHATTER_DEBUFFS.some(effect => enemy.hasBuff(effect, event.timestamp)) && this.hadFingersProc === false) {
      this.nonShatteredCasts += 1;
    }
  }

  on_byPlayer_changebuffstack(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.FINGERS_OF_FROST.id) {
      return;
    }

    // FoF overcaps don't show as a refreshbuff, instead they are a stack lost followed immediately by a gain
    const stackChange = event.stacksGained;
    if (stackChange > 0) {
      this.totalFingersProcs += stackChange;
    } else if (this.iceLanceCastTimestamp && this.iceLanceCastTimestamp + CAST_BUFFER_MS > event.timestamp) {
      // just cast ice lance, so this stack removal probably a proc used
    } else if (event.newStacks === 0) {
      this.expiredFingersProcs += (-stackChange); // stacks zero out, must be expiration
    } else {
      this.overwrittenFingersProcs += (-stackChange); // stacks don't zero, this is an overwrite
    }
  }

  get wastedFingersProcs() {
    return this.expiredFingersProcs + this.overwrittenFingersProcs;
  }

  get usedFingersProcs() {
    return this.totalFingersProcs - this.wastedFingersProcs;
  }

  get fingersUtil() {
    return 1 - (this.wastedFingersProcs / this.totalFingersProcs) || 0;
  }

  get nonShatteredPercent() {
    return (this.nonShatteredCasts / this.abilityTracker.getAbility(SPELLS.ICE_LANCE.id).casts);
  }

  get shatteredPercent() {
    return 1 - (this.nonShatteredCasts / this.abilityTracker.getAbility(SPELLS.ICE_LANCE.id).casts);
  }

  get fingersUtilSuggestionThresholds() {
    return {
      actual: this.fingersUtil,
      isLessThan: {
        minor: 0.95,
        average: 0.85,
        major: 0.70,
      },
      style: 'percentage',
    };
  }

  get nonShatteredSuggestionThresholds() {
    return {
      actual: this.nonShatteredPercent,
      isGreaterThan: {
        minor: 0.05,
        average: 0.15,
        major: 0.25,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.nonShatteredSuggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>You cast <SpellLink id={SPELLS.ICE_LANCE.id} /> {this.nonShatteredCasts} times ({formatPercentage(this.nonShatteredPercent)}%) without <SpellLink id={SPELLS.SHATTER.id} />. Make sure that you are only casting Ice Lance when the target has <SpellLink id={SPELLS.WINTERS_CHILL.id} /> (or other Shatter effects), if you have a <SpellLink id={SPELLS.FINGERS_OF_FROST.id} /> proc, or if you are moving and you cant cast anything else.</>)
          .icon(SPELLS.ICE_LANCE.icon)
          .actual(`${formatPercentage(this.nonShatteredPercent)}% missed`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`);
      });
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(30)}
        size="flexible"
        tooltip={'This is the percentage of Ice Lance casts that were shattered. The only time it is acceptable to cast Ice Lance without Shatter is if you are moving and you cant use anything else.'}
      >
        <BoringSpellValueText spell={SPELLS.ICE_LANCE}>
          {`${formatPercentage(this.shatteredPercent, 0)}%`} <small>Casts shattered</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default IceLance;
