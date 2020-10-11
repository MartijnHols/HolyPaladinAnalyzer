import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import TraitStatisticBox, { STATISTIC_ORDER } from 'interface/others/TraitStatisticBox';
import { calculateAzeriteEffects } from 'common/stats';
import { formatPercentage } from 'common/format';
import StatTracker from 'parser/shared/modules/StatTracker';

export function masterfulInstinctsStats(combatant) {
  if (!combatant.hasTrait(SPELLS.MASTERFUL_INSTINCTS.id)) {
    return 0;
  }

  const [ mastery, armor ] = combatant.traitsBySpellId[SPELLS.MASTERFUL_INSTINCTS.id]
    .reduce(([ masteryTotal, armorTotal ], ilevel) => ([
      (masteryTotal) + calculateAzeriteEffects(SPELLS.MASTERFUL_INSTINCTS.id, ilevel)[0],
      (armorTotal) + calculateAzeriteEffects(SPELLS.MASTERFUL_INSTINCTS.id, ilevel)[1],
    ]), [0, 0]);

  return { mastery, armor };
}

class MasterfulInstincts extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  mastery = 0;
  armor = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTrait(SPELLS.MASTERFUL_INSTINCTS.id);

    if (!this.active) {return;}
    const { mastery, armor } = masterfulInstinctsStats(this.selectedCombatant);
    this.mastery = mastery;
    this.armor = armor;

    this.statTracker.add(SPELLS.MASTERFUL_INSTINCTS_BUFF.id, { mastery, armor });
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.MASTERFUL_INSTINCTS_BUFF.id) / this.owner.fightDuration;
  }

  get averageMastery() {
    return this.uptime * this.mastery;
  }

  get averageArmor() {
    return this.uptime * this.armor;
  }

  statistic() {
    return (
      <TraitStatisticBox
        position={STATISTIC_ORDER.OPTIONAL()}
        trait={SPELLS.MASTERFUL_INSTINCTS.id}
        value={(
          <>
            {formatPercentage(this.uptime.toFixed(2))}% Uptime<br />
            {this.averageMastery.toFixed(0)} average Mastery<br />
            {this.averageArmor.toFixed(0)} average Armor
          </>
        )}
      />
    );
  }
}

export default MasterfulInstincts;
