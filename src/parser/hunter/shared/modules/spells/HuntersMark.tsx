import React from 'react';

import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import { When, ThresholdStyle } from 'parser/core/ParseResults';
import SPELLS from 'common/SPELLS';
import ItemDamageDone from 'interface/ItemDamageDone';
import Enemies from 'parser/shared/modules/Enemies';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';
import { formatPercentage } from 'common/format';
import { encodeTargetString } from 'parser/shared/modules/EnemyInstances';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import UptimeIcon from 'interface/icons/Uptime';
import Events, { ApplyDebuffEvent, CastEvent, DamageEvent, RemoveDebuffEvent } from 'parser/core/Events';
import Abilities from 'parser/core/modules/Abilities';
import { HUNTERS_MARK_MODIFIER, MS_BUFFER } from 'parser/hunter/shared/constants';
import SpellLink from 'common/SpellLink';

/**
 * Apply Hunter's Mark to the target, increasing all damage you deal to the marked target by 5%.
 * The target can always be seen and tracked by the Hunter.
 *
 * Only one Hunter's Mark can be applied at a time.
 *
 * Example log:
 * https://www.warcraftlogs.com/reports/Rn9XxCYLm1q7KFNW#fight=3&type=damage-done&source=15&ability=212680
 */

class HuntersMark extends Analyzer {
  static dependencies = {
    enemies: Enemies,
    abilities: Abilities,
  };

  casts = 0;
  damage = 0;
  recasts = 0;
  refunds = 0;
  debuffRemoved = false;
  timeOfCast = 0;
  precastConfirmed = false;
  markWindow: { [key: string]: { status: string; start: number } } = {};
  damageToTarget: { [key: string]: number } = {};
  enemyID: string = '';

  protected enemies!: Enemies;
  protected abilities!: Abilities;

  constructor(options: any) {
    super(options);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.HUNTERS_MARK), this.onCast);
    this.addEventListener(Events.removedebuff.by(SELECTED_PLAYER).spell(SPELLS.HUNTERS_MARK), this.onDebuffRemoval);
    this.addEventListener(Events.applydebuff.by(SELECTED_PLAYER).spell(SPELLS.HUNTERS_MARK), this.onDebuffApplication);
    this.addEventListener(Events.refreshdebuff.by(SELECTED_PLAYER).spell(SPELLS.HUNTERS_MARK), this.onDebuffRefresh);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER), this.calculateMarkDamage);

    options.abilities.add({
      spell: SPELLS.HUNTERS_MARK,
      category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
      cooldown: 20,
      gcd: {
        base: 1000,
      },
    });
  }

  get uptimePercentage() {
    return this.enemies.getBuffUptime(SPELLS.HUNTERS_MARK.id) / this.owner.fightDuration;
  }

  onCast(event: CastEvent) {
    this.casts += 1;
    this.timeOfCast = event.timestamp;
  }

  onDebuffRemoval(event: RemoveDebuffEvent) {
    if (event.timestamp > this.timeOfCast + MS_BUFFER) {
      this.debuffRemoved = true;
    }
    this.enemyID = encodeTargetString(event.targetID, event.targetInstance);
    if (!this.precastConfirmed) {
      this.precastConfirmed = true;
      this.damage = this.damageToTarget[this.enemyID];
      return;
    }
    if (!this.markWindow[this.enemyID]) {
      return;
    }
    this.markWindow[this.enemyID].status = 'inactive';
  }

  onDebuffApplication(event: ApplyDebuffEvent) {
    if (!this.precastConfirmed) {
      this.precastConfirmed = true;
    }
    if (!this.debuffRemoved) {
      this.recasts += 1;
    }
    this.debuffRemoved = false;
    this.enemyID = encodeTargetString(event.targetID, event.targetInstance);
    if (!this.markWindow[this.enemyID]) {
      this.markWindow[this.enemyID] = {
        status: '',
        start: 0,
      };
    }
    this.markWindow[this.enemyID].status = 'active';
    this.markWindow[this.enemyID].start = event.timestamp;
  }

  onDebuffRefresh() {
    this.recasts += 1;
  }

  calculateMarkDamage(event: DamageEvent) {
    const enemy = this.enemies.getEntity(event);
    if (!enemy) {
      return;
    }
    this.enemyID = encodeTargetString(event.targetID, event.targetInstance);
    if (!this.precastConfirmed) {
      if (!this.damageToTarget[this.enemyID]) {
        this.damageToTarget[this.enemyID] = 0;
      }
      this.damageToTarget[this.enemyID] += calculateEffectiveDamage(event, HUNTERS_MARK_MODIFIER);
    }
    if (!this.markWindow[this.enemyID]) {
      return;
    }
    if (this.markWindow[this.enemyID].status === 'active' && this.markWindow[this.enemyID].start < event.timestamp) {
      this.damage += calculateEffectiveDamage(event, HUNTERS_MARK_MODIFIER);
    }
  }

  get uptimeThresholds() {
    return {
      actual: this.uptimePercentage,
      isLessThan: {
        minor: 0.95,
        average: 0.925,
        major: 0.9,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(6)}
        size="flexible"
        category={STATISTIC_CATEGORY.GENERAL}
        tooltip={(
          <>
            <ul>
              <li>You had a total of {this.casts} casts of Hunter's Mark.</li>
              <li>You cast Hunter's Mark {this.recasts} times, whilst it was active on the target or another target.</li>
            </ul>
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.HUNTERS_MARK}>
          <>
            <ItemDamageDone amount={this.damage} />
            <br />
            <UptimeIcon /> {formatPercentage(this.uptimePercentage)}% <small>uptime</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }

  suggestions(when: When) {
    when(this.uptimeThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <>
          Your uptime on the debuff from <SpellLink id={SPELLS.HUNTERS_MARK.id} /> could be better. You should try and keep <SpellLink id={SPELLS.HUNTERS_MARK.id} /> up on a mob that you're actively hitting as much as possible.
        </>,
      )
        .icon(SPELLS.HUNTERS_MARK.icon)
        .actual(`${formatPercentage(actual)}% uptime`)
        .recommended(`>${formatPercentage(recommended)}% is recommended`);
    });
  }
}

export default HuntersMark;
