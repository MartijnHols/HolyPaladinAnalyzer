import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';

//WCL https://www.warcraftlogs.com/reports/rz6WxLbAmTgnFXQP/#fight=3&source=3
class Gluttony extends Analyzer {

  buffCasts = 0;
  metaCast = 0;


  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.GLUTTONY_TALENT.id);
  }

  on_toPlayer_applybuff(event) {
    if (event.ability.guid !== SPELLS.METAMORPHOSIS_TANK.id) {
      return;
    }
    this.buffCasts += 1;
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.METAMORPHOSIS_TANK.id) {
      return;
    }
    this.metaCast += 1;
  }


  get gluttonyProcs(){
    return this.buffCasts - this.metaCast;
  }


  statistic() {
    return (
      <TalentStatisticBox
        position={STATISTIC_ORDER.CORE(7)}
        icon={<SpellIcon id={SPELLS.GLUTTONY_TALENT.id} />}
        value={`${this.gluttonyProcs}`}
        label="Gluttony procs"
      />
    );
  }
}

export default Gluttony;
