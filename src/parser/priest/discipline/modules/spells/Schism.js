import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatNumber, formatPercentage } from 'common/format';
import DualStatisticBox, { STATISTIC_ORDER } from 'interface/others/DualStatisticBox';
import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';
import Enemies from 'parser/shared/modules/Enemies';
import calculateEffectiveHealing from 'parser/core/calculateEffectiveHealing';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';

import isAtonement from '../core/isAtonement';
import Penance from './Penance';
import AtonementDamageSource from '../features/AtonementDamageSource';
import { calculateOverhealing, SmiteEstimation } from '../../SpellCalculations';
import Atonement from './Atonement';
import SinsOfTheMany from './SinsOfTheMany';

class Schism extends Analyzer {
  static dependencies = {
    enemies: Enemies,
    statTracker: StatTracker,
    atonementDamageSource: AtonementDamageSource,
    penance: Penance,
    atonement: Atonement,
    sins: SinsOfTheMany,
  };

  // Spell metadata
  static bonus = 0.4;
  static duration = 9000;
  static synergisticAbilities = [
    SPELLS.HALO_TALENT.id,
    SPELLS.POWER_WORD_SOLACE_TALENT.id,
    SPELLS.PENANCE.id,
  ];

  // Privates
  _lastSchismCast = 0;
  _badSchisms = {};

  // Schism data
  directDamage = 0;
  damageFromBuff = 0;
  healing = 0;
  target = null;

  // Estimations
  smiteEstimation;

  // Methods
  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(
      SPELLS.SCHISM_TALENT.id
    );

    this.smiteEstimation = SmiteEstimation(this.statTracker, this.sins);
  }

  get buffActive() {
    return this.target && this.target.hasBuff(SPELLS.SCHISM_TALENT.id);
  }

  get badSchismCount() {
    return Object.entries(this._badSchisms).reduce(
      (n, [e, isBadSchism]) => n + (isBadSchism ? 1 : 0),
      0
    );
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;

    // Handle non-schism events
    if (spellId !== SPELLS.SCHISM_TALENT.id) {
      this.handleSynergy(event);
      this.processSchismBuffDamage(event);
      return;
    }

    // Set the target for schism
    this.target = this.enemies.getEntity(event);

    // Set the last time schism was cast
    this._lastSchismCast = event;

    // Assume every schism is bad
    this._badSchisms[event] = true;

    // Calculate direct schism damage
    const { smiteDamage } = this.smiteEstimation();

    // Substract smite damage (because that is what we would be casting if we didn't pick Schism)
    this.directDamage += (event.amount + event.absorbed || 0) - smiteDamage;
  }

  on_byPlayer_heal(event) {
    if (!isAtonement(event)) {
      return;
    }
    const atonenementDamageEvent = this.atonementDamageSource.event;
    if (!atonenementDamageEvent) {
      this.error('Atonement damage event unknown for Atonement heal:', event);
      return;
    }

    // Schism doesn't buff itself, but we need to handle this for better estimations
    if (atonenementDamageEvent.ability.guid === SPELLS.SCHISM_TALENT.id) {
      this.processSchismAtonement(event);
      return;
    }

    // If the Schism debuff isn't active, or the damage isn't our target we don't process it
    if (
      !this.buffActive ||
      atonenementDamageEvent.targetID !== this.target.id
    ) {
      return;
    }

    // Schism doesn't buff pet damage - yet
    if (this.owner.byPlayerPet(this.atonementDamageSource.event)) {
      return;
    }

    this.healing += calculateEffectiveHealing(event, Schism.bonus);
  }

  // Flags a Schism as being bad due to lack of synergistic abilities used
  handleSynergy(event) {
    if (!this._lastSchismCast) return;
    if (!Schism.synergisticAbilities.includes(event.ability.guid)) return;

    // Return early if the ability isn't cast during Schism
    if (this._lastSchismCast.timestamp + Schism.duration <= event.timestamp) {
      return;
    }

    this._badSchisms[this._lastSchismCast] = false;
  }

  // The Atonement from Schism's direct damage component
  processSchismAtonement(event) {
    const { smiteHealing } = this.smiteEstimation();
    const estimatedSmiteRawHealing = smiteHealing * event.hitType;

    const estimatedOverhealing = calculateOverhealing(
      estimatedSmiteRawHealing,
      event.amount,
      event.overheal
    );

    const estimatedSmiteHealing =
      estimatedSmiteRawHealing - estimatedOverhealing;

    this.healing += event.amount - estimatedSmiteHealing;
  }

  // The damage from the Schism buff
  processSchismBuffDamage(event) {
    if (!this.buffActive || event.targetID !== this.target.id) {
      return;
    }

    this.damageFromBuff += calculateEffectiveDamage(event, Schism.bonus);
  }

  statistic() {
    return (
      <DualStatisticBox
        icon={<SpellIcon id={SPELLS.SCHISM_TALENT.id} />}
        values={[
          `${formatNumber((this.healing / this.owner.fightDuration) * 1000)} HPS`,
          `${formatNumber(((this.directDamage + this.damageFromBuff) / this.owner.fightDuration) * 1000)} DPS`,
        ]}
        footer={(
          <>
            <SpellLink id={SPELLS.SCHISM_TALENT.id} /> throughput
          </>
        )}
        tooltip={(
          <>
            The effective healing contributed by Schism was {formatPercentage(this.owner.getPercentageOfTotalHealingDone(this.healing))}% of total healing done.<br />
            The direct damage contributed by the Schism talent was {formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.directDamage))}% of total damage done.<br />
            The effective damage contributed by the Schism bonus was {formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.damageFromBuff))}% of total damage done. <br />
          </>
        )}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.OPTIONAL();

  get badSchismThresholds() {
    return {
      actual: this.badSchismCount,
      isGreaterThan: {
        minor: 0,
        average: 1,
        major: 3,
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.badSchismThresholds).addSuggestion(
      (suggest, actual, recommended) => {
        return suggest(
          <>
            Don't cast <SpellLink id={SPELLS.SCHISM_TALENT.id} /> without also
            casting <SpellLink id={SPELLS.PENANCE.id} />,{' '}
            <SpellLink id={SPELLS.HALO_TALENT.id} />, or{' '}
            <SpellLink id={SPELLS.POWER_WORD_SOLACE_TALENT.id} />{' '}
          </>
        )
          .icon(SPELLS.SCHISM_TALENT.icon)
          .actual(`You cast Schism ${actual} times without pairing it with strong damaging abilities, such as Penance, Halo, or Power Word: Solace.`)
          .recommended(`${recommended} is recommended`);
      }
    );
  }
}

export default Schism;
