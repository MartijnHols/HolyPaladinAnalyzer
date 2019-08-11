import FIGHT_DIFFICULTIES from 'common/FIGHT_DIFFICULTIES';
import SPELLS from 'common/SPELLS';

import Background from './images/backgrounds/BlackwaterBehemoth.jpg';
import Headshot from './images/headshots/BlackwaterBehemoth.png';

export default {
  id: 2289,
  name: 'Blackwater Behemoth',
  background: Background,
  headshot: Headshot,
  icon: 'achievement_boss_wolfeel',
  fight: {
    vantusRuneBuffId: 298642,
    softMitigationChecks: {
      physical: [],
      magical: [],
    },
    phases: {
      P1: {
        name: 'Platform 1',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
      },
      P2: {
        name: 'Platform 2',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
        filter: {
          type: 'begincast',
          ability: {
            id: SPELLS.CAVITATION_BEGIN_CAST.id,
          },
          eventInstance: 0,
        },
      },
      P3: {
        name: 'Platform 3',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
        filter: {
          type: 'begincast',
          ability: {
            id: SPELLS.CAVITATION_BEGIN_CAST.id,
          },
          eventInstance: 1,
        },
      },
    },
  },
};
