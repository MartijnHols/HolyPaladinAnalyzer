import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';

class Pet extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  _damageDone = 0;
  _sourceId = null;
  _pets = {}

  on_initialized() {
    this._pets = this.owner.report.friendlyPets.filter(pet => pet.petOwner === this.owner.player.id);

    if (this._pet !== undefined) {
      const pet = this.fetchPet(this._pet);
      if (pet) this._sourceId = pet.id;
    }
  }

  on_damage(event) {
    if (this._sourceId !== undefined && event.sourceID === this._sourceId) {
      this._damageDone += event.amount;
    }
  }

  get fetchPets() {
    return this._pets;
  }

  get damageDone() {
    return this._damageDone;
  }

  fetchPet(pet) {
    return this.fetchPets.find(_pet => _pet.guid === pet.id);
  }
}

export default Pet;
