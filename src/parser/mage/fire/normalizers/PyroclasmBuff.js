import SPELLS from 'common/SPELLS';

import EventsNormalizer from 'parser/core/EventsNormalizer';

class PyroclasmBuff extends EventsNormalizer {
  /**
   * @param {Array} events
   * @returns {Array}
   */
  //Ensures that the  ApplyBuff, RefreshBuff, and RemoveBuff events are not occuring before the pyroblast events... so the buff doesnt get applied, removed, or refreshed before the pyroblast actually casts
  normalize(events) {
    const fixedEvents = [];
    events.forEach((event, eventIndex) => {
      fixedEvents.push(event);

      if (event.type === 'cast' && event.ability.guid === SPELLS.PYROBLAST.id) {
        const castTimestamp = event.timestamp;

        for (let previousEventIndex = eventIndex; previousEventIndex >= 0; previousEventIndex -= 1) {
          const previousEvent = fixedEvents[previousEventIndex];
          if ((castTimestamp - previousEvent.timestamp) > 50) {
            break;
          }
          if ((previousEvent.type === 'removebuff' || previousEvent.type === 'applybuff' || previousEvent.type === 'refreshbuff' || previousEvent.type === 'applybuffstack' || previousEvent.type === 'removebuffstack') && previousEvent.ability.guid === SPELLS.PYROCLASM_BUFF.id && previousEvent.sourceID === event.sourceID) {
            fixedEvents.splice(previousEventIndex, 1);
            fixedEvents.push(previousEvent);
            previousEvent.__modified = true;
            break;
          }
        }
      }
    });

    return fixedEvents;
  }
}

export default PyroclasmBuff;
