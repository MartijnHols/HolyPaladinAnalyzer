import React from 'react';

import SPELLS from 'common/SPELLS';
import Module from 'Parser/Core/Module';


import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';
import Tab from 'Main/Tab';

import { formatPercentage } from 'common/format';

import Insanity from '../Core/Insanity';
import Mindbender from './Mindbender';
import Dispersion from './Dispersion';
import VoidTorrent from './VoidTorrent';
import VoidformsTab from './VoidformsTab';



class Voidform extends Module {
  static dependencies = {
    insanity: Insanity,
    dispersion: Dispersion,
    voidTorrent: VoidTorrent,
    mindbender: Mindbender,
  };

  _previousVoidformCast = null;
  _totalHasteAcquiredOutsideVoidform = 0;
  _totalLingeringInsanityTimeOutsideVoidform = 0;
  _inVoidform           = false;

  _voidforms            = {};


  get voidforms(){
    return Object.keys(this._voidforms).map(key => this._voidforms[key]);
  }

  get averageVoidformHaste(){
    const averageHasteFromVoidform = (this.voidforms.reduce((p, c) => p += c.totalHasteAcquired / ((c.ended - c.start)/1000), 0) / this.voidforms.length) / 100;
    return (1 + this.owner.selectedCombatant.hastePercentage) * (1 + averageHasteFromVoidform);
  }

  get averageNonVoidformHaste(){
    return (1 + this.owner.selectedCombatant.hastePercentage) * (1 + (this._totalHasteAcquiredOutsideVoidform / this._totalLingeringInsanityTimeOutsideVoidform)/100);
  }

  get averageVoidformStacks(){
    if(this.voidforms.length === 0) return 0;

    // ignores last voidform if seen as skewing
    const nonExcludedVoidforms = this.voidforms.filter(voidform => !voidform.excluded);
    return nonExcludedVoidforms.reduce((p, c) => p += c.stacks.length, 0)/nonExcludedVoidforms.length;
  }

  createVoidform(event){
    this._inVoidform = true;
    this._previousVoidformCast = event;
    this._voidforms[event.timestamp] = {
      start: event.timestamp,
      stacks: [{
        stack: 1,
        timestamp: event.timestamp,
      }],
      lingeringInsanityStacks: [],
      excluded: false,
      totalHasteAcquired: 0,
    };
  }

  getCurrentVoidform(){
    return this._inVoidform ? this._voidforms[this._previousVoidformCast.timestamp] : false;
  }

  setCurrentVoidform(voidform){
    if(this._inVoidform){
      this._voidforms[this._previousVoidformCast.timestamp] = voidform;
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.VOID_ERUPTION.id) {
      return;
    }

    this.createVoidform(event);
  }

  on_byPlayer_removebuff(event){
    const spellId = event.ability.guid;
    if (spellId === SPELLS.VOIDFORM_BUFF.id) {

      this._voidforms[this._previousVoidformCast.timestamp].ended = event.timestamp;
      this._inVoidform = false;
    }
  }

  on_byPlayer_applybuffstack(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.VOIDFORM_BUFF.id) {

      // for those prepull voidforms:
      if(this._previousVoidformCast === null){
        this.createVoidform(event);
      }

      let currentVoidform = this.getCurrentVoidform();
      currentVoidform = {
        ...currentVoidform,
        totalHasteAcquired: currentVoidform.totalHasteAcquired + event.stack,
        stacks: [
          ...currentVoidform.stacks,
          {
            stack: event.stack,
            timestamp: event.timestamp,
          },
        ],
      };

      this.setCurrentVoidform(currentVoidform);
    }
  }

  on_byPlayer_removebuffstack(event){
    const spellId = event.ability.guid;
    if (spellId === SPELLS.LINGERING_INSANITY.id) {
      

      if(this._inVoidform){
        const { timestamp, stack } = event;
        let currentVoidform = this.getCurrentVoidform();
        currentVoidform = {
          ...currentVoidform,
          totalHasteAcquired: currentVoidform.totalHasteAcquired + stack,
          lingeringInsanityStacks: [
            ...currentVoidform.lingeringInsanityStacks,
            {
              stack,
              timestamp,
            },
          ],
        };
        this.setCurrentVoidform(currentVoidform);
      } else {
        this._totalHasteAcquiredOutsideVoidform += event.stack;
        this._totalLingeringInsanityTimeOutsideVoidform += 1;
      }
    }
  }

  on_finished(){
    const player = this.owner.selectedCombatant;

    // excludes last one to avoid skewing the average (if in voidform when the encounter ends):
    if(player.hasBuff(SPELLS.VOIDFORM_BUFF.id)){
      const averageVoidformStacks = this.voidforms.slice(0, this.voidforms.length - 1).reduce((p, c) => p += c.stacks.length, 0) / (this.voidforms.length - 1);
      const lastVoidformStacks    = this.voidforms[this.voidforms.length-1].stacks.length;

      if(lastVoidformStacks + 5 < averageVoidformStacks){
        this._voidforms[this._previousVoidformCast.timestamp].excluded = true;
      }
    }

    // set end to last voidform of the fight:
    if(this._voidforms[this._previousVoidformCast.timestamp].ended === undefined){
      this._voidforms[this._previousVoidformCast.timestamp].ended = this.owner._timestamp;
    }
  }

  suggestions(when) {
    const uptime = this.owner.selectedCombatant.getBuffUptime(SPELLS.VOIDFORM_BUFF.id) / (this.owner.fightDuration - this.owner.selectedCombatant.getBuffUptime(SPELLS.DISPERSION.id));

    when(uptime).isLessThan(0.80)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<span>Your <SpellLink id={SPELLS.VOIDFORM.id} /> uptime can be improved. Try to maximize the uptime by using your insanity generating spells.
          <br/><br/>
          Use the generators with the priority:
          <br/><SpellLink id={SPELLS.VOID_BOLT.id} />
          <br/><SpellLink id={SPELLS.MIND_BLAST.id} />
          <br/><SpellLink id={SPELLS.MIND_FLAY.id} />
          </span>)
          .icon(SPELLS.VOIDFORM_BUFF.icon)
          .actual(`${formatPercentage(actual)}% Voidform uptime`)
          .recommended(`>${formatPercentage(recommended)}% is recommended`)
          .regular(recommended).major(recommended - 0.10);
      });
  }

  statistic() {
    return (<StatisticBox
      icon={<SpellIcon id={SPELLS.VOIDFORM.id} />}
      value={`${formatPercentage(this.owner.selectedCombatant.getBuffUptime(SPELLS.VOIDFORM_BUFF.id) / (this.owner.fightDuration - this.owner.selectedCombatant.getBuffUptime(SPELLS.DISPERSION.id)))} %`}
      label={(
        <dfn data-tip={`Time spent in dispersion (${Math.round(this.owner.selectedCombatant.getBuffUptime(SPELLS.DISPERSION.id) / 1000)} seconds) is excluded from the fight.`}>
          Voidform uptime
        </dfn>
      )}
    />);
  }

  statisticOrder = STATISTIC_ORDER.CORE(3);

  tab(){
    return {
      title: 'Voidforms',
      url: 'voidforms',
      render: () => (
        <Tab title="Voidforms">
          <VoidformsTab 
            voidforms={this.voidforms} 
            insanityEvents={this.insanity.events}
            voidTorrentEvents={this.voidTorrent.voidTorrents} 
            mindbenderEvents={this.mindbender.mindbenders} 
            dispersionEvents={this.dispersion.dispersions} 
            fightEnd={this.owner.fight.end_time}
            surrenderToMadness={!!this.owner.selectedCombatant.hasTalent(SPELLS.SURRENDER_TO_MADNESS_TALENT.id)}
            setT20P4={this.owner.selectedCombatant.hasBuff(SPELLS.SHADOW_PRIEST_T20_4SET_BONUS_PASSIVE.id)}
          />
        </Tab>
      ),
    };
  }

}

export default Voidform;
