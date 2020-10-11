import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import { ApplyBuffEvent, HealEvent } from 'parser/core/Events';

class AtonementApplicationSource extends Analyzer {
  // Spells that apply atonement
  atonementApplicators = new Map([
    [SPELLS.POWER_WORD_RADIANCE.id, SPELLS.POWER_WORD_RADIANCE.atonementDuration],
    [SPELLS.POWER_WORD_SHIELD.id, SPELLS.POWER_WORD_SHIELD.atonementDuration],
    [SPELLS.SHADOW_MEND.id, SPELLS.SHADOW_MEND.atonementDuration],
  ]);

  get duration() {
    return this.atonementApplicators;
  }

  _event: ApplyBuffEvent | HealEvent | null = null;

  get event() {
    return this._event;
  }

  on_byPlayer_applybuff(event: ApplyBuffEvent) {
    if (this.atonementApplicators.has(event.ability.guid)) {
      this._event = event;
    }
  }

  on_byPlayer_heal(event: HealEvent) {
    if (this.atonementApplicators.has(event.ability.guid)) {
      this._event = event;
    }
  }
}

export default AtonementApplicationSource;
