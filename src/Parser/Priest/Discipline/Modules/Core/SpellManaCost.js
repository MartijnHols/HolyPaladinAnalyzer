import SPELLS from 'common/SPELLS';

import CoreSpellManaCost from 'Parser/Core/Modules/SpellManaCost';
// import Penance from '../Spells/Penance';

/** The amount of time during which it's impossible a second Penance could have started */
const PENANCE_CHANNEL_TIME_BUFFER = 2500;

const debug = false;

class SpellManaCost extends CoreSpellManaCost {
  // static dependencies = {
  //   penance: Penance, // we need this to add `penanceBoltNumber` to the cast event
  // };

  lastPenanceStartTimestamp = null;
  getHardcodedManaCost(event) {
    const spellId = event.ability.guid;
    let hardcodedCost = super.getHardcodedManaCost(event);
    // Penance does not include the mana cost in the spellId :(
    if (spellId === SPELLS.PENANCE.id) {
      if (!this.lastPenanceStartTimestamp || (event.timestamp - this.lastPenanceStartTimestamp) > PENANCE_CHANNEL_TIME_BUFFER) {
        this.lastPenanceStartTimestamp = event.timestamp;
      // if (event.isInitialPenanceCast) {
        hardcodedCost = SPELLS.PENANCE.manaCost;
      } else {
        // This is a second or later bolt from Penance, it doesn't cost mana.
        hardcodedCost = 0;
      }
    }
    return hardcodedCost;
  }
  getManaCost(event) {
    let cost = super.getManaCost(event);
    if (cost === 0) {
      return cost;
    }

    // Kam Xi'raff reduces the mana cost of damaging spells by 75%
    if (!event.targetIsFriendly && this.owner.modules.combatants.selected.hasBuff(SPELLS.KAM_XIRAFF_BUFF.id, event.timestamp)) {
      debug && console.log('Hostile spell and', SPELLS.KAM_XIRAFF_BUFF.name, 'is active, reducing cost (', cost, ') by 75%');
      cost *= 0.25;
    }

    return cost;
  }
}

export default SpellManaCost;
