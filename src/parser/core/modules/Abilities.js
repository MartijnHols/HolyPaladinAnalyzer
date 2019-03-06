import Module from 'parser/core/Module';

import Ability from './Ability';
import AbilityTracker from '../../shared/modules/AbilityTracker';
import Haste from '../../shared/modules/Haste';

/**
 * @property {AbilityTracker} abilityTracker
 * @property {Haste} haste
 */
class Abilities extends Module {
  static dependencies = {
    abilityTracker: AbilityTracker,
    haste: Haste,
  };
  static SPELL_CATEGORIES = {
    ROTATIONAL: 'Rotational Spell',
    ROTATIONAL_AOE: 'Spell (AOE)',
    ITEMS: 'Item',
    COOLDOWNS: 'Cooldown',
    DEFENSIVE: 'Defensive Cooldown',
    SEMI_DEFENSIVE: 'Offensive & Defensive Cooldown',
    OTHERS: 'Spell',
    UTILITY: 'Utility',
    HEALER_DAMAGING_SPELL: 'Damaging Spell',
    CONSUMABLE: 'Consumable',
    HIDDEN: 'Hidden',
  };
  static ABILITY_CLASS = Ability;

  /**
   * This will be called *once* during initialization. See the Ability class for the available properties. This should contain ALL spells available to a player of your spec, including utility such as interrupts, dispells, etc
   * @returns {object[]}
   */
  spellbook() {
    // This list will NOT be recomputed during the fight. If a cooldown changes based on something like Haste or a Buff you need to put it in a function.
    // While you can put checks for talents/traits outside of the cooldown prop, you generally should aim to keep everything about a single spell together. In general only move a prop up if you're regularly checking for the same talent/trait in multiple spells.
    return [];
  }

  abilities = [];
  activeAbilities = [];
  constructor(...args) {
    super(...args);
    this.loadSpellbook(this.spellbook());
  }
  loadSpellbook(spellbook) {
    this.abilities = spellbook.map(options => new this.constructor.ABILITY_CLASS(this, options));
    this.activeAbilities = this.abilities.filter(ability => ability.enabled);
  }

  /**
   * Add an ability to the list of active abilities.
   * @param {object} options An object with all the properties and their values that gets passed to the Ability class.
   */
  add(options) {
    const ability = new this.constructor.ABILITY_CLASS(this, options);
    this.abilities.push(ability);
    this.activeAbilities.push(ability);
  }

  /**
   * Returns the first ACTIVE spellInfo with the given spellId (or undefined if there is no such spellInfo)
   *
   * @return {Ability}
   */
  getAbility(spellId) {
    const ability = this.activeAbilities.find(ability => {
      if (ability.spell instanceof Array) {
        return ability.spell.some(spell => spell.id === spellId);
      } else {
        return ability.spell.id === spellId;
      }
    });

    if(ability && ability.spell instanceof Array && ability.primaryOverride === null) {
      ability.primaryOverride = ability.spell.findIndex((spell) => { return spell.id === spellId; });
    }

    return ability;
  }

  /**
   * Returns the expected cooldown (in seconds) of the given spellId at the current timestamp (or undefined if there is no such spellInfo)
   */
  getExpectedCooldownDuration(spellId, cooldownTriggerEvent) {
    const ability = this.getAbility(spellId);
    return ability ? Math.round(ability.getCooldown(this.haste.current, cooldownTriggerEvent) * 1000) : undefined;
  }

  /**
   * Returns the max charges of the given spellId, or 1 if the spell doesn't have charges (or undefined if there is no such spellInfo)
   */
  getMaxCharges(spellId) {
    const ability = this.getAbility(spellId);
    return ability ? (ability.charges || 1) : undefined;
  }

  /**
   * Returns the timeline sort index, or null if none is set. (or undefined if there is no such spellInfo)
   */
  getTimelineSortIndex(spellId) {
    const ability = this.getAbility(spellId);
    return ability ? ability.timelineSortIndex : undefined;
  }
}

export default Abilities;
