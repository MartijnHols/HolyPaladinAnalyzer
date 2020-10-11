import React from 'react';

import SPELLS from 'common/SPELLS';
import Events, { ApplyBuffEvent, CastEvent, HealEvent, RefreshBuffEvent, RemoveBuffEvent } from 'parser/core/Events';
import Analyzer, { SELECTED_PLAYER, Options } from 'parser/core/Analyzer';

import calculateEffectiveHealing from 'parser/core/calculateEffectiveHealing';

import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import ItemHealingDone from 'interface/ItemHealingDone';

/**
 * Using Healing stream totem/Cloudburst totem increases the healing of your next 3 healing surges, healing waves or riptides by x%
 */
class SwirlingCurrents extends Analyzer {

  healingBoost = 0;
  healing = 0;
  targetsWithBoostedRiptides: boolean[] = [];


  constructor(options: Options) {
    super(options);
    this.active = true;

    this.healingBoost = .2;//TODO Get from combat data when they EXPORT IT >:c

    this.addEventListener(Events.heal.by(SELECTED_PLAYER).spell([SPELLS.HEALING_SURGE_RESTORATION, SPELLS.HEALING_WAVE, SPELLS.RIPTIDE]), this.normalizeBoost);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.RIPTIDE), this.trackRiptide);
    this.addEventListener(Events.applybuff.by(SELECTED_PLAYER).spell(SPELLS.RIPTIDE), this.addRiptide);
    this.addEventListener(Events.removebuff.by(SELECTED_PLAYER).spell(SPELLS.RIPTIDE), this.removeRiptide);
    this.addEventListener(Events.refreshbuff.by(SELECTED_PLAYER).spell(SPELLS.RIPTIDE), this.pandemicRiptide);
  }

  normalizeBoost(event: HealEvent) {
    if (this.selectedCombatant.hasBuff(SPELLS.SWIRLING_CURRENTS_BUFF.id) || this.targetsWithBoostedRiptides[event.targetID]) {
      this.healing += calculateEffectiveHealing(event, this.healingBoost);
    }
  }

  addRiptide(event: ApplyBuffEvent) {
    const targetID = event.targetID;
    if (this.selectedCombatant.hasBuff(SPELLS.SWIRLING_CURRENTS_BUFF.id)) {
      this.targetsWithBoostedRiptides[targetID] = true;
    }
  }

  trackRiptide(event: CastEvent) {
    const targetID = event.targetID!;
    if (this.selectedCombatant.hasBuff(SPELLS.SWIRLING_CURRENTS_BUFF.id)) {
      this.targetsWithBoostedRiptides[targetID] = true;
    } else {
      delete this.targetsWithBoostedRiptides[targetID];
    }
  }

  removeRiptide(event: RemoveBuffEvent) {
    delete this.targetsWithBoostedRiptides[event.targetID];
  }

  pandemicRiptide(event: RefreshBuffEvent) {
    if (!this.selectedCombatant.hasBuff(SPELLS.SWIRLING_CURRENTS_BUFF.id)) {
      delete this.targetsWithBoostedRiptides[event.targetID];
    }
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(13)}
        size="flexible"
        category={STATISTIC_CATEGORY.COVENANTS}
      >
        <BoringSpellValueText spell={SPELLS.SWIRLING_CURRENTS}>
          <ItemHealingDone amount={this.healing} /><br />
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default SwirlingCurrents;
