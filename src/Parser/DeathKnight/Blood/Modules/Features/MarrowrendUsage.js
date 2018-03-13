import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';
import SPELLS from 'common/SPELLS';
import AbilityTracker from 'Parser/Core/Modules/AbilityTracker';
import SpellIcon from 'common/SpellIcon';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';

class MarrowrendUsage extends Analyzer {

  static dependencies = {
    abilityTracker: AbilityTracker,
    combatants: Combatants,
  };

  /*
    currentBoneShieldBuffer contains the BS stacks caused by the actual MR cast
    since the applyBuffStack event happens before the cast event
  */

  currentBoneShieldStacks = 0;
  currentBoneShieldBuffer = 0;
  lastMarrowrendCast = 0;

  bsStacksWasted = 0;
  badMRCasts = 0;
  refreshMRCasts = 0;
  totalMRCasts = 0;

  REFRESH_AT_STACKS = 6;
  REFRESH_AT_SECONDS = 6;
  BS_DURATION = 30;
  MR_GAIN = 3;


  on_toPlayer_applybuff(event) {
    if (event.ability.guid === SPELLS.BONE_SHIELD.id){
      this.currentBoneShieldBuffer += 1;
      this.currentBoneShieldStacks += 1;
    }
  }

  on_toPlayer_applybuffstack(event) {
    if (event.ability.guid === SPELLS.BONE_SHIELD.id){
      this.currentBoneShieldBuffer += 1;
      this.currentBoneShieldStacks += 1;
    }
  }


  on_toPlayer_removebuff(event) {
    if (event.ability.guid === SPELLS.BONE_SHIELD.id){
      this.currentBoneShieldStacks = 0;
    }
  }

  on_toPlayer_removebuffstack(event) {
    if (event.ability.guid === SPELLS.BONE_SHIELD.id){
      this.currentBoneShieldBuffer = 0;
      this.currentBoneShieldStacks -= 1;
    }
  }

  on_byPlayer_cast(event) {
    if (event.ability.guid !== SPELLS.MARROWREND.id) {
      return;
    }

    //don't add to wasted casts if MR casts was at ~6sec left on BS duration
    if (this.BS_DURATION - (event.timestamp - this.lastMarrowrendCast) / 1000 <= this.REFRESH_AT_SECONDS) {
      this.refreshMRCasts += 1;
    } else {
      if (this.currentBoneShieldStacks - this.currentBoneShieldBuffer > this.REFRESH_AT_STACKS) {
        this.badMRCasts += 1;
        const wasted = this.MR_GAIN - this.currentBoneShieldBuffer;
        if (wasted > 0) {
          this.bsStacksWasted += wasted;
        }
      }
    }

    this.currentBoneShieldBuffer = 0;
    this.lastMarrowrendCast = event.timestamp;
    this.totalMRCasts += 1;
  }


  statistic() {

    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.MARROWREND.id} />}
        value={`${ this.badMRCasts } / ${ this.totalMRCasts }`}
        label="bad Marrowrend casts"
        tooltip={`${ this.refreshMRCasts } casts to refresh Bone Shield<br>
        ${ this.badMRCasts } casts with more than 6 stacks of Bone Shield wasting at least ${ this.bsStacksWasted } stacks<br>
        <br>
        Avoid casting Marrowrend unless you have 6 or less stacks or if Bone Shield has less than 6sec duration left.`}
      />

    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(2);
}

export default MarrowrendUsage;
