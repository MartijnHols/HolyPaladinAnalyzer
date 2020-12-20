import SPELLS from 'common/SPELLS';

export const ABILITIES_AFFECTED_BY_HEALING_INCREASES = [
  SPELLS.DIVINE_HYMN_HEAL.id,
  SPELLS.GREATER_HEAL.id,
  SPELLS.FLASH_HEAL.id,
  SPELLS.PRAYER_OF_MENDING_HEAL.id,
  SPELLS.PRAYER_OF_HEALING.id,
  SPELLS.RENEW.id,
  SPELLS.HOLY_WORD_SERENITY.id,
  SPELLS.HOLY_WORD_SANCTIFY.id,
  SPELLS.HOLY_WORD_SALVATION_TALENT.id,
  SPELLS.DESPERATE_PRAYER.id,
  SPELLS.COSMIC_RIPPLE_TALENT.id,
  SPELLS.BINDING_HEAL_TALENT.id,
  SPELLS.CIRCLE_OF_HEALING_TALENT.id,
  SPELLS.HALO_HEAL.id,
  SPELLS.DIVINE_STAR_TALENT.id,
  SPELLS.TRAIL_OF_LIGHT_TALENT.id,
];

// better off making things that -dont- proc it perhaps?
export const ABILITIES_THAT_TRIGGER_MASTERY: number[] = [
  SPELLS.DIVINE_HYMN_HEAL.id,
  SPELLS.GREATER_HEAL.id,
  SPELLS.FLASH_HEAL.id,
  SPELLS.PRAYER_OF_MENDING_HEAL.id,
  SPELLS.PRAYER_OF_HEALING.id,
  SPELLS.HOLY_WORD_SERENITY.id,
  SPELLS.HOLY_WORD_SANCTIFY.id,
  SPELLS.HOLY_WORD_SALVATION_TALENT.id,
  SPELLS.DESPERATE_PRAYER.id,
  SPELLS.COSMIC_RIPPLE_HEAL.id,
  SPELLS.BINDING_HEAL_TALENT.id,
  SPELLS.CIRCLE_OF_HEALING_TALENT.id,
  SPELLS.HALO_HEAL.id,
  SPELLS.DIVINE_STAR_HEAL.id,
  SPELLS.RENEW.id, // this is reduced in calculations, due to the initial tick proccing EoL but not the periodic ticks
  SPELLS.TRAIL_OF_LIGHT_TALENT.id,
  SPELLS.HOLY_NOVA_HEAL.id,
  SPELLS.GUARDIAN_SPIRIT_HEAL.id,

  // Trinkets
];

export const ABILITIES_AFFECTED_BY_APOTHEOSIS_TALENT: number[] = [
  SPELLS.HOLY_WORD_SERENITY.id,
  SPELLS.HOLY_WORD_SANCTIFY.id,
];

export const HOLY_PRIEST_HEALING_INCREASE_AURA = .4;

export const RESONANT_WORDS_RANKS = [
  38, 41.799999, 45.599998, 49.400002, 53.200001, 57, 60.799999, 64.599998, 68.400002, 72.199997, 76, 79.800003, 83.599998, 87.400002, 91.199997
]
