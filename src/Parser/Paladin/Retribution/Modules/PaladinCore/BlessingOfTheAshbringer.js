import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import Combatants from 'Parser/Core/Modules/Combatants';

import Module from 'Parser/Core/Module';

const debug = false;

class BlessingOfTheAshbringer extends Module {
	static dependencies = {
		combatants: Combatants,
	};

	on_initialized() {
		this.active = this.combatants.selected.traitsBySpellId[SPELLS.BLESSING_OF_THE_ASHBRINGER.id] > 0;
	}

	get wisdom() {
		return this.combatants.getBuffUptime(SPELLS.GREATER_BLESSING_OF_WISDOM.id) / this.owner.fightDuration;
	}

	get kings() {
		return this.combatants.getBuffUptime(SPELLS.GREATER_BLESSING_OF_KINGS.id) / this.owner.fightDuration;
	}

	get uptime() {
		const uptime = this.combatants.selected.getBuffUptime(SPELLS.BLESSING_OF_THE_ASHBRINGER_BUFF.id) / this.owner.fightDuration;
		//If Blessing of the Ashbringer is undef/NaN set it to be 
		//the lower of the uptimes between Kings and Wisdom
		if(!uptime){
			debug && console.log(this.wisdom, 'wis', this.kings, 'kings');
			return this.wisdom > this.kings ? this.kings : this.wisdom;
		}
		debug && console.log(uptime, 'Blessing of the Ashbringer');
		return uptime;
	}

	suggestions(when) {
		when(this.uptime).isLessThan(0.95)
			.addSuggestion((suggest, actual, recommended) => {
				return suggest(<span>Your <SpellLink id={SPELLS.BLESSING_OF_THE_ASHBRINGER.id} /> uptime is low. Make sure to apply <SpellLink id={SPELLS.GREATER_BLESSING_OF_WISDOM.id} /> and <SpellLink id={SPELLS.GREATER_BLESSING_OF_KINGS.id} /> before the fight starts.</span>)
					.icon(SPELLS.BLESSING_OF_THE_ASHBRINGER.icon)
					.actual(`${formatPercentage(this.uptime)}%`)
					.recommended(`${formatPercentage(recommended)}% is recommended`)
					.major(recommended);
			});
	}
}

export default BlessingOfTheAshbringer;