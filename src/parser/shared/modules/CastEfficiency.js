import React from 'react';
import { Trans } from '@lingui/macro';

import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import Panel from 'interface/statistics/Panel';
import CastEfficiencyComponent from 'interface/others/CastEfficiency';
import Analyzer from 'parser/core/Analyzer';
import SpellHistory from 'parser/shared/modules/SpellHistory';
import Channeling from 'parser/shared/modules/Channeling';
import Abilities from 'parser/core/modules/Abilities';

import AbilityTracker from './AbilityTracker';
import Haste from './Haste';

const DEFAULT_RECOMMENDED = 0.80;
const DEFAULT_AVERAGE_DOWNSTEP = 0.05;
const DEFAULT_MAJOR_DOWNSTEP = 0.15;
const seconds = ms => ms / 1000;
const minutes = ms => seconds(ms) / 60;

class CastEfficiency extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    haste: Haste,
    spellHistory: SpellHistory,
    abilities: Abilities,
    channeling: Channeling,
  };

  /**
   * Gets info about spell's cooldown behavior. All values are as of the current timestamp.
   * completedRechargeTime is the total ms of completed cooldowns
   * endingRechargeTime is the total ms into current cooldown
   * recharges is the total number of times the spell has recharged (either come off cooldown or gained a charge)
   * Only works on spells entered into CastEfficiency list.
   */
  _getCooldownInfo(ability) {
    const mainSpellId = ability.primarySpell.id;
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
          //limit by start time in case of pre phase events
          const rechargingTime = (event.timestamp - Math.max(lastRechargeTimestamp, this.owner.fight.start_time)) || 0;
          recharges += 1;
          lastRechargeTimestamp = null;
          return acc + rechargingTime;
          // This might cause oddness if we add anything that externally refreshes charges, but so far nothing does
        } else if (event.trigger === 'restorecharge') {
          //limit by start time in case of pre phase events
          const rechargingTime = (event.timestamp - Math.max(lastRechargeTimestamp, this.owner.fight.start_time)) || 0;
          recharges += 1;
          lastRechargeTimestamp = event.timestamp;
          return acc + rechargingTime;
        } else {
          return acc;
        }
      }, 0);
      //limit by start time in case of pre phase events
    const endingRechargeTime = (!lastRechargeTimestamp) ? 0 : this.owner.currentTimestamp - Math.max(lastRechargeTimestamp, this.owner.fight.start_time);

    const casts = history.filter(event => event.type === 'cast').length;

    return {
      completedRechargeTime,
      endingRechargeTime,
      recharges,
      casts,
    };
  }

  _getTimeSpentCasting(ability) {
    const mainSpellId = ability.primarySpell.id;
    const history = this.spellHistory.historyBySpellId[mainSpellId];
    if (!history) { // spell either never been cast, or not in abilities list
      return 0;
    }

    let beginCastTimestamp = null;
    let beginChannelTimestamp = null;
    const timeSpentCasting = history
      .reduce((acc, event) => {

        if (event.type === 'begincast') {
          beginCastTimestamp = event.timestamp;
          return acc;
        } else if (event.type === 'cast') {
          //limit by start time in case of pre phase events
          const castTime = beginCastTimestamp ? (event.timestamp - Math.max(beginCastTimestamp, this.owner.fight.start_time)) : 0;
          beginCastTimestamp = null;
          return acc + castTime;
        } else if (event.type === 'beginchannel') {
          beginChannelTimestamp = event.timestamp;
          return acc;
        } else if (event.type === 'endchannel') {
          //limit by start time in case of pre phase events
          const channelTime = beginChannelTimestamp ? (event.timestamp - Math.max(beginChannelTimestamp, this.owner.fight.start_time)) : 0;
          beginCastTimestamp = null;
          return acc + channelTime;
        } else {
          return acc;
        }
      }, 0);

    return timeSpentCasting;
  }

  _getTimeSpentOnGcd(spellId) {
    const ability = this.abilities.getAbility(spellId);

    if (ability) {
      const cdInfo = this._getCooldownInfo(ability);

      let casts;
      if (ability.castEfficiency.casts) {
        casts = ability.castEfficiency.casts(this.abilityTracker.getAbility(spellId), this.owner);
      } else {
        casts = cdInfo.casts;
      }

      const averagetimeSpentOnAbility = this._getTimeSpentCasting(ability) / casts;
      // If the abilities GCD is longer than the time spent casting, use the GCD
      if (ability.gcd && ability.gcd.base) {
        const gcdReduction = ability.gcd.base * this.haste.current;
        const gcdActual = ability.gcd.base - gcdReduction;

        if (averagetimeSpentOnAbility < gcdActual) {
          return gcdActual * casts;
        }
      } else if (ability.gcd && ability.gcd.static && averagetimeSpentOnAbility < ability.gcd.static) {
        return ability.gcd.static * casts;
      }
    }
    return 0;
  }

  getTimeSpentCasting(abilityId) {
    const timeSpentCasting = this._getTimeSpentCasting({ primarySpell: { id: abilityId } });
    const gcdSpent = this._getTimeSpentOnGcd(abilityId);

    return {
      timeSpentCasting,
      gcdSpent,
    };
  }

  /**
   * Time spent waiting for a GCD that reset the cooldown of the spell to finish
   */
  _getTimeWaitingOnGCD(ability) {
    const mainSpellId = ability.primarySpell.id;
    const history = this.spellHistory.historyBySpellId[mainSpellId];
    if (!history) { // spell either never been cast, or not in abilities list
      return 0;
    }

    const timeWaitingOnGCD = history
      .reduce((acc, event) => {
        if (event.type === 'updatespellusable' && event.timeWaitingOnGCD) {
          return acc + event.timeWaitingOnGCD;
        } else {
          return acc;
        }
      }, 0);

    return timeWaitingOnGCD;
  }

  /**
   * Packs cast efficiency results for use by suggestions / tab
   */
  getCastEfficiency() {
    return this.abilities.activeAbilities
      .map(ability => this.getCastEfficiencyForAbility(ability))
      .filter(item => item !== null); // getCastEfficiencyForAbility can return null, remove those from the result
  }
  getCastEfficiencyForSpellId(spellId, includeNoCooldownEfficiency = false) {
    const ability = this.abilities.getAbility(spellId);
    return ability ? this.getCastEfficiencyForAbility(ability, includeNoCooldownEfficiency) : null;
  }
  getCastEfficiencyForAbility(ability, includeNoCooldownEfficiency = false) {
    const spellId = ability.primarySpell.id;
    const availableFightDuration = this.owner.fightDuration;

    const cooldown = ability.cooldown;
    const cooldownMs = !cooldown ? null : cooldown * 1000;
    const cdInfo = this._getCooldownInfo(ability);
    const timeSpentCasting = (cooldown && ability.charges < 2) ? this._getTimeSpentCasting(ability) : 0;
    const timeWaitingOnGCD = (cooldown && ability.charges < 2 && ability.gcd) ? this._getTimeWaitingOnGCD(ability) : 0;

    // ability.casts is used for special cases that show the wrong number of cast events, like Penance
    // and also for splitting up differently buffed versions of the same spell
    let casts;
    if (ability.castEfficiency.casts) {
      casts = ability.castEfficiency.casts(this.abilityTracker.getAbility(spellId), this.owner);
    } else {
      casts = cdInfo.casts;
    }
    const cpm = casts / minutes(availableFightDuration);
    const averageTimeSpentCasting = timeSpentCasting / casts;
    const averageTimeWaitingOnGCD = timeWaitingOnGCD / casts;

    if (ability.isUndetectable && casts === 0) {
      // Some spells (most notably Racials) can not be detected if a player has them. This hides those spells if they have 0 casts.
      return null;
    }

    // ability.maxCasts is used for special cases for spells that have a variable availability or CD based on state, like Void Bolt.
    // This same behavior should be managable using SpellUsable's interface, so maxCasts is deprecated.
    // Legacy support: if maxCasts is defined, cast efficiency will be calculated using casts/rawMaxCasts
    let rawMaxCasts;
    const averageCooldown = (cdInfo.recharges === 0) ? null : (cdInfo.completedRechargeTime / cdInfo.recharges);
    if (ability.castEfficiency.maxCasts) {
      // maxCasts expects cooldown in seconds
      rawMaxCasts = ability.castEfficiency.maxCasts(cooldown, availableFightDuration, this.abilityTracker.getAbility, this.owner);
    } else if (averageCooldown) { // no average CD if spell hasn't been cast
      rawMaxCasts = (availableFightDuration / (averageCooldown + averageTimeSpentCasting + averageTimeWaitingOnGCD)) + (ability.charges || 1) - 1;
    } else if (!includeNoCooldownEfficiency) {
      rawMaxCasts = (availableFightDuration / cooldownMs) + (ability.charges || 1) - 1;
    } else if (casts > 0) {
      let averagetimeSpentOnNoCooldownAbility = this._getTimeSpentCasting(ability) / casts;
      if (ability.gcd && averagetimeSpentOnNoCooldownAbility < ability.gcd.base) {
        // edge case for no cast time spells and spells with cast time lower than the gcd.
        averagetimeSpentOnNoCooldownAbility = ability.gcd.base;
      }
      rawMaxCasts = availableFightDuration / averagetimeSpentOnNoCooldownAbility;
    } else {
      // If we don't have any way to tell the cast time of the spell, return null.
      rawMaxCasts = null;
    }

    const maxCasts = Math.ceil(rawMaxCasts) || 0;
    const maxCpm = maxCasts / minutes(availableFightDuration);

    let efficiency;
    if (ability.castEfficiency.maxCasts) { // legacy support for custom maxCasts
      efficiency = Math.min(1, casts / rawMaxCasts);
    } else {
      // Cast efficiency calculated as the percent of fight time spell was unavailable
      // The spell is considered unavailable if it is on cooldown, the time since it came off cooldown is less than the cast time or the cooldown was reset through a proc during a GCD
      if (cooldown && availableFightDuration) {
        const timeOnCd = cdInfo.completedRechargeTime + cdInfo.endingRechargeTime;
        const timeUnavailable = timeOnCd + timeSpentCasting + timeWaitingOnGCD;
        efficiency = timeUnavailable / availableFightDuration;
      } else if (includeNoCooldownEfficiency) {
        efficiency = casts / rawMaxCasts;
      } else {
        efficiency = null;
      }
    }

    const recommendedEfficiency = ability.castEfficiency.recommendedEfficiency || DEFAULT_RECOMMENDED;
    const averageIssueEfficiency = ability.castEfficiency.averageIssueEfficiency || (recommendedEfficiency - DEFAULT_AVERAGE_DOWNSTEP);
    const majorIssueEfficiency = ability.castEfficiency.majorIssueEfficiency || (recommendedEfficiency - DEFAULT_MAJOR_DOWNSTEP);

    const gotMaxCasts = (casts === maxCasts);
    const canBeImproved = ability.castEfficiency.suggestion && efficiency !== null && efficiency < recommendedEfficiency && !gotMaxCasts;

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
      if (!abilityInfo.ability.castEfficiency.suggestion || abilityInfo.efficiency === null || abilityInfo.gotMaxCasts) {
        return;
      }
      const ability = abilityInfo.ability;
      const mainSpell = (ability.spell instanceof Array) ? ability.spell[0] : ability.spell;

      const suggestionThresholds = {
        actual: abilityInfo.efficiency,
        isLessThan: {
          minor: abilityInfo.recommendedEfficiency,
          average: abilityInfo.averageIssueEfficiency,
          major: abilityInfo.majorIssueEfficiency,
        },
      };

      when(suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
        return suggest(
          <>
            <Trans>Try to cast <SpellLink id={mainSpell.id} /> more often.</Trans> {ability.castEfficiency.extraSuggestion || ''}
          </>
        )
          .icon(mainSpell.icon)
          .actual(<Trans>{abilityInfo.casts} out of {abilityInfo.maxCasts} possible casts. You kept it on cooldown {formatPercentage(actual, 0)}% of the time.</Trans>)
          .recommended(<Trans>&gt;{formatPercentage(recommended, 0)}% is recommended</Trans>)
          .staticImportance(ability.castEfficiency.importance);
      });
    });
  }
  statistic() {
    return (
      <Panel
        title="Abilities"
        position={500}
        pad={false}
      >
        <CastEfficiencyComponent
          categories={this.abilities.constructor.SPELL_CATEGORIES}
          abilities={this.getCastEfficiency()}
        />
      </Panel>
    );
  }
}

export default CastEfficiency;
