import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';
import { formatNumber } from 'common/format';
import Analyzer from 'parser/core/Analyzer';
import SpellUsable from 'parser/shared/modules/SpellUsable';

const COOLDOWN_REDUCTION_MS = 300;

class RaddonsCascadingEyes extends Analyzer {
	static dependencies = {
		spellUsable: SpellUsable,
	};

	effectiveEyeBeamReduction = 0;
	wastedEyeBeamReduction = 0;

	constructor(...args) {
    super(...args);
		this.active = this.selectedCombatant.hasHead(ITEMS.RADDONS_CASCADING_EYES.id);
	}

	on_byPlayer_damage(event) {
		const spellId = event.ability.guid;
		if(spellId !== SPELLS.EYE_BEAM_DAMAGE.id){
			return;
		}
		const eyeBeamIsOnCooldown = this.spellUsable.isOnCooldown(SPELLS.EYE_BEAM.id);
		if(eyeBeamIsOnCooldown) {
			const reductionMs = this.spellUsable.reduceCooldown(SPELLS.EYE_BEAM.id, COOLDOWN_REDUCTION_MS);
			this.effectiveEyeBeamReduction += reductionMs;
		}
		else {
			this.wastedEyeBeamReduction += COOLDOWN_REDUCTION_MS;
		}
	}

	item() {
		return {
			item: ITEMS.RADDONS_CASCADING_EYES,
			result: (
				<dfn data-tip={`You wasted ${formatNumber(this.wastedEyeBeamReduction / 1000)} seconds of CDR.<br/>`}>
					reduced <SpellLink id={SPELLS.EYE_BEAM.id} icon /> cooldown by {formatNumber(this.effectiveEyeBeamReduction / 1000)}s in total
				</dfn>
			),
		};
	}
}

export default RaddonsCascadingEyes;
