
import EventsNormalizer from 'parser/core/EventsNormalizer';
import SPELLS from 'common/SPELLS';

const ARCANE_CHARGE_SPELLS = [
  SPELLS.ARCANE_BLAST.id,
  SPELLS.ARCANE_EXPLOSION.id,
  SPELLS.CHARGED_UP_TALENT.id,
];

class ArcaneCharges extends EventsNormalizer {

    /** Ensures that the Energize events to give the player Arcane Charges is always after the Cast event if they happen at the same time. 
    * This is primarily because when the cast completes it calculates damage based on the charges the player had when the spell completed,
    * not including the one that they just gained (even though they happen at the same timestamp). Therefore the energize needs to happen
    * after the cast and not before it.
    */

  normalize(events) {
    const fixedEvents = [];
    events.forEach((event, eventIndex) => {
      fixedEvents.push(event);

      if (event.type === 'cast' && ARCANE_CHARGE_SPELLS.includes(event.ability.guid)) {
        const castTimestamp = event.timestamp;

        for (let previousEventIndex = eventIndex; previousEventIndex >= 0; previousEventIndex -= 1) {
          const previousEvent = fixedEvents[previousEventIndex];
          if ((castTimestamp - previousEvent.timestamp) > 50) {
            break;
          }
          if (previousEvent.type === 'energize' && previousEvent.sourceID === event.sourceID) {
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

export default ArcaneCharges;
