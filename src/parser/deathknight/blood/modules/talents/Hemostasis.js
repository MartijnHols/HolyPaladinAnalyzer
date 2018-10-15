import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatNumber } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';
import calculateEffectiveHealing from 'parser/core/calculateEffectiveHealing';

const MAX_BUFF_STACKS = 5;
const PERCENT_BUFF = 0.08;

class Hemostasis extends Analyzer {
  buffedDeathStrikes = 0;
  unbuffedDeathStrikes = 0;
  buffStack = 0;
  wastedBuffs = 0;
  gainedBuffs = 0;
  damage=0;
  heal=0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.HEMOSTASIS_TALENT.id);
  }

  on_byPlayer_heal(event) {
    if (event.ability.guid !== SPELLS.DEATH_STRIKE_HEAL.id) {
      return;
    }
    if(this.buffStack > 0){
      this.heal += calculateEffectiveHealing(event, PERCENT_BUFF * this.buffStack);
    }
  }

  on_byPlayer_damage(event) {
    const spellID = event.ability.guid;
    if (spellID !== SPELLS.DEATH_STRIKE.id && spellID !== SPELLS.BLOOD_BOIL.id) {
      return;
    }

    if (spellID === SPELLS.DEATH_STRIKE.id) {
      if(this.buffStack > 0){
        this.buffedDeathStrikes++;
        this.damage += calculateEffectiveDamage(event, PERCENT_BUFF * this.buffStack);
        this.buffStack = 0;
        return;
      }
      this.unbuffedDeathStrikes++;
    }

    if (spellID === SPELLS.BLOOD_BOIL.id) {
      if (this.buffStack === MAX_BUFF_STACKS) {
        this.wastedBuffs++;
      } else {
        this.buffStack++;
        this.gainedBuffs++;
      }
    }
  }


  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.HEMOSTASIS_TALENT.id} />}
        value={`${this.buffedDeathStrikes} / ${this.buffedDeathStrikes + this.unbuffedDeathStrikes}`}
        label="Death Strikes with Hemostasis"
        tooltip={`
          Resulting in ${formatNumber(this.damage)} additional damage and ${formatNumber(this.heal)} additional healing.<br/>
          You gained ${this.gainedBuffs} and wasted ${this.wastedBuffs} stacks.
        `}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(7);
}

export default Hemostasis;
