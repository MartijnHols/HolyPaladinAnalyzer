import CoreGlobalCooldown from 'parser/shared/modules/GlobalCooldown';
import { CastEvent } from 'parser/core/Events';

import SPELLS from 'common/SPELLS';

/**
 * Drain Soul's cast event is actually a beginchannel event, so it shouldn't add the GCD as active time.
 */
class GlobalCooldown extends CoreGlobalCooldown {
  on_byPlayer_cast(event: CastEvent) {
    if (event.ability.guid === SPELLS.DRAIN_SOUL_TALENT.id) {
      // This GCD gets handled by the `beginchannel` event
      return;
    }
    super.on_byPlayer_cast(event);
  }
}

export default GlobalCooldown;