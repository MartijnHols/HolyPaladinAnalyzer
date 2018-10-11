import Background from './images/backgrounds/Felhounds-of-Sargeras.jpg';
import Headshot from './images/headshots/Felhounds-of-Sargeras.png';

export default {
  id: 2074,
  name: 'Felhounds of Sargeras',
  background: Background,
  headshot: Headshot,
  icon: 'achievement_boss_argus_hound',
  fight: {
    vantusRuneBuffId: 250156,
    // TODO: Add fight specific props
    // e.g. baseDowntime (seconds, percentage, based on (de)buff, etc)
    // e.g. ads
    softMitigationChecks: {
      BurningMaw: 254747,
      CorruptingMaw: 254760,
    },
  },
};
