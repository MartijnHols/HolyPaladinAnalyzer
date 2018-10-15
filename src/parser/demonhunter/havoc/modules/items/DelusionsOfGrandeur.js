import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';
import { formatNumber, formatPercentage, formatDuration } from 'common/format';
import SUGGESTION_IMPORTANCE from 'parser/core/ISSUE_IMPORTANCE';

import Analyzer from 'parser/core/Analyzer';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import FuryTracker from '../resourcetracker/FuryTracker';

/*
* Equip: The remaining cooldown on Metamorphosis is reduced by 1 sec for every 30 Fury you spend.
*/

class DelusionsOfGrandeur extends Analyzer {
	static dependencies = {
		SpellUsable: SpellUsable,
		furyTracker: FuryTracker,
		abilityTracker: AbilityTracker,
	};

	metaCooldown = 300;
	lastTimestamp = 0;
	halfMetaDuration = 15000;

	constructor(...args) {
    super(...args);
		this.active = this.selectedCombatant.hasShoulder(ITEMS.DELUSIONS_OF_GRANDEUR.id);
	}

	get cooldownReductionRatio(){
		const CDRPerMeta = this.furyTracker.cooldownReduction / this.abilityTracker.getAbility(SPELLS.METAMORPHOSIS_HAVOC.id).casts;
		return (this.metaCooldown - CDRPerMeta) / this.metaCooldown;
	}

	get metaCooldownWithShoulders(){
		return this.metaCooldown * this.cooldownReductionRatio || 1;
	}

	on_byPlayer_cast(event) {
		const spellId = event.ability.guid;
		if(spellId !== SPELLS.METAMORPHOSIS_HAVOC.id) {
			return;
		}
		this.lastTimestamp = event.timestamp;
	}

	get suggestionThresholds() {
    return { //This makes sure you are getting at least half of your meta off to make the shoulders worth it to wear
      actual: (this.owner.fightDuration / 1000 < this.metaCooldownWithShoulders && this.owner.fight.end_time - this.lastTimestamp < this.halfMetaDuration) || this.abilityTracker.getAbility(SPELLS.METAMORPHOSIS_HAVOC.id).casts < 2,
      isEqual: true,
      style: 'boolean',
    };
  }

  suggestions(when) {
  	when(this.suggestionThresholds).addSuggestion((suggest) =>{
  		return suggest(
  			<>The fight duration of {formatDuration(this.owner.fightDuration / 1000)} minutes was shorter than your cooldown on <SpellLink id={SPELLS.METAMORPHOSIS_HAVOC.id} icon /> ({formatDuration(this.metaCooldownWithShoulders)} minutes). <ItemLink id={ITEMS.DELUSIONS_OF_GRANDEUR.id} icon /> are only useful if you get and extra cast of <SpellLink id={SPELLS.METAMORPHOSIS_HAVOC.id} icon />.</>
  		)
  		.icon(ITEMS.DELUSIONS_OF_GRANDEUR.icon)
  		.staticImportance(SUGGESTION_IMPORTANCE.REGULAR);
  	});
  }

	item() {
		return {
			item: ITEMS.DELUSIONS_OF_GRANDEUR,
			result:(
				<dfn data-tip={`You had ${formatNumber(this.furyTracker.cooldownReduction)} seconds of cooldown reduction, ${formatNumber(this.furyTracker.cooldownReductionWasted)} seconds of which were wasted.`}>
					<>
						Reduced the cooldown of <SpellLink id={SPELLS.METAMORPHOSIS_HAVOC.id} icon /> by {formatPercentage(this.cooldownReductionRatio)}% ({formatDuration(this.metaCooldown)} minutes to {formatDuration(this.metaCooldownWithShoulders)} minutes on average)
					</>
				</dfn>
			),
		};
	}
}
export default DelusionsOfGrandeur;
