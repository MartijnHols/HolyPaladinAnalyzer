import React from 'react';

import Analyzer from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellLink from "common/SpellLink";
import ItemDamageDone from 'interface/others/ItemDamageDone';
import StatisticListBoxItem from 'interface/others/StatisticListBoxItem';

/**
 * A powerful shot which deals (112.5% of Attack power)% Physical damage to the target and up to [(112.5% of Attack power)% / (3)] Physical damage to all enemies between you and the target.
 *
 * Example log: https://www.warcraftlogs.com/reports/b9cpJyHBntAdaVLR#fight=6&type=damage-done
 */

class PiercingShot extends Analyzer {

  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.PIERCING_SHOT_TALENT.id);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.PIERCING_SHOT_TALENT.id) {
      return;
    }
    this.damage += event.amount + (event.absorbed || 0);
  }

  subStatistic() {
    return (
      <StatisticListBoxItem
        title={<SpellLink id={SPELLS.PIERCING_SHOT_TALENT.id} />}
        value={<ItemDamageDone amount={this.damage} />}
      />
    );
  }
}

export default PiercingShot;
