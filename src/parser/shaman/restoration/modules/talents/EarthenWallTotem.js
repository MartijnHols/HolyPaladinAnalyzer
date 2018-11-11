import React from 'react';

import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import { formatNumber, formatPercentage } from 'common/format';

import Analyzer from 'parser/core/Analyzer';

import AbilityTracker from 'parser/shared/modules/AbilityTracker';

import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import StatisticListBoxItem from 'interface/others/StatisticListBoxItem';

class EarthenWallTotem extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
  };

  prePullCast = true;
  prePullCastHealth = 0; // Used to be boolean, but i need the number in case the player is Mag'har Orc
  potentialHealing = 0;
  healing = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.EARTHEN_WALL_TOTEM_TALENT.id);
  }

  on_toPlayerPet_damage(event) {
    const spellId = event.ability.guid;

    if (spellId !== SPELLS.EARTHEN_WALL_TOTEM_SELF_DAMAGE.id) {
      return;
    }

    if (this.prePullCast) {
      this.potentialHealing += event.maxHitPoints; // this is taking the totems max HP, which is the same result as the players unless Mag'har Orc
      this.prePullCast = false;
      this.prePullCastHealth = event.maxHitPoints;
    }

    this.healing += (event.amount || 0);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;

    if (spellId !== SPELLS.EARTHEN_WALL_TOTEM_TALENT.id) {
      return;
    }

    if (this.prePullCast) {
      this.prePullCast = false;
    }

    this.potentialHealing += event.maxHitPoints; 
  }

  get earthenShieldEfficiency() {
    return this.healing / this.potentialHealing;
  }

  // If Mag'har Orc, +10% totem health (FeelsBadMan, no player race data)
  on_finished() {
    if (this.abilityTracker.getAbility(SPELLS.ANCESTRAL_CALL.id).casts || 0) {
      // if this.prePullCastHealth has a value, it already got increased by 10% because it takes the totems health instead of the players
      if (this.prePullCastHealth > 0) {
        this.potentialHealing = (this.potentialHealing - this.prePullCastHealth) * 1.1 + this.prePullCastHealth;
      } else {
        this.potentialHealing *= 1.1;
      }
    }
  }

  suggestions(when) {
    when(this.earthenShieldEfficiency).isLessThan(0.75)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Try to cast <SpellLink id={SPELLS.EARTHEN_WALL_TOTEM_TALENT.id} /> at times - and positions where there will be as many people taking damage possible inside of it to maximize the amount it absorbs.</span>)
          .icon(SPELLS.EARTHEN_WALL_TOTEM_TALENT.icon)
          .actual(`${this.earthenShieldEfficiency.toFixed(2)}%`)
          .recommended(`${recommended}%`)
          .regular(recommended - .15).major(recommended - .3);
      });
  }

  statistic() {
    const casts = this.abilityTracker.getAbility(SPELLS.EARTHEN_WALL_TOTEM_TALENT.id).casts + (this.prePullCastHealth > 0 ? 1 : 0);

    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.EARTHEN_WALL_TOTEM_TALENT.id} />}
        value={`${formatPercentage(this.earthenShieldEfficiency)} %`}
        category={STATISTIC_CATEGORY.TALENTS}
        position={STATISTIC_ORDER.OPTIONAL(60)}
        label={(
          <dfn data-tip={`The percentage of the potential absorb of Earthen Wall Totem that was actually used. You cast a total of ${casts} Earthen Wall Totems with a combined health of ${formatNumber(this.potentialHealing)}, which absorbed a total of ${formatNumber(this.healing)} damage.`}>
            Earthen Wall Totem efficiency
          </dfn>
        )}
      />
    );
  }

  subStatistic() {
    return (
      <StatisticListBoxItem
        title={<SpellLink id={SPELLS.EARTHEN_WALL_TOTEM_TALENT.id} />}
        value={`${formatPercentage(this.owner.getPercentageOfTotalHealingDone(this.healing))} %`}
      />
    );
  }
}

export default EarthenWallTotem;

