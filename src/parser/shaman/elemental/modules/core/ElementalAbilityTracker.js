// import SPELLS from 'common/SPELLS';

import AbilityTracker from 'parser/shared/modules/AbilityTracker';

class ElementalAbilityTracker extends AbilityTracker {
  on_byPlayer_cast(event) {
    super.on_byPlayer_cast(event);
    // const spellId = event.ability.guid;
    // const cast = this.getAbility(spellId, event.ability);
    // cast
    // TODO: add debuff/buff infos
  }
}

export default ElementalAbilityTracker;
