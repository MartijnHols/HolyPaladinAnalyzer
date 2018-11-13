import Analyzer from 'parser/core/Analyzer';
import CASTS_THAT_ARENT_CASTS from 'parser/core/CASTS_THAT_ARENT_CASTS';

const debug = false;


class Channeling extends Analyzer {
  _currentChannel = null;

  beginChannel(event, ability = event.ability) {
    if (this.isChanneling()) {
      // There are no specific events for channel cancels, the only indicator of this are when one starts channeling something else. Whenever we're still channeling and a new channel starts, we need to mark the old channel as canceled.
      this.cancelChannel(event, this._currentChannel.ability);
    }

    const channelingEvent = {
      type: 'beginchannel',
      timestamp: event.timestamp,
      ability,
      sourceID: event.sourceID,
    };
    this._currentChannel = channelingEvent;
    this.owner.fabricateEvent(channelingEvent, event);
    debug && this.log('Beginning channel of', ability.name);
  }
  endChannel(event) {
    const currentChannel = this._currentChannel;
    const start = currentChannel ? currentChannel.timestamp : this.owner.fight.start_time;
    if (!this.isChanneling()) {
      this.warn(event.ability.name, '`endChannel` was called while we weren\'t channeling, assuming it was a pre-combat channel.');
    }

    const duration = event.timestamp - start;
    this._currentChannel = null;
    // Since `event` may not always be the spell being ended we default to the start of the casting since that must be the right spell
    const ability = currentChannel ? currentChannel.ability : event.ability;
    this.owner.fabricateEvent({
      type: 'endchannel',
      timestamp: event.timestamp,
      ability,
      sourceID: event.sourceID,
      duration: duration,
      start,
      beginChannel: currentChannel,
    }, event); // the trigger may be another spell, sometimes the indicator of 1 channel ending is the start of another
    debug && this.log('Ending channel of', ability.name);
  }
  cancelChannel(event, ability) {
    this.owner.fabricateEvent({
      type: 'cancelchannel',
      ability,
      sourceID: event.sourceID,
      timestamp: null, // unknown, we can only know when the next cast started so passing the timestamp would be a poor guess
    }, event);
    debug && this.warn('Canceled channel of', ability.name);
  }

  on_byPlayer_begincast(event) {
    this.beginChannel(event);
  }
  on_byPlayer_cast(event) {
    if (CASTS_THAT_ARENT_CASTS.includes(event.ability.guid)) {
      // Some things such as boss mechanics are marked as cast-events even though they're usually just "ticks". This can even occur while channeling. We need to ignore them or it will throw off this module.
      return;
    }

    // TODO: Account for pre-pull `begincast`
    const isChanneling = !!this._currentChannel;
    if (!isChanneling) {
      return;
    }
    if (!this.isChannelingSpell(event.ability.guid)) {
      this.cancelChannel(event, this._currentChannel.ability);
    } else {
      this.endChannel(event);
    }
  }
  isChanneling() {
    return !!this._currentChannel;
  }
  isChannelingSpell(spellId) {
    return this._currentChannel && this._currentChannel.ability.guid === spellId;
  }

  // TODO: Move this to SpellTimeline, it's only used for that so it should track it itself
  history = [];
  on_endchannel(event) {
    // If you don't have a beginchannel event, the event will have the start of the fight as the beginchannel. This messes up a number of other modules.
    if (event.beginChannel){
      this.history.push(event);
    }
  }

  // TODO: Re-implement below
  /**
   * Can be used to determine the accuracy of the Haste tracking. This does not work properly on abilities that can get reduced channel times from other effects such as talents or traits.
   */
  // _verifyChannel(spellId, defaultCastTime, begincast, cast) {
  //   if (cast.ability.guid === spellId) {
  //     if (!begincast) {
  //       console.error('Missing begin cast for channeled ability:', cast);
  //       return;
  //     }
  //
  //     const actualCastTime = cast.timestamp - begincast.timestamp;
  //     const expectedCastTime = Math.round(defaultCastTime / (1 + this.haste.current));
  //     if (!this.constructor.inRange(actualCastTime, expectedCastTime, 50)) { // cast times seem to fluctuate by 50ms, not sure if it depends on player latency, in that case it could be a lot more flexible
  //       console.warn(`ABC: ${SPELLS[spellId].name} channel: Expected actual ${actualCastTime}ms to be expected ${expectedCastTime}ms ± 50ms @ ${formatMilliseconds(cast.timestamp - this.owner.fight.start_time)}`, this.selectedCombatant.activeBuffs());
  //     }
  //   }
  // }
}

export default Channeling;
