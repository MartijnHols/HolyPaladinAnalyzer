import SPELLS from 'common/SPELLS';
import Analyzer from 'Parser/Core/Analyzer';

// dependencies
import Combatants from 'Parser/Core/Modules/Combatants';

const HOLY_WORD_SPELL_ID = SPELLS.HOLY_WORD_SERENITY.id;

// We are giving a buffer of 75% of CD due to the fact that the large
// majority of players would intentionally use spells to push holy words
// off cooldown if needed. This is a feelycraft metric that is open for
// modification or outright removal depending on opinions.
const FULL_OVERCAST_LENIENCE = 0.75;

class SerenityReduction extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  }

  // Holy Word reduction spells (aka things that apply the respective Serendipity)
  serendipityProccers = {
    [SPELLS.GREATER_HEAL.id]: 1.0,
    [SPELLS.FLASH_HEAL.id]: 1.0,
    [SPELLS.BINDING_HEAL_TALENT.id]: 0.5,
  }

  currentCooldown = 0
  maxCooldown = 60000
  serendipityReduction = 6000

  holy_t20_2p = 0.0
  holy_t20_2p_active = false;
  overcast = 0.0 // Overall wasted serendipity
  rawReduction = 0.0
  casts = 0
  effectiveFullOvercasts = 0
  _tempOvercast = 0.0 // Tracker of how much wasted overcast between each holy word cast

  on_initialized() {
    // Set up proper serendipity reduction values
    if (this.combatants.selected.hasTalent(SPELLS.LIGHT_OF_THE_NAARU_TALENT.id)) {
      this.serendipityReduction += 2000;
    }
    if (this.combatants.selected.hasBuff(SPELLS.HOLY_PRIEST_T20_2SET_BONUS_BUFF.id)) {
      this.serendipityReduction += 1000;
      this.holy_t20_2p_active = true;
    }
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId === HOLY_WORD_SPELL_ID) {
      this.currentCooldown = event.timestamp + this.maxCooldown;
      this.casts += 1;

      this.effectiveFullOvercasts += Math.floor(this._tempOvercast / 1000 / (this.maxCooldown * FULL_OVERCAST_LENIENCE));
      this._tempOvercast = 0.0;
    }

    if (spellId.toString() in this.serendipityProccers) {
      const actualSerendipityReduction = this.serendipityReduction * this.serendipityProccers[spellId];
      this.rawReduction += actualSerendipityReduction;

      const difference = this.currentCooldown - event.timestamp;
      if (difference < actualSerendipityReduction) {
        const overlap = Math.min(
          actualSerendipityReduction,
          Math.abs((actualSerendipityReduction) - difference)
        );
        this.overcast += overlap;
        this._tempOvercast += overlap;
      }

      // Logic for determining Holy Priest 2P Set Bonus gain
      if (this.holy_t20_2p_active && difference > (actualSerendipityReduction - SPELLS.HOLY_PRIEST_T20_2SET_BONUS_BUFF.value)) {
        this.holy_t20_2p += Math.min(1000, difference - (actualSerendipityReduction - SPELLS.HOLY_PRIEST_T20_2SET_BONUS_BUFF.value * this.serendipityProccers[spellId]));
      }
      this.currentCooldown -= actualSerendipityReduction;
    }
  }
}


export default SerenityReduction;
