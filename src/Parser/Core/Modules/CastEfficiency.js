import React from 'react';

import SpellLink from 'common/SpellLink';
import Wrapper from 'common/Wrapper';
import { formatPercentage } from 'common/format';

import Analyzer from 'Parser/Core/Analyzer';
import SpellHistory from 'Parser/Core/Modules/SpellHistory';

import Tab from 'Main/Tab';
import CastEfficiencyComponent from 'Main/CastEfficiency';
import SpellTimeline from 'Main/Timeline/SpellTimeline';

import Abilities from './Abilities';
import AbilityTracker from './AbilityTracker';
import Combatants from './Combatants';
import Haste from './Haste';

const DEFAULT_RECOMMENDED = 0.80;
const DEFAULT_AVERAGE_DOWNSTEP = 0.05;
const DEFAULT_MAJOR_DOWNSTEP = 0.15;

class CastEfficiency extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    combatants: Combatants,
    haste: Haste,
    spellHistory: SpellHistory,
    abilities: Abilities,
  };

  /*
   * Gets info about spell's cooldown behavior. All values are as of the current timestamp.
   * completedRechargeTime is the total ms of completed cooldowns
   * endingRechargeTime is the total ms into current cooldown
   * recharges is the total number of times the spell has recharged (either come off cooldown or gained a charge)
   * Only works on spells entered into CastEfficiency list.
   */
  _getCooldownInfo(ability) {
    const mainSpellId = (ability.spell instanceof Array) ? ability.spell[0].id : ability.spell.id;
    const history = this.spellHistory.historyBySpellId[mainSpellId];
    if (!history) { // spell either never been cast, or not in abilities list
      return {
        completedRechargeTime: 0,
        endingRechargeTime: 0,
        recharges: 0,
        casts: 0,
      };
    }

    let lastRechargeTimestamp = null;
    let recharges = 0;
    const completedRechargeTime = history
      .filter(event => event.type === 'updatespellusable')
      .reduce((acc, event) => {
        if (event.trigger === 'begincooldown') {
          lastRechargeTimestamp = event.timestamp;
          return acc;
        } else if (event.trigger === 'endcooldown') {
          const rechargingTime = (event.timestamp - lastRechargeTimestamp) || 0;
          recharges += 1;
          lastRechargeTimestamp = null;
          return acc + rechargingTime;
          // This might cause oddness if we add anything that externally refreshes charges, but so far nothing does
        } else if (event.trigger === 'restorecharge') {
          const rechargingTime = (event.timestamp - lastRechargeTimestamp) || 0;
          recharges += 1;
          lastRechargeTimestamp = event.timestamp;
          return acc + rechargingTime;
        } else {
          return acc;
        }
      }, 0);
    const endingRechargeTime = (!lastRechargeTimestamp) ? 0 : this.owner.currentTimestamp - lastRechargeTimestamp;

    const casts = history.filter(event => event.type === 'cast').length;

    return {
      completedRechargeTime,
      endingRechargeTime,
      recharges,
      casts,
    };
  }

  /*
   * Packs cast efficiency results for use by suggestions / tab
   */
  getCastEfficiency() {
    return this.abilities.constructor.ABILITIES
      .filter(ability => !ability.isActive || ability.isActive(this.combatants.selected))
      .map(ability => this.getCastEfficiencyForAbility(ability))
      .filter(item => item !== null); // getCastEfficiencyForAbility can return null, remove those from the result
  }
  _findAbility(spellId) {
    const abilityInfo = this.abilities.constructor.ABILITIES;

    return abilityInfo
      .filter(ability => !ability.isActive || ability.isActive(this.combatants.selected))
      .find(ability => ability.spell.id === spellId);
  }
  getCastEfficiencyForSpellId(spellId) {
    const ability = this._findAbility(spellId);
    return this.getCastEfficiency(ability);
  }
  getCastEfficiencyForAbility(ability) {
    const spellId = ability.spell.id;
    const fightDurationMs = this.owner.fightDuration;
    const fightDurationMinutes = fightDurationMs / 1000 / 60;

    const cooldown = ability.getCooldown(this.combatants.selected.hastePercentage, this.combatants.selected);
    const cooldownMs = (cooldown === null) ? null : cooldown * 1000;
    const cdInfo = this._getCooldownInfo(ability);

    // ability.getCasts is used for special cases that show the wrong number of cast events, like Penance
    // and also for splitting up differently buffed versions of the same spell (this use has nothing to do with CastEfficiency)
    let casts;
    if (ability.getCasts) {
      casts = ability.getCasts(this.abilityTracker.getAbility(spellId), this.owner);
    } else {
      casts = cdInfo.casts;
    }
    const cpm = casts / fightDurationMinutes;

    if (ability.isUndetectable && casts === 0) {
      // Some spells (most notably Racials) can not be detected if a player has them. This hides those spells if they have 0 casts.
      return null;
    }

    // ability.getMaxCasts is used for special cases for spells that have a variable availability or CD based on state, like Void Bolt.
    // This same behavior should be managable using SpellUsable's interface, so getMaxCasts is deprecated.
    // Legacy support: if getMaxCasts is defined, cast efficiency will be calculated using casts/rawMaxCasts
    let rawMaxCasts;
    const averageCooldown = (cdInfo.recharges === 0) ? null : (cdInfo.completedRechargeTime / cdInfo.recharges);
    if (ability.getMaxCasts) {
      // getMaxCasts expects cooldown in seconds
      rawMaxCasts = ability.getMaxCasts(cooldown, this.owner.fightDuration, this.abilityTracker.getAbility, this.owner);
    } else if (averageCooldown) { // no average CD if spell hasn't been cast
      rawMaxCasts = (this.owner.fightDuration / averageCooldown) + (ability.charges || 1) - 1;
    } else {
      rawMaxCasts = (this.owner.fightDuration / cooldownMs) + (ability.charges || 1) - 1;
    }
    const maxCasts = Math.ceil(rawMaxCasts) || 0;
    const maxCpm = (cooldown === null) ? null : maxCasts / fightDurationMinutes;

    let efficiency;
    if (ability.getMaxCasts) { // legacy support for custom getMaxCasts
      efficiency = Math.min(1, casts / rawMaxCasts);
    } else {
      // Cast efficiency calculated as the percent of fight time spell was on cooldown
      if (cooldown && this.owner.fightDuration) {
        const timeOnCd = cdInfo.completedRechargeTime + cdInfo.endingRechargeTime;
        efficiency = timeOnCd / this.owner.fightDuration;
      } else {
        efficiency = null;
      }
    }

    const recommendedEfficiency = ability.recommendedEfficiency || DEFAULT_RECOMMENDED;
    const averageIssueEfficiency = ability.averageIssueEfficiency || (recommendedEfficiency - DEFAULT_AVERAGE_DOWNSTEP);
    const majorIssueEfficiency = ability.majorIssueEfficiency || (recommendedEfficiency - DEFAULT_MAJOR_DOWNSTEP);

    const gotMaxCasts = (casts === maxCasts);
    const canBeImproved = efficiency !== null && efficiency < recommendedEfficiency && !gotMaxCasts;

    return {
      ability,
      cpm,
      maxCpm,
      casts,
      maxCasts,
      efficiency,
      recommendedEfficiency,
      averageIssueEfficiency,
      majorIssueEfficiency,
      gotMaxCasts,
      canBeImproved,
    };
  }

  suggestions(when) {
    const castEfficiencyInfo = this.getCastEfficiency();
    castEfficiencyInfo.forEach(abilityInfo => {
      if (abilityInfo.ability.noSuggestion || abilityInfo.efficiency === null || abilityInfo.gotMaxCasts) {
        return;
      }
      const ability = abilityInfo.ability;
      const mainSpell = (ability.spell instanceof Array) ? ability.spell[0] : ability.spell;
      when(abilityInfo.efficiency).isLessThan(abilityInfo.recommendedEfficiency)
        .addSuggestion((suggest, actual, recommended) => {
          return suggest(<Wrapper>Try to cast <SpellLink id={mainSpell.id} /> more often. {ability.extraSuggestion || ''} <a href="#spell-timeline">View timeline</a>.</Wrapper>)
            .icon(mainSpell.icon)
            .actual(`${abilityInfo.casts} out of ${abilityInfo.maxCasts} possible casts. You kept it on cooldown ${formatPercentage(actual, 1)}% of the time.`)
            .recommended(`>${formatPercentage(recommended, 1)}% is recommended`)
            .details(() => (
              <div style={{ margin: '0 -22px' }}>
                <SpellTimeline
                  historyBySpellId={this.spellHistory.historyBySpellId}
                  spellId={mainSpell.id}
                  start={this.owner.fight.start_time}
                  end={this.owner.currentTimestamp}
                />
              </div>
            ))
            .regular(abilityInfo.averageIssueEfficiency).major(abilityInfo.majorIssueEfficiency).staticImportance(ability.importance);
        });
    });
  }

  tab() {
    return {
      title: 'Cast efficiency',
      url: 'cast-efficiency',
      render: () => (
        <Tab title="Cast efficiency">
          <CastEfficiencyComponent
            categories={this.abilities.constructor.SPELL_CATEGORIES}
            abilities={this.getCastEfficiency()}
          />
        </Tab>
      ),
    };
  }
}

export default CastEfficiency;
