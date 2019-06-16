import React from 'react';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import SpellLink from 'common/SpellLink.js';

import { formatNumber } from 'common/format';
import { formatPercentage } from 'common/format';

import SPELLS from 'common/SPELLS';
import TraitStatisticBox, { STATISTIC_ORDER } from 'interface/others/TraitStatisticBox';
import ItemHealingDone from 'interface/others/ItemHealingDone';
import ItemDamageDone from 'interface/others/ItemDamageDone';
import Events from 'parser/core/Events';

import BeaconHealSource from '../beacons/BeaconHealSource.js';


/**
 * Glimmer of Light,	Azerite Power
 * Requires Paladin (Holy, Holy)
 * Holy Shock leaves a Glimmer of Light on the target for 30 sec.  
 * When you Holy Shock, all targets with Glimmer of Light are damaged for 1076 or healed for 1587. (at ilvl 400)
 * Example Log: https://www.warcraftlogs.com/reports/TX4nzPy8WwrfLv97#fight=19&type=auras&source=5&ability=287280
 */

const BUFF_DURATION = 30;

class GlimmerOfLight extends Analyzer {
  static dependencies = {
    beaconHealSource: BeaconHealSource,
  };

  glimmerBuffs = {};
  glimmerHits = 0;
  healing = 0;
  wasted = 0;
  healingTransfered = 0;
  casts = 0;
  earlyRefresh = 0;
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.GLIMMER_OF_LIGHT_TRAIT.id);
    if (!this.active) {
      return;
    }
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.HOLY_SHOCK_CAST), this.onCast);
    this.addEventListener(Events.heal.by(SELECTED_PLAYER).spell(SPELLS.GLIMMER_OF_LIGHT), this.onHeal);
    this.addEventListener(this.beaconHealSource.beacontransfer.by(SELECTED_PLAYER), this.onBeaconTransfer);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.GLIMMER_OF_LIGHT_DAMAGE), this.onDamage);
  }

  onBeaconTransfer(event) {
    const spellId = event.originalHeal.ability.guid;
    if (spellId !== SPELLS.GLIMMER_OF_LIGHT.id) {
      return;
    }
    this.healingTransfered += event.amount + (event.absorbed || 0);
  }

  onCast(event) {
    this.casts += 1;
    const sinceLastBuff = event.timestamp - (this.glimmerBuffs[event.targetID] || 0);
    if (sinceLastBuff < BUFF_DURATION * 1000){
      this.wasted += BUFF_DURATION * 1000 - sinceLastBuff;
      this.earlyRefresh += 1;
    }

    this.glimmerBuffs[event.targetID] = event.timestamp; 
  }

  onDamage(event){
    this.damage += event.amount + (event.absorbed || 0);
    this.glimmerHits += 1;
  }

  onHeal(event) {
    this.healing += event.amount + (event.absorbed || 0);
    this.glimmerHits += 1;
  }

  get hitsPerCast(){
    return this.glimmerHits / this.casts; 
    }

  get holyShocksPerMinute(){
    return this.casts / (this.owner.fightDuration / 60000);
  }

  get totalHealing() {
    return this.healing + this.healingTransfered;
  }

  get glimmersWasted() {
    return this.wasted / (this.casts * BUFF_DURATION * 1000);
  }

  statistic() {
    return (
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.GLIMMER_OF_LIGHT.id}
        value={(
          <>
            <ItemHealingDone amount={this.totalHealing} /><br />
            <ItemDamageDone amount={this.damage} /><br />
            {this.hitsPerCast.toFixed(1)} Triggers/Cast
          </>
        )}
        tooltip={(
          <>
            Total healing done: <b>{formatNumber(this.totalHealing)}</b><br />
            Beacon healing transfered: <b>{formatNumber(this.healingTransfered)}</b><br />
            Holy Shocks/minute: <b>{this.holyShocksPerMinute.toFixed(1)}</b><br />
            Early refresh(s): <b>{this.earlyRefresh}</b><br />
            Lost to early refresh: <b>{(this.wasted/1000).toFixed(1)}(sec) {(this.glimmersWasted * 100).toFixed(1)}%</b><br />
            Glimmer damage: <b>{formatNumber(this.damage)}</b><br />
          </>
        )}
      />
    );
  }

  get suggestedGlimmerUsage() {
    return {
      actual: this.glimmersWasted,
      isGreaterThan: {
        minor: 0.15,
        average: 0.25,
        major: .35,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.suggestedGlimmerUsage).addSuggestion((suggest, actual, recommended) => {
      return suggest(
        <>
          Your usage of <SpellLink id={SPELLS.GLIMMER_OF_LIGHT.id} /> can be improved. Try to avoid overwritting buffs too early.
        </>
      )
        .icon(SPELLS.GLIMMER_OF_LIGHT.icon)
        .actual(`Percentage uptime lost to early refresh was ${formatPercentage(this.glimmersWasted)}%`)
        .recommended(`< 15% is recommended`);
    });
  }
}

export default GlimmerOfLight;
