import React from 'react';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';

import Analyzer from 'parser/core/Analyzer';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';

const DAMAGE_BOOST = .10;
const DURATION_BOOST_MS = 500;
const debug = false;

/**
 *Each Rune spent during Remorseless Winter increases its damage by 10%, and extends its duration by 0.5 sec.
 */
class GatheringStorm extends Analyzer {
  totalCasts = 0;
  bonusDamage = 0;
  totalStacks = 0;
  currentStacks = 0;
  extendedDuration = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.GATHERING_STORM_TALENT.id);
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.GATHERING_STORM_TALENT_BUFF.id) {
      return;
    }
    this.currentStacks = 1;
    this.totalCasts++;
    this.totalStacks++;
    debug && console.log('applied buff');
  }

  on_byPlayer_applybuffstack(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.GATHERING_STORM_TALENT_BUFF.id) {
      return;
    }
    this.currentStacks++;
    this.totalStacks++;
    debug && console.log(`added buff stack, now at ${this.currentStacks}`);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.REMORSELESS_WINTER_DAMAGE.id) {
      return;
    }
    const boostedDamage = calculateEffectiveDamage(event, (DAMAGE_BOOST * this.currentStacks));
    this.bonusDamage += boostedDamage;
    debug && console.log(`boosted damage with ${this.currentStacks} stacks = ${boostedDamage}`);
  }

  on_byPlayer_removebuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.GATHERING_STORM_TALENT_BUFF.id) {
      return;
    }
    this.currentStacks = 0;
    debug && console.log(`removed buff`);
  }

  on_byPlayer_cast(event) {
    if (!this.selectedCombatant.hasBuff(SPELLS.REMORSELESS_WINTER.id)) {
      return;
    }
    if (event.ability.guid === SPELLS.HOWLING_BLAST.id && this.selectedCombatant.hasBuff(SPELLS.RIME.id)) { // handles the free HB from Rime proc,
      this.extendedDuration += DURATION_BOOST_MS;
      return;
    }
    if (event.classResources) {
      event.classResources
        .filter(resource => resource.type === RESOURCE_TYPES.RUNES.id)
        .forEach(({ cost }) => {
          this.extendedDuration = this.extendedDuration + (DURATION_BOOST_MS * cost);
          debug && console.log(`Added ${(DURATION_BOOST_MS * cost)} to the duration for a total of ${this.extendedDuration} boost to duration`);
        });
    }
  }

  get averageExtension() {
    return this.extendedDuration / 1000 / this.totalCasts;
  }

  statistic() {
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(50)}
        icon={<SpellIcon id={SPELLS.GATHERING_STORM_TALENT.id} />}
        value={`${this.averageExtension.toFixed(1)}`}
        label="Average seconds added to each Remorseless Winter"
        tooltip={(
          <>
            Bonus damage from Gathering Storm: {this.owner.formatItemDamageDone(this.bonusDamage)}
          </>
        )}
      />
    );
  }
}

export default GatheringStorm;
