import React from 'react';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import ItemHealingDone from 'interface/ItemHealingDone';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import { STATISTIC_ORDER } from 'interface/others/TraitStatisticBox';
import Events, { BeaconHealEvent, HealEvent } from 'parser/core/Events';

import GlimmerOfLight, {
  GLIMMER_CAP_8_3,
  IS_IT_8_3_YET,
} from './GlimmerOfLight';
import BeaconHealSource from '../beacons/BeaconHealSource';

const GLIMMER_OF_LIGHT_HEALING_NERF = 0.12;

class GlimmerOfLightNerf extends Analyzer {
  static dependencies = {
    glimmerOfLight: GlimmerOfLight,
    beaconHealSource: BeaconHealSource,
  };

  private glimmerOfLight!: GlimmerOfLight;
  private beaconHealSource!: BeaconHealSource;

  actualHealing = 0;
  overCapHealing = 0;
  healingReductionHealing = 0;

  constructor(options: any) {
    super(options);
    this.active =
      !IS_IT_8_3_YET &&
      this.selectedCombatant.hasTrait(SPELLS.GLIMMER_OF_LIGHT_TRAIT.id);
    if (!this.active) {
      return;
    }
    this.addEventListener(
      Events.heal.by(SELECTED_PLAYER).spell(SPELLS.GLIMMER_OF_LIGHT),
      this.onHeal,
    );
    this.addEventListener(
      options.beaconHealSource.beacontransfer.by(SELECTED_PLAYER),
      this.onBeaconTransfer,
    );
  }

  onHeal(event: HealEvent) {
    const index = this.glimmerOfLight.glimmerBuffs.findIndex(
      buff => buff.targetID === event.targetID,
    );
    const glimmerNo = index + 1;
    const effective = event.amount + (event.absorbed || 0);
    this.actualHealing += effective;
    if (glimmerNo > GLIMMER_CAP_8_3) {
      this.overCapHealing += effective;
    } else {
      const raw = effective + (event.overheal || 0);
      const rawAfterNerf = raw * (1 - GLIMMER_OF_LIGHT_HEALING_NERF);
      // rawAfterNerf may be more than effective, anything extra will have been
      // overhealing. When that happens, the nerf had 0 impact.
      const healingLost = Math.max(0, effective - rawAfterNerf);
      this.healingReductionHealing += healingLost;
    }
  }
  onBeaconTransfer(event: BeaconHealEvent) {
    const spellId = event.originalHeal.ability.guid;
    if (spellId !== SPELLS.GLIMMER_OF_LIGHT.id) {
      return;
    }
    const index = this.glimmerOfLight.glimmerBuffs.findIndex(
      buff => buff.targetID === event.originalHeal.targetID,
    );
    const glimmerNo = index + 1;
    const effective = event.amount + (event.absorbed || 0);
    if (glimmerNo > GLIMMER_CAP_8_3) {
      this.overCapHealing += effective;
    } else {
      const raw = effective + (event.overheal || 0);
      const rawAfterNerf = raw * (1 - GLIMMER_OF_LIGHT_HEALING_NERF);
      // rawAfterNerf may be more than effective, anything extra will have been
      // overhealing. When that happens, the nerf had 0 impact.
      const healingLost = Math.max(0, effective - rawAfterNerf);
      this.healingReductionHealing += healingLost;
    }
  }

  statistic() {
    return (
      <Statistic
        category={STATISTIC_CATEGORY.ITEMS}
        position={STATISTIC_ORDER.OPTIONAL()}
        size="flexible"
        tooltip={
          <>
            The max amount of healing the Glimmer of Light nerfs will have made
            you lose out on for this fight. This will be noticeably lower due to
            getting better targets for Holy Shock and reduced overhealing on
            Glimmer and other spells.
            <br />
            <br />
            The 12% healing reduction prediction accounts for overhealing. The
            nerf is to the raw healing and a big part of the nerf is irrelevant
            as it will have been overhealing.
            <br />
            <br />
            The lost beacon transfer is accounted for in both stats.
          </>
        }
        drilldown="https://questionablyepic.com/glimmer-8-3/"
      >
        <div className="pad" style={{ lineHeight: 1.4 }}>
          <label>
            <SpellLink id={SPELLS.GLIMMER_OF_LIGHT.id} /> nerf prediction
          </label>

          <div className="value">
            <small>Lost due to target cap:</small>
            <br />
            <ItemHealingDone amount={this.overCapHealing} lessThan />
            <br />
            <small>Lost due to 12% healing reduction:</small>
            <br />
            <ItemHealingDone amount={this.healingReductionHealing} lessThan />
            <br />
            <small>Total:</small>
            <br />
            <ItemHealingDone
              amount={this.overCapHealing + this.healingReductionHealing}
              lessThan
            />
          </div>
        </div>
      </Statistic>
    );
  }
}

export default GlimmerOfLightNerf;
