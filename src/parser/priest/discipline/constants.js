import SPELLS from 'common/SPELLS';

export const ABILITIES_AFFECTED_BY_HEALING_INCREASES = [
  SPELLS.ATONEMENT_HEAL_NON_CRIT.id,
  SPELLS.ATONEMENT_HEAL_CRIT.id,
  SPELLS.POWER_WORD_SHIELD.id,
  SPELLS.POWER_WORD_RADIANCE.id,
  SPELLS.HALO_TALENT.id,
  SPELLS.SHADOW_MEND.id,
  // While the following spells don't double dip in healing increases, they gain the same percentual bonus from the transfer
  SPELLS.LEECH.id,
];

export const DAMAGING_SPELLS_THAT_CAUSE_ATONEMENT = [
  SPELLS.MAGIC_MELEE.id, // Shadow Fiend Melee
  SPELLS.SMITE.id,
  SPELLS.PENANCE.id,
  SPELLS.HALO_DAMAGE.id,
  SPELLS.SHADOW_WORD_PAIN.id,
  SPELLS.PURGE_THE_WICKED_TALENT.id,
  SPELLS.PURGE_THE_WICKED_BUFF.id,
  SPELLS.POWER_WORD_SOLACE_TALENT.id,
  SPELLS.SCHISM_TALENT.id,
  SPELLS.DIVINE_STAR_DAMAGE.id,
  SPELLS.HOLY_NOVA.id,
];

export const ATONEMENT_COEFFICIENT = 0.4;

// https://www.wowhead.com/spell=137032/discipline-priest
export const DISC_PRIEST_DAMAGE_REDUCTION = .67;
