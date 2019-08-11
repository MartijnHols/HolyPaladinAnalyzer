import FIGHT_DIFFICULTIES from 'common/FIGHT_DIFFICULTIES';
import SPELLS from 'common/SPELLS';

import Background from './images/backgrounds/UunatHarbingerOfTheVoid.jpg';
import Headshot from './images/headshots/UunatHarbingerOfTheVoid.png';

export default {
  id: 2273,
  name: 'Uu\'nat, Harbinger of the Void',
  background: Background,
  headshot: Headshot,
  icon: 'achievement_uunat',
  fight: {
    vantusruneBuffId: 285901,
    softMitigationChecks: {
      physical: [],
      magical: [
        284851, // Touch of the End
      ],
    },
    phases: {
      P1: {
        name: 'Stage One: His All-Seeing Eyes',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
      },
      I1: {
        name: 'Intermission One',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
        filter: {
          type: 'applybuff',
          ability: {
            id: SPELLS.VOID_SHIELD.id,
          },
          eventInstance: 0,
        },
      },
      P2: {
        name: 'Stage Two: His Dutiful Servants',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
        filter: {
          type: 'removebuff',
          ability: {
            id: SPELLS.VOID_SHIELD.id,
          },
          eventInstance: 0,
        },
      },
      I2: {
        name: 'Intermission Two',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
        filter: {
          type: 'applybuff',
          ability: {
            id: SPELLS.VOID_SHIELD.id,
          },
          eventInstance: 1,
        },
      },
      P3: {
        name: 'Stage Three: His Unwavering Gaze',
        difficulties: [FIGHT_DIFFICULTIES.NORMAL, FIGHT_DIFFICULTIES.HEROIC, FIGHT_DIFFICULTIES.MYTHIC],
        filter: {
          type: 'removebuff',
          ability: {
            id: SPELLS.VOID_SHIELD.id,
          },
          eventInstance: 1,
        },
      },
    },
  },
};
