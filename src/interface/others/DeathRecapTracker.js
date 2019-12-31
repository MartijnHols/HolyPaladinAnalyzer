import React from 'react';

import SPELLS from 'common/SPELLS';
import DEFENSIVE_BUFFS from 'common/DEFENSIVE_BUFFS';
import Analyzer from 'parser/core/Analyzer';
import Combatants from 'parser/shared/modules/Combatants';
import Abilities from 'parser/core/modules/Abilities';
import Buffs from 'parser/core/modules/Buffs';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import Enemies from 'parser/shared/modules/Enemies';
import Healthstone from 'parser/shared/modules/items/Healthstone';
import Panel from 'interface/others/Panel';

import DeathRecap from './DeathRecap';

class DeathRecapTracker extends Analyzer {
  deaths = [];
  events = [];
  healed = [];
  damaged = [];
  cooldowns = [];
  buffs = [];
  lastBuffs = [];

  static dependencies = {
    combatants: Combatants,
    abilities: Abilities,
    buffsModule: Buffs,
    spellUsable: SpellUsable,
    enemies: Enemies,
    healthstone: Healthstone,
  };

  constructor(...args) {
    super(...args);
    this.cooldowns = this.abilities.activeAbilities.filter(ability => (
      ability.category === Abilities.SPELL_CATEGORIES.DEFENSIVE
      || ability.category === Abilities.SPELL_CATEGORIES.SEMI_DEFENSIVE
      || ability.isDefensive
    ));
    // Add additional defensive buffs/debuffs to common/DEFENSIVE_BUFFS
    DEFENSIVE_BUFFS.forEach(e => {
      this.buffs.push({
        id: e.spell.id,
      });
    });
    this.buffsModule.activeBuffs.forEach(buff => {
      if (buff.spellId instanceof Array) {
        buff.spellId.forEach(spellId => {
          this.buffs.push({
            id: spellId,
          });
        });
      } else {
        this.buffs.push({
          id: buff.spellId,
        });
      }
    });
  }

  addEvent(event) {
    const extendedEvent = { ...event };
    extendedEvent.time = event.timestamp - this.owner.fight.start_time;

    const cooldownsOnly = this.cooldowns.filter(e => e.cooldown);
    extendedEvent.defensiveCooldowns = cooldownsOnly.map(e => ({ id: e.primarySpell.id, cooldownReady: this.spellUsable.isAvailable(e.primarySpell.id) }));
    if (event.hitPoints > 0) {
      this.lastBuffs = this.buffs.filter(e => {
        const buff = this.selectedCombatant.getBuff(e.id);
        const hasBuff = buff !== undefined;
        if (!hasBuff) {
          return false;
        }
        if (e.id === SPELLS.BLESSING_OF_SACRIFICE.id) {
          return buff.sourceID === this.selectedCombatant.id;
        }
        return true;
      });
    }
    extendedEvent.buffsUp = this.lastBuffs;

    if (!event.sourceIsFriendly && this.enemies.enemies[event.sourceID]) {
      const sourceHasDebuff = debuff => (!debuff.end || event.timestamp <= debuff.end) && event.timestamp >= debuff.start && debuff.isDebuff && this.buffs.some(e => e.id === debuff.ability.guid);
      extendedEvent.debuffsUp = this.enemies.enemies[event.sourceID].buffs.filter(sourceHasDebuff)
        .map(e => ({ id: e.ability.guid }));
    }

    this.events.push(extendedEvent);
  }

  on_toPlayer_heal(event) {
    this.addEvent(event);
  }
  on_toPlayer_damage(event) {
    this.addEvent(event);
  }
  on_toPlayer_instakill(event) {
    this.addEvent(event);
  }
  on_toPlayer_death(event) {
    if(event.timestamp <= this.owner.fight.start_time){
      return;
    }
    this.addEvent(event);
    this.deaths.push(event.timestamp);
  }

  get secondsBeforeDeath() {
    return this.deaths.map(deathtime => ({
      deathtime,
      events: this.events,
      open: false,
    }));
  }

  // TODO: Turn this into a core component that is used directly by Results instead (tab is deprecated)
  tab() {
    if (this.deaths.length === 0) {
      return null;
    }

    return {
      title: 'Death Recap',
      url: 'death-recap',
      render: () => (
        <Panel
          title="Death recap"
          pad={false}
        >
          <DeathRecap
            report={this.owner}
            events={this.secondsBeforeDeath}
            combatants={this.combatants.players}
            enemies={this.enemies.enemies}
          />
        </Panel>
      ),
    };
  }
}

export default DeathRecapTracker;
