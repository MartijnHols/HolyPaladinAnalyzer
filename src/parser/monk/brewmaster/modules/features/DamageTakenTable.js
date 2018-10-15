import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import DamageTakenTableComponent, { MITIGATED_MAGICAL, MITIGATED_PHYSICAL, MITIGATED_UNKNOWN } from 'interface/others/DamageTakenTable';
import Tab from 'interface/others/Tab';
import SPELLS from 'common/SPELLS';
import SPECS from 'game/SPECS';
import SpellLink from 'common/SpellLink';

import HighTolerance from '../spells/HighTolerance';
import DamageTaken from '../core/DamageTaken';

const MIN_CLASSIFICATION_AMOUNT = 100;

class DamageTakenTable extends Analyzer {
  static dependencies = {
    ht: HighTolerance,
    dmg: DamageTaken,
  };

  // additive increase of 5% while isb is up
  abilityData = {}; // contains `ability` and `mitigatedAs`

  get tableData() {
    const vals = Object.values(this.abilityData)
      .map(raw => {
        const value = this.dmg.byAbility(raw.ability.guid);
        const staggered = this.dmg.staggeredByAbility(raw.ability.guid);
        // console.log(staggered);
        return { totalDmg: value.effective + staggered, largestSpike: value.largestHit, ...raw };
      });
    vals.sort((a, b) => b.largestSpike - a.largestSpike);
    return vals;
  }

  constructor(...args) {
    super(...args);
    this.active = false;
  }

  on_toPlayer_damage(event) {
    if (event.ability.guid === SPELLS.STAGGER_TAKEN.id) {
      return;
    }
    if (event.amount === 0) {
      return;
    }
    const mitigatedAs = this._classifyMitigation(event);
    this._addToAbility(event.ability, mitigatedAs);
  }

  _addToAbility(ability, mitigationType) {
    const spellId = ability.guid;
    if (!this.abilityData[spellId]) {
      this.abilityData[spellId] = {
        mitigatedAs: mitigationType,
        ability: ability,
      };
      return;
    }

    const curMitAs = this.abilityData[spellId].mitigatedAs;
    this.abilityData[spellId].mitigatedAs = this._minMitigationType(curMitAs, mitigationType);
  }

  _minMitigationType(a, b) {
    return Math.min(a, b);
  }

  _classifyMitigation(event) {
    if (event.absorbed + event.amount <= MIN_CLASSIFICATION_AMOUNT) {
      return MITIGATED_UNKNOWN;
    }
    // additive increase of 35%
    const isbActive = this.selectedCombatant.hasBuff(SPELLS.IRONSKIN_BREW_BUFF.id);
    // additive increase of 10%
    const fbActive = this.selectedCombatant.hasBuff(SPELLS.FORTIFYING_BREW_BRM.id);
    // additive increase of 10%
    const hasHT = this.ht.active;

    const physicalStaggerPct = 0.4 + hasHT * 0.1 + isbActive * 0.35 + fbActive * 0.1;
    const actualPct = event.absorbed / (event.absorbed + event.amount);

    // multiply by 0.95 to allow for minor floating-point / integer
    // division error
    if (actualPct >= physicalStaggerPct * 0.95) {
      return MITIGATED_PHYSICAL;
    } else {
      return MITIGATED_MAGICAL;
    }
  }

  tab() {
    return {
      title: 'Damage Taken by Ability',
      url: 'damage-taken-by-ability',
      render: () => (
        <Tab>
          <DamageTakenTableComponent
            data={this.tableData}
            spec={SPECS[this.selectedCombatant.specId]}
            total={this.dmg.total.effective} />
          <div style={{ padding: '10px' }}>
            <strong>Note:</strong> Damage taken includes all damage put into the <SpellLink id={SPELLS.STAGGER_TAKEN.id} /> pool.
          </div>
        </Tab>
      ),
    };
  }
}

export default DamageTakenTable;
