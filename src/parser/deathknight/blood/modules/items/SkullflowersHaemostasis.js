import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS/index';
import ITEMS from 'common/ITEMS';
import ItemDamageDone from 'interface/others/ItemDamageDone';
import ItemHealingDone from 'interface/others/ItemHealingDone';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';
import calculateEffectiveHealing from 'parser/core/calculateEffectiveHealing';

const MAX_BUFF_STACKS = 5;
const PERCENT_BUFF=0.2;

class SkullflowersHaemostasis extends Analyzer {

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasShoulder(ITEMS.SKULLFLOWERS_HAEMOSTASIS.id);
  }

  buffStack = 0;
  wastedBuff = 0;
  damage=0;
  heal=0;

  on_byPlayer_cast(event){
    if (event.ability.guid === SPELLS.BLOOD_BOIL.id) {
      return;
    }
    if(this.selectedCombatant.hasBuff(SPELLS.DANCING_RUNE_WEAPON.id) && this.buffStack + 3 > MAX_BUFF_STACKS){
      this.wastedBuff += MAX_BUFF_STACKS - (3 + this.buffStack);
    } else if(this.buffStack === MAX_BUFF_STACKS) {
      this.wastedBuff += 1;
    }
  }

  on_byPlayer_applybuff(event) {
    if (event.ability.guid === SPELLS.HAEMOSTASIS_BUFF.id) {
      this.buffStack = 1;
    }
  }

  on_byPlayer_applybuffstack(event) {
    if (event.ability.guid !== SPELLS.HAEMOSTASIS_BUFF.id) {
      return;
    }
    this.buffStack = event.stack;
  }

  on_byPlayer_heal(event) {
    if (event.ability.guid !== SPELLS.DEATH_STRIKE_HEAL.id) {
      return;
    }
    if(this.buffStack > 0){
      this.heal += calculateEffectiveHealing(event,PERCENT_BUFF * this.buffStack);
    }
  }

  on_byPlayer_damage(event) {
    if (event.ability.guid !== SPELLS.DEATH_STRIKE.id) {
      return;
    }
    if(this.buffStack > 0){
      this.damage += calculateEffectiveDamage(event,PERCENT_BUFF * this.buffStack);
      this.buffStack = 0;
    }
  }

  statistic() {
    return {
      item: ITEMS.SKULLFLOWERS_HAEMOSTASIS,
      result:(
        <>
          <ItemDamageDone amount={this.damage} /><br />
          <ItemHealingDone amount={this.heal} /><br />
          Overcapped {this.wastedBuff} times
        </>
      ),
    };
  }
}

export default SkullflowersHaemostasis;
