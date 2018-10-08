import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import Combatants from 'parser/shared/modules/Combatants';
import ItemHealingDone from 'interface/others/ItemHealingDone';

import isAtonement from '../core/isAtonement';
import AtonementDamageSource from '../features/AtonementDamageSource';

const debug = true;

class NeroBandOfPromises extends Analyzer {
  static dependencies = {
    combatants: Combatants,
    atonementDamageSource: AtonementDamageSource,
  };

  healing = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasFinger(ITEMS.NERO_BAND_OF_PROMISES.id);
  }

  on_byPlayer_heal(event) {
    if (!isAtonement(event)) {
      return;
    }
    // N'ero appears in the log as regular Atonement healing
    const combatant = this.combatants.players[event.targetID];
    if (!combatant) {
      // If combatant doesn't exist it's probably a pet, this shouldn't be noteworthy.
      debug && console.log('Skipping Atonement heal event since combatant couldn\'t be found:', event);
      return;
    }
    if (combatant.hasBuff(SPELLS.ATONEMENT_BUFF.id, event.timestamp)) {
      // If someone already has the Atonement buff then N'ero will not cause Penance to heal that person twice (N'ero does NOT stack with pre-existing Atonement)
      return;
    }
    if (!this.atonementDamageSource.event || this.atonementDamageSource.event.ability.guid !== SPELLS.PENANCE.id) {
      // N'ero only procs from Penance
      return;
    }
    this.healing += event.amount + (event.absorbed || 0);
  }

  item() {
    const healing = this.healing || 0;

    return {
      item: ITEMS.NERO_BAND_OF_PROMISES,
      result: <ItemHealingDone amount={healing} />,
    };
  }
}

export default NeroBandOfPromises;
