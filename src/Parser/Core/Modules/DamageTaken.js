import React from 'react';
import { formatThousands, formatNumber, formatPercentage } from 'common/format';

import SPELLS from 'common/SPELLS';
import MAGIC_SCHOOLS from 'common/MAGIC_SCHOOLS';

import Analyzer from 'Parser/Core/Analyzer';

import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';

import DamageValue from './DamageValue';

class DamageTaken extends Analyzer {
  static IGNORED_ABILITIES = [
    SPELLS.SPIRIT_LINK_TOTEM_REDISTRIBUTE.id,
  ];

  _total = new DamageValue(); // consider this "protected", so don't change this from other modules. If you want special behavior you must add that code to an extended version of this module.
  get total() {
    return this._total;
  }

  _byAbility = {};
  byAbility(spellId) {
    if (!this._byAbility[spellId]) {
      return new DamageValue(0, 0, 0);
    }
    return this._byAbility[spellId];
  }

  _byMagicSchool = {};
  byMagicSchool(magicSchool) {
    if (!this._byMagicSchool[magicSchool]) {
      return new DamageValue(0, 0, 0);
    }
    return this._byMagicSchool[magicSchool];
  }

  on_toPlayer_damage(event) {
    this._addDamage(event.ability, event.amount, event.absorbed, event.overkill);
  }

  _addDamage(ability, amount = 0, absorbed = 0, overkill = 0) {
    const spellId = ability.guid;
    if (this.constructor.IGNORED_ABILITIES.indexOf(spellId) !== -1) {
      // Some player abilities (mostly of healers) cause damage as a side-effect, these shouldn't be included in the damage taken.
      return;
    }
    this._total = this._total.add(amount, absorbed, overkill);

    if (this._byAbility[spellId]) {
      this._byAbility[spellId] = this._byAbility[spellId].add(amount, absorbed, overkill);
    } else {
      this._byAbility[spellId] = new DamageValue(amount, absorbed, overkill);
    }

    const magicSchool = ability.type;
    if (this._byMagicSchool[magicSchool]) {
      this._byMagicSchool[magicSchool] = this._byMagicSchool[magicSchool].add(amount, absorbed, overkill);
    } else {
      this._byMagicSchool[magicSchool] = new DamageValue(amount, absorbed, overkill);
    }
  }
  _subtractDamage(ability, amount = 0, absorbed = 0, overkill = 0) {
    return this._addDamage(ability, -amount, -absorbed, -overkill);
  }

  showStatistic = false;
  statistic() {
    // TODO: Add a bar showing magic schools
    return this.showStatistic && (
      <StatisticBox
        icon={(
          <img
            src="/img/shield.png"
            style={{ border: 0 }}
            alt="Shield"
          />
        )}
        value={`${formatNumber(this.total.raw / this.owner.fightDuration * 1000)} DTPS`}
        label="Damage taken"
        tooltip={
          `The total damage taken was ${formatThousands(this.total.effective)} (${formatThousands(this.total.overkill)} overkill).`
        }
        footer={(
          <div className="statistic-bar">
            {Object.keys(this._byMagicSchool)
              .map(type => {
                const effective = this._byMagicSchool[type].effective;
                return (
                  <div
                    key={type}
                    className={`spell-school-${type}-bg`}
                    style={{ width: `${effective / this.total.effective * 100}%` }}
                    data-tip={
                      `Damage taken by magic school:
                      <ul>
                        ${Object.keys(this._byMagicSchool)
                          .map(type => `<li><b>${MAGIC_SCHOOLS.names[type] || 'Unknown'}</b>: ${formatThousands(this._byMagicSchool[type].effective)} (${formatPercentage(this._byMagicSchool[type].effective / this.total.effective)}%)</li>`)
                          .join('')}
                      </ul>`
                    }
                  />
                );
              })}
          </div>
        )}
        footerStyle={{ overflow: 'hidden' }}
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(0);
}

export default DamageTaken;
