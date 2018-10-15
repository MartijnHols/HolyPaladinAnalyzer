import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import Analyzer from 'parser/core/Analyzer';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import ItemDamageDone from 'interface/others/ItemDamageDone';

const MOARG_MODIFIER = 0.25;

const MS_BUFFER = 1000;

/**
* Equip: Throw Glaive deals 25% increased damage for each enemy hit.
**/

class MoargBionicStabiliziers extends Analyzer {
	static dependencies = {
		abilityTracker: AbilityTracker,
	};
	bonusDamage = 0;
	lastCastTimestamp = 0;
	enemiesHit = 0;
	damagePreCalc = 0;

	constructor(...args) {
    super(...args);
		this.active = this.selectedCombatant.hasWrists(ITEMS.MOARG_BIONIC_STABILIZERS.id);
	}

	get averageTargetsHit() {
    return (this.abilityTracker.getAbility(SPELLS.THROW_GLAIVE_HAVOC.id).damageHits / this.abilityTracker.getAbility(SPELLS.THROW_GLAIVE_HAVOC.id).casts).toFixed(2);
  }

	on_byPlayer_cast(event) {
		const spellId = event.ability.guid;
		if (spellId !== SPELLS.THROW_GLAIVE_HAVOC.id) {
			return;
		}
		this.casts++;
		this.lastCastTimestamp = event.timestamp;
    this.enemiesHit = 0;
    this.damagePreCalc = 0;
	}

	on_byPlayer_damage(event) {
		const spellId = event.ability.guid;
		if (this.lastCastTimestamp && (this.lastCastTimestamp + MS_BUFFER < event.timestamp) && this.damagePreCalc > 0) {
			const modifier = MOARG_MODIFIER * this.enemiesHit;
			this.bonusDamage += this.damagePreCalc - (this.damagePreCalc / (1 + modifier));
			this.lastCastTimestamp = null;
		}
		if (spellId !== SPELLS.THROW_GLAIVE_HAVOC.id) {
			return;
		}
		if ((this.lastCastTimestamp + MS_BUFFER) > event.timestamp && this.enemiesHit < 3) {
			this.damagePreCalc += event.amount + (event.absorbed || 0);
			this.enemiesHit++;
		}
	}

	item() {
		return {
			item: ITEMS.MOARG_BIONIC_STABILIZERS,
			result: (
				<dfn data-tip={`You hit an average of <b>${this.averageTargetsHit}</b> targets with throw glaive.`}>
					<ItemDamageDone amount={this.bonusDamage} />
				</dfn>
				),
		};
	}
}

export default MoargBionicStabiliziers;
