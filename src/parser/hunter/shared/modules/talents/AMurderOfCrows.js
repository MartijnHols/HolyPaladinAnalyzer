import React from 'react';

import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';

import SpellUsable from 'parser/shared/modules/SpellUsable';
import SpellLink from 'common/SpellLink';
import ItemDamageDone from 'interface/others/ItemDamageDone';
import StatisticListBoxItem from 'interface/others/StatisticListBoxItem';
import { encodeTargetString } from 'parser/shared/modules/EnemyInstances';

/**
 * Summons a flock of crows to attack your target over the next 15 sec. If the target dies while under attack, A Murder of Crows' cooldown
 * is reset.
 *
 * Example log: https://www.warcraftlogs.com/reports/8jJqDcrGK1xM3Wn6#fight=2&type=damage-done
 */

const CROWS_TICK_RATE = 1000;
const MS_BUFFER = 100;
const CROWS_DURATION = 15000;

class AMurderOfCrows extends Analyzer {

  static dependencies = {
    spellUsable: SpellUsable,
  };

  bonusDamage = 0;
  casts = 0;
  enemyID = null;
  applicationTimestamp = null;
  lastDamageTick = null;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.A_MURDER_OF_CROWS_TALENT.id);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.A_MURDER_OF_CROWS_TALENT.id) {
      return;
    }
    this.casts++;
    this.enemyID = encodeTargetString(event.targetID, event.targetInstance);
    this.applicationTimestamp = event.timestamp;
    this.lastDamageTick = null;
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (this.lastDamageTick && event.timestamp + MS_BUFFER < this.applicationTimestamp + CROWS_DURATION && event.timestamp > this.lastDamageTick + CROWS_TICK_RATE + MS_BUFFER && this.spellUsable.isOnCooldown(SPELLS.A_MURDER_OF_CROWS_TALENT.id)) {
      this.spellUsable.endCooldown(SPELLS.A_MURDER_OF_CROWS_TALENT.id, event.timestamp);
      this.lastDamageTick = null;
      this.enemyID = null;
    }
    if (spellId !== SPELLS.A_MURDER_OF_CROWS_DEBUFF.id) {
      return;
    }
    if (!this.enemyID) {
      this.enemyID = encodeTargetString(event.targetID, event.targetInstance);
    }
    if (this.casts === 0) {
      this.casts++;
      this.spellUsable.beginCooldown(SPELLS.A_MURDER_OF_CROWS_TALENT.id, this.owner.fight.start_time);
      this.applicationTimestamp = this.owner.fight.start_time;
    }
    this.lastDamageTick = event.timestamp;
    this.bonusDamage += event.amount + (event.absorbed || 0);
  }

  subStatistic() {
    return (
      <StatisticListBoxItem
        title={<SpellLink id={SPELLS.A_MURDER_OF_CROWS_TALENT.id} />}
        value={<ItemDamageDone amount={this.bonusDamage} />}
      />
    );
  }
}

export default AMurderOfCrows;
