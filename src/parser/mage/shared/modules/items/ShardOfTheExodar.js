import ITEMS from 'common/ITEMS';
import { formatNumber } from 'common/format';
import Analyzer from 'parser/core/Analyzer';
import BLOODLUST_BUFFS from 'game/BLOODLUST_BUFFS';

const TEAM_COOLDOWN = 600;
const PERSONAL_COOLDOWN = 300;
const DURATION = 40;

/**
 * Shard of the Exodar:
 * Your Time Warp does not cause Temporal Displacement on yourself and is not affected by Temporal Displacement or similar effects on yourself.
 */
class ShardOfTheExodar extends Analyzer {
  actualCasts = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasFinger(ITEMS.SHARD_OF_THE_EXODAR.id);
  }

  on_toPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    if (BLOODLUST_BUFFS[spellId]) {
      this.actualCasts += 1;
    }
  }

  on_toPlayer_refreshbuff(event) {
    const spellId = event.ability.guid;
    if (BLOODLUST_BUFFS[spellId]) {
      this.actualCasts += 1;
    }
  }

  get fightDurationSeconds() {
    return this.owner.fightDuration / 1000;
  }

  get teamCasts() {
    return 1 + Math.floor(this.fightDurationSeconds / TEAM_COOLDOWN);
  }

  get personalCasts() {
    return 1 + Math.floor((this.fightDurationSeconds - DURATION) / PERSONAL_COOLDOWN);
  }

  get possibleCasts() {
    return this.teamCasts + this.personalCasts;
  }

  statistic() {
    return {
      item: ITEMS.SHARD_OF_THE_EXODAR,
      result: `Gained Time Warp effect ${formatNumber(this.actualCasts)} Times. (${formatNumber(this.possibleCasts)} Possible)`,
    };
  }
}

export default ShardOfTheExodar;
