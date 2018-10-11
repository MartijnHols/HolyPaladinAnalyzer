import SPELLS from 'common/SPELLS/index';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import Analyzer from 'parser/core/Analyzer';

/**
 * Deepening Shadows
 * Your finishing moves reduce the remaining cooldown on Shadow Dance by 1.5 sec per combo point spent.
 */
class DeepeningShadows extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
  };

  cdrPerComboPoint = null;

  constructor(...args) {
    super(...args);
    this.cdrPerComboPoint = 1500 + (this.selectedCombatant.hasTalent(SPELLS.ENVELOPING_SHADOWS_TALENT.id) ? 1000 : 0);
  }

  on_byPlayer_spendresource(event) {
    const comboPointsSpent = event.resourceChange;
    if (event.resourceChangeType !== RESOURCE_TYPES.COMBO_POINTS.id) {
      return;
    }

    if (this.spellUsable.isOnCooldown(SPELLS.SHADOW_DANCE.id)) {
      this.spellUsable.reduceCooldown(SPELLS.SHADOW_DANCE.id, comboPointsSpent * this.cdrPerComboPoint);
    }
  }
}

export default DeepeningShadows;
