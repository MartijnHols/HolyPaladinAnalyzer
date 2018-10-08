import React from 'react';

import { formatNumber, formatThousands } from 'common/format';

import Analyzer from 'parser/core/Analyzer';

import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

import DamageValue from './DamageValue';

class DamageDone extends Analyzer {
  _total = new DamageValue();
  get total() {
    return this._total;
  }
  _byPet = {};
  byPet(petId) {
    if (!this._byPet[petId]) {
      return new DamageValue();
    }
    return this._byPet[petId];
  }
  get totalByPets() {
    return Object.keys(this._byPet)
      .map(petId => this._byPet[petId])
      .reduce((total, damageValue) => total.add(damageValue.regular, damageValue.absorbed, damageValue.blocked, damageValue.overkill), new DamageValue());
  }

  on_byPlayer_damage(event) {
    if (!event.targetIsFriendly) {
      this._total = this._total.add(event.amount, event.absorbed, event.blocked, event.overkill);
    }
  }
  on_byPlayerPet_damage(event) {
    if (!event.targetIsFriendly) {
      this._total = this._total.add(event.amount, event.absorbed, event.blocked, event.overkill);
      const petId = event.sourceID;
      this._byPet[petId] = this.byPet(petId).add(event.amount, event.absorbed, event.blocked, event.overkill);
    }
  }

  showStatistic = false;
  statistic() {
    if (!this.showStatistic) {
      return null;
    }

    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(0)}
        icon={(
          <img
            src="/img/sword.png"
            style={{ border: 0 }}
            alt="Sword"
          />
        )}
        value={`${formatNumber(this.total.effective / (this.owner.fightDuration / 1000))} DPS`}
        label="Damage done"
        tooltip={`Total damage done: <b>${formatThousands(this.total.effective)}</b> ${this.totalByPets.effective ? `<br>Contribution from pets: ${this.owner.formatItemDamageDone(this.totalByPets.effective)}` : ''}`}
      />
    );
  }
}

export default DamageDone;
