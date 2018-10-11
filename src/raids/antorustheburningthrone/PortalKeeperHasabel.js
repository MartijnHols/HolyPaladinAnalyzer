import Background from './images/backgrounds/Portal-Keeper-Hasabel.jpg';
import Headshot from './images/headshots/Portal-Keeper-Hasabel.png';

export default {
  id: 2064,
  name: 'Portal Keeper Hasabel',
  background: Background,
  headshot: Headshot,
  icon: 'achievement_boss_argus_femaleeredar',
  fight: {
    vantusRuneBuffId: 250160,
    // TODO: Add fight specific props
    // e.g. baseDowntime (seconds, percentage, based on (de)buff, etc)
    // e.g. ads
    softMitigationChecks: {},
  },
};
