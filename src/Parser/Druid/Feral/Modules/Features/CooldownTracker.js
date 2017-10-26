import SPELLS from 'common/SPELLS';

import CoreCooldownTracker, { BUILT_IN_SUMMARY_TYPES } from 'Parser/Core/Modules/CooldownTracker';

class CooldownTracker extends CoreCooldownTracker {
  static cooldownSpells = [
    ...CooldownTracker.cooldownSpells,
    {
      spell: SPELLS.TIGERS_FURY,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
    {
      spell: SPELLS.ASHAMANES_FRENZY,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
    {
      spell: SPELLS.INCARNATION_KING_OF_THE_JUNGLE_TALENT,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
  ];

  trackEvent(event) {
    this.activeCooldowns.forEach((cooldown) => {
      if (event.ability.guid !== SPELLS.DOOM_VORTEX.id) {
        cooldown.events.push(event);
      }
    });
  }
}

export default CooldownTracker;
