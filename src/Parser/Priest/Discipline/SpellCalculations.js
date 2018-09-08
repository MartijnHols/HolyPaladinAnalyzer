import SPELLS from 'common/SPELLS';
import { calculateAzeriteEffects } from 'common/stats';
import { ATONEMENT_COEFFICIENT } from './Constants';

// 50% dmg increase passive
const SMITE_DAMAGE_BUFF = 0.5;

/*
 * Wraps a spell calculation to accept the stats module
 * Essentially lets you compose modules with spell estimations
 */
const statWrapper = spellCalculation => (stats) => (...args) => {
  return spellCalculation(stats, ...args);
};

// Returns the overhealing of a given spell
export const calculateOverhealing = (estimateHealing, healing, overhealing = 0) => {
  if (estimateHealing - healing < 0) {
    return 0;
  }

  return estimateHealing - healing;
};

// Estimation of how much output an offensive penance bolt will do
export const OffensivePenanceBoltEstimation = statWrapper(
  (stats) => {
    const currentIntellect = stats.currentIntellectRating;
    const currentVers = 1 + stats.currentVersatilityPercentage;
    const currentMastery = 1 + stats.currentMasteryPercentage;
    const penanceCoefficient = SPELLS.PENANCE.coefficient;

    const penanceBoltDamage = Math.round(
      currentIntellect * penanceCoefficient * currentVers
    );

    const penanceBoltHealing = Math.round(
      penanceBoltDamage * ATONEMENT_COEFFICIENT * currentMastery
    );

    return {
      boltDamage: penanceBoltDamage,
      boltHealing: penanceBoltHealing,
    };
  }
);

// Estimation of how much output a Smite will do
export const SmiteEstimation = (stats, sins, giftRanks = [340]) => {
  return (giftActive) => {
    const currentIntellect = stats.currentIntellectRating;
    const currentVers = 1 + stats.currentVersatilityPercentage;
    const currentMastery = 1 + stats.currentMasteryPercentage;
    const smiteCoefficient = SPELLS.SMITE.coefficient;

    let smiteDamage = currentIntellect * smiteCoefficient;

    let giftDamage = giftRanks.map((rank) => calculateAzeriteEffects(SPELLS.GIFT_OF_FORGIVENESS.id, rank)).reduce((total, bonus) => total + bonus[0], 0);

    if (!giftActive) {
      giftDamage = 0;
    }

    smiteDamage = Math.round(
      smiteDamage * currentVers * (1 + sins.currentBonus) * (1 + SMITE_DAMAGE_BUFF)
    );

    giftDamage = Math.round(
      giftDamage * currentVers * (1 + sins.currentBonus) * (1 + SMITE_DAMAGE_BUFF)
    );

    let smiteHealing = Math.round(
      smiteDamage * ATONEMENT_COEFFICIENT * currentMastery
    );

    const giftHealing = Math.round(
      giftDamage * ATONEMENT_COEFFICIENT * currentMastery
    );

    smiteDamage += giftDamage;
    smiteHealing += giftHealing;

    return {
      smiteDamage,
      smiteHealing,
      giftDamage,
      giftHealing,
    };
  };
};
