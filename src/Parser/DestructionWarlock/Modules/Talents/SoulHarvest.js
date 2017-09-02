import Module from 'Parser/Core/Module';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';

import getDamageBonus from '../WarlockCore/getDamageBonus';

const SOUL_HARVEST_DAMAGE_BONUS = .2;

class SoulHarvest extends Module {
  talentBonusDmg = 0;
  chestBonusDmg = 0;

  petIds = [];
  isFromTalent = false;

  addToCorrectSource(bonusDmg) {
    if (this.isFromTalent) {
      this.talentBonusDmg += bonusDmg;
    }
    else {
      this.chestBonusDmg += bonusDmg;
    }
  }

  on_initialized() {
    if (!this.owner.error) {
      this.active = this.owner.selectedCombatant.hasTalent(SPELLS.SOUL_HARVEST_TALENT.id) || this.owner.selectedCombatant.hasChest(ITEMS.THE_MASTER_HARVESTER.id);
    }
    this.owner.report.friendlyPets.filter(pet => pet.petOwner === this.owner.playerId).forEach(pet => {
      if (this.petIds.indexOf(pet.id) === -1) {
        this.petIds.push(pet.id);
      }
    });
  }

  on_damage(event) {
    if (this.petIds.indexOf(event.sourceID) === -1) {
      return;
    }
    if (this.owner.selectedCombatant.hasBuff(SPELLS.SOUL_HARVEST.id, event.timestamp)) {
      this.addToCorrectSource(getDamageBonus(event, SOUL_HARVEST_DAMAGE_BONUS));
    }
  }

  on_byPlayer_damage(event) {
    if (this.owner.selectedCombatant.hasBuff(SPELLS.SOUL_HARVEST.id, event.timestamp)) {
      this.addToCorrectSource(getDamageBonus(event, SOUL_HARVEST_DAMAGE_BONUS));
    }
  }

  on_byPlayer_cast(event) {
    if (event.ability.guid === SPELLS.SOUL_HARVEST.id) {
      this.isFromTalent = true;
    }
  }

  on_byPlayer_removebuff(event) {
    // Soul Harvest from the talent dropped off, so if any SH is present while this is false, it means it's a legendary proc
    if (event.ability.guid === SPELLS.SOUL_HARVEST.id && this.isFromTalent) {
      this.isFromTalent = false;
    }
  }

  on_byPlayer_refreshbuff(event) {
    // if the buff gets refreshed, it can't happen from the talent itself (it has 2 minute cooldown)
    // therefore the buff is now from the chest (if it prolonged the duration or overwritten it doesn't matter, all I care about is the source)
    if (event.ability.guid === SPELLS.SOUL_HARVEST.id && this.isFromTalent) {
      this.isFromTalent = false;
    }
  }
}

export default SoulHarvest;
