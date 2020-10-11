import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import HealingDone from 'parser/shared/modules/throughput/HealingDone';

import Mastery from "./Mastery";

const BASE_MANA = 20000;
const REJUV_COST = 0.105; // % of base mana

/*
 * Backend module for calculating things about Rejuvenation, to be used by other modules.
 */
class Rejuvenation extends Analyzer {
  static dependencies = {
    healingDone: HealingDone,
    mastery: Mastery,
  };

  totalRejuvsCast = 0;

  on_byPlayer_heal(event) {
    // TODO
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    // TODO make this account for procs / etc. that apply rejuv
    if (SPELLS.REJUVENATION.id === spellId) {
      this.totalRejuvsCast += 1;
    }
  }

  on_byPlayer_applybuff(event) {
    // TODO check for applications too?
  }


  on_fightend() {
    // TODO debug prints
  }

  /*
   * The total healing attributable to Rejuvenation
   */
  get totalRejuvHealing() {
    return this.mastery.getMultiMasteryHealing([SPELLS.REJUVENATION.id, SPELLS.REJUVENATION_GERMINATION.id]);
  }

  /*
   * The average healing caused per cast of Rejuvenation
   */
  get avgRejuvHealing() {
    return this.totalRejuvHealing / this.totalRejuvsCast;
  }

  /*
   * The expected healing done by using the given amount of mana to fill with Rejuv casts
   */
  getRejuvFillHealing(mana) {
    return mana / (BASE_MANA / REJUV_COST) * this.avgRejuvHealing;
  }

}

export default Rejuvenation;
