import Analyzer from 'parser/core/Analyzer';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import { formatPercentage, formatNumber } from 'common/format';
import ROLES from 'game/ROLES';
import PropTypes from 'prop-types';

class ManaValues extends Analyzer {
  static propTypes = {
    owner: PropTypes.object.isRequired,
  };

  lowestMana = null; // start at `null` and fill it with the first value to account for users starting at a non-default amount for whatever reason
  endingMana = 0;

  maxMana = 50000;
  manaUpdates = [];

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.spec.role === ROLES.HEALER;
  }

  on_byPlayer_cast(event) {
    if (event.prepull) {
      // These are fabricated by the PrePullCooldowns normalizer which guesses class resources which could introduce issues.
      return;
    }
    if (event.classResources) {
      event.classResources
        .filter(resource => resource.type === RESOURCE_TYPES.MANA.id)
        .forEach(({ amount, cost, max }) => {
          const manaValue = amount;
          const manaCost = cost || 0;
          const currentMana = manaValue - manaCost;
          this.endingMana = currentMana;

          if (this.lowestMana === null || currentMana < this.lowestMana) {
            this.lowestMana = currentMana;
          }
          this.manaUpdates.push({
            timestamp: event.timestamp,
            current: currentMana,
            max: max,
            used: manaCost,
          });
          // The variable 'max' is constant but can differentiate by racial/items.
          this.maxMana = max;
        });
    }
  }

  get manaLeftPercentage() {
    return this.endingMana/this.maxMana;
  }
  get suggestionThresholds() {
    return {
      actual: this.manaLeftPercentage,
      isGreaterThan: {
        minor: 0.1,
        average: 0.2,
        major: 0.3,
      },
      style: 'percentage',
    };
  }
  suggestions(when) {
    const fight = this.owner.fight;
    const isWipe = !fight.kill;
    if (isWipe) {
      return;
    }

    if (this.owner.builds && this.owner.builds.GLIMMER && this.owner.builds.GLIMMER.active){
      return;
    }

    when(this.suggestionThresholds.actual).isGreaterThan(this.suggestionThresholds.isGreaterThan.minor)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest('You had mana left at the end of the fight. A good rule of thumb is having the same mana percentage as the bosses health percentage. Mana is indirectly tied with healing throughput and should be optimized.')
          .icon('inv_elemental_mote_mana')
          .actual(`${formatPercentage(actual)}% (${formatNumber(this.endingMana)}) mana left`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(this.suggestionThresholds.isGreaterThan.average)
          .major(this.suggestionThresholds.isGreaterThan.major);
      });
  }
}

export default ManaValues;
