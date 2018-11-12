import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import resourceSuggest from 'parser/shared/modules/resourcetracker/ResourceSuggest';

import ComboPointTracker from '../../../shared/resources/ComboPointTracker';

class ComboPoints extends Analyzer {
  static dependencies = {
    comboPointTracker: ComboPointTracker,
  };

  makeExtraSuggestion(spell) {
    return <>Avoid wasting combo points when casting <SpellLink id={spell.id} />.</>;
  }

  suggestions(when) {
    resourceSuggest(when, this.comboPointTracker, {
      spell: SPELLS.MARKED_FOR_DEATH_TALENT, // 5 CP
      minor: 0,
      avg: 0.05,
      major: 0.1,
      extraSuggestion: this.makeExtraSuggestion(SPELLS.MARKED_FOR_DEATH_TALENT),
    });
    resourceSuggest(when, this.comboPointTracker, {
      spell: SPELLS.SINISTER_STRIKE, // 1 CP + 35% chance for another
      minor: 0,
      avg: 0.05,
      major: 0.1,
      extraSuggestion: this.makeExtraSuggestion(SPELLS.SINISTER_STRIKE),
    });
    resourceSuggest(when, this.comboPointTracker, {
      spell: SPELLS.AMBUSH, // 2 CP
      minor: 0,
      avg: 0.1,
      major: 0.2,
      extraSuggestion: this.makeExtraSuggestion(SPELLS.AMBUSH),
    });
    resourceSuggest(when, this.comboPointTracker, {
      spell: SPELLS.PISTOL_SHOT, // 1 CP
      minor: 0,
      avg: 0.1,
      major: 0.2,
      // TODO: Beta logs incorrectly add bonus CP from an extra Sinister Strike to Pistol shot. 
      // Want to see if its fixed in PrePatch or can be fixed on WCL side before creating workaround.
      extraSuggestion: this.makeExtraSuggestion(SPELLS.PISTOL_SHOT),
    });
    resourceSuggest(when, this.comboPointTracker, {
      spell: SPELLS.GHOSTLY_STRIKE_TALENT, // 1 CP
      minor: 0,
      avg: 0.05,
      major: 0.1,
      extraSuggestion: this.makeExtraSuggestion(SPELLS.GHOSTLY_STRIKE_TALENT),
    });
    resourceSuggest(when, this.comboPointTracker, {
      spell: SPELLS.CHEAP_SHOT, // 2 CP
      minor: 0,
      avg: 0.1,
      major: 0.2,
      extraSuggestion: this.makeExtraSuggestion(SPELLS.CHEAP_SHOT),
    });
    resourceSuggest(when, this.comboPointTracker, {
      spell: SPELLS.GOUGE, // 1 CP
      minor: 0,
      avg: 0.1,
      major: 0.2,
      extraSuggestion: this.makeExtraSuggestion(SPELLS.GOUGE),
    });
  }
}

export default ComboPoints;
