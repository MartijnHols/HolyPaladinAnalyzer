import SPELLS from 'common/SPELLS';
import Analyzer from 'parser/core/Analyzer';
import SpellUsable from 'parser/shared/modules/SpellUsable';

const ABILITY_RESETS = [
	SPELLS.ICE_BARRIER.id,
	SPELLS.FROST_NOVA.id,
	SPELLS.CONE_OF_COLD.id,
	SPELLS.ICE_BLOCK.id,
  ];

class ColdSnap extends Analyzer {
	static dependencies = {
		spellUsable: SpellUsable,
	}

  	on_byPlayer_cast(event) {
		const spellId = event.ability.guid;
		if(spellId !== SPELLS.COLD_SNAP.id) {
			return;
		}
		ABILITY_RESETS.forEach(spell => {
			if (this.spellUsable.isOnCooldown(spell)) { this.spellUsable.endCooldown(spell); }
		});
  }
}

export default ColdSnap;
