import React from 'react';

import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import ItemDamageDone from 'interface/others/ItemDamageDone';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import Analyzer from 'parser/core/Analyzer';
import calculateEffectiveDamage from 'parser/core/calculateEffectiveDamage';

import { ABILITIES_AFFECTED_BY_POISON_DAMAGE_INCREASES } from '../../constants';

const DAMAGE_BONUS = 0.3;

class MasterPoisoner extends Analyzer {

  bonusDmg = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.MASTER_POISONER_TALENT.id);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (!ABILITIES_AFFECTED_BY_POISON_DAMAGE_INCREASES.includes(spellId)) {
      return;
    }
    this.bonusDmg += calculateEffectiveDamage(event, DAMAGE_BONUS);
  }

  statistic() {
    return (
      <TalentStatisticBox
        position={STATISTIC_ORDER.OPTIONAL(1)}
        icon={<SpellIcon id={SPELLS.MASTER_POISONER_TALENT.id} />}
        value={<ItemDamageDone amount={this.bonusDmg} />}
        label="Master Poisoner"
      />
    );
  }

}

export default MasterPoisoner;
