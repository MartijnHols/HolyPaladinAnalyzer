import SPELLS from 'common/SPELLS/index';

import EventsNormalizer from 'parser/core/EventsNormalizer';

class RapidFire extends EventsNormalizer {
  /**
   * Rapid Fire has a ton of cast events for each tick of the ability, but it also applies a
   * buff for Rapid Fire and fires a separate single cast event with a different spell id to
   * mark the start. This marks all other cast events of Rapid Fire as ticks.
   *
   * Example log: https://www.warcraftlogs.com/reports/21LMKatbWxmYqyV7#fight=23&type=damage-done&source=97
   *
   * @param {Array} events
   * @returns {Array}
   */
  normalize(events) {
    const fixedEvents = [];
    events.forEach(event => {
      if (event.type === 'cast' && event.ability.guid === SPELLS.RAPID_FIRE_TICKS.id) {
        event.type = 'tick';
        event.__modified = true;
      }
      fixedEvents.push(event);
    });

    return fixedEvents;
  }
}

export default RapidFire;
