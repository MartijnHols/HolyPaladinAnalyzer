/**
 * All Warlock azerite powers go in here.
 * You need to do this manually, usually an easy way to do this is by opening a WCL report and clicking the icons of spells to open the relevant Wowhead pages, here you can get the icon name by clicking the icon, copy the name of the spell and the ID is in the URL.
 * You can access these entries like other entries in the spells files by importing `common/SPELLS` and using the assigned property on the SPELLS object. Please try to avoid abbreviating properties.
 */

export default {
  // Affliction Azerite traits and effects
  CASCADING_CALAMITY: {
    id: 275372,
    name: 'Cascading Calamity',
    icon: 'spell_shadow_unstableaffliction_3',
  },
  WRACKING_BRILLIANCE: {
    id: 272891,
    name: 'Wracking Brilliance',
    icon: 'spell_shadow_felmending',
  },
  DREADFUL_CALLING: {
    id: 278727,
    name: 'Dreadful Calling',
    icon: 'inv_beholderwarlock',
  },
  INEVITABLE_DEMISE: {
    id: 273521,
    name: 'Inevitable Demise',
    icon: 'spell_shadow_abominationexplosion',
  },
  SUDDEN_ONSET: {
    id: 278721,
    name: 'Sudden Onset',
    icon: 'spell_shadow_curseofsargeras',
  },

  // Demonology Azerite traits and effects
  DEMONIC_METEOR: {
    id: 278737,
    name: 'Demonic Meteor',
    icon: 'ability_warlock_handofguldan',
  },
  EXPLOSIVE_POTENTIAL: {
    id: 275395,
    name: 'Explosive Potential',
    icon: 'inv__implosion',
  },
  EXPLOSIVE_POTENTIAL_BUFF: { // buff
    id: 275398,
    name: 'Explosive Potential',
    icon: 'inv__implosion',
  },
  UMBRAL_BLAZE: {
    id: 273523,
    name: 'Umbral Blaze',
    icon: 'ability_warlock_everlastingaffliction',
  },
  UMBRAL_BLAZE_DEBUFF: {
    id: 273526,
    name: 'Umbral Blaze',
    icon: 'ability_warlock_everlastingaffliction',
  },
  SUPREME_COMMANDER: {
    id: 279878,
    name: 'Supreme Commander',
    icon: 'inv_summondemonictyrant',
  },
  SUPREME_COMMANDER_BUFF: {
    id: 279885,
    name: 'Supreme Commander',
    icon: 'inv_summondemonictyrant',
  },
  SHADOWS_BITE: {
    id: 272944,
    name: 'Shadow\'s Bite',
    icon: 'spell_shadow_painspike',
  },
  SHADOWS_BITE_BUFF: {
    id: 272945,
    name: 'Shadow\'s Bite',
    icon: 'spell_shadow_painspike',
  },
  FORBIDDEN_KNOWLEDGE: {
    id: 278738,
    name: 'Forbidden Knowledge',
    icon: 'inv_offhand_hyjal_d_01',
  },
  FORBIDDEN_KNOWLEDGE_BUFF: {
    id: 279666,
    name: 'Forbidden Knowledge',
    icon: 'inv_offhand_hyjal_d_01',
  },

  // Destruction Azerite traits and effects
  ACCELERANT: {
    id: 272955,
    name: 'Accelerant',
    icon: 'spell_shadow_rainoffire',
  },
  ACCELERANT_BUFF: {
    id: 272957,
    name: 'Accelerant',
    icon: 'spell_shadow_rainoffire',
  },
  FLASHPOINT: {
    id: 275425,
    name: 'Flashpoint',
    icon: 'spell_fire_immolation',
  },
  FLASHPOINT_BUFF: {
    id: 275429,
    name: 'Flashpoint',
    icon: 'spell_fire_immolation',
  },
  ROLLING_HAVOC: {
    id: 278747,
    name: 'Rolling Havoc',
    icon: 'warlock_pvp_banehavoc',
  },
  ROLLING_HAVOC_BUFF: {
    id: 278931,
    name: 'Rolling Havoc',
    icon: 'warlock_pvp_banehavoc',
  },
  BURSTING_FLARE: {
    id: 279909,
    name: 'Bursting Flare',
    icon: 'spell_fire_fireball',
  },
  BURSTING_FLARE_BUFF: {
    id: 279913,
    name: 'Bursting Flare',
    icon: 'spell_fire_fireball',
  },
};
