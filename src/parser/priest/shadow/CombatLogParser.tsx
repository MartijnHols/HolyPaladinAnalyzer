import MainCombatLogParser from 'parser/core/CombatLogParser';
// core
import AbilityTracker from './modules/core/AbilityTracker';
import Insanity from './modules/core/Insanity';
import Channeling from './modules/core/Channeling';
import GlobalCooldown from './modules/core/GlobalCooldown';
// features
import Abilities from './modules/Abilities';
import AlwaysBeCasting from './modules/features/AlwaysBeCasting';
import Checklist from './modules/checklist/Module';
import SkippableCasts from './modules/features/SkippableCasts';
// spells:
import Mindbender from './modules/spells/Mindbender';
import Shadowfiend from './modules/spells/Shadowfiend';
import VampiricTouch from './modules/spells/VampiricTouch';
import ShadowWordPain from './modules/spells/ShadowWordPain';
import Voidform from './modules/spells/Voidform';
import VoidformAverageStacks from './modules/spells/VoidformAverageStacks';
import Dispersion from './modules/spells/Dispersion';
import CallToTheVoid from './modules/spells/CallToTheVoid';
import VampiricEmbrace from './modules/spells/VampiricEmbrace';
// talents
import TwistOfFate from './modules/talents/TwistOfFate';
import VoidTorrent from './modules/talents/VoidTorrent';
import ShadowCrash from './modules/talents/ShadowCrash';
import AuspiciousSpirits from './modules/talents/AuspiciousSpirits';
// normalizers
import ShadowfiendNormalizer from '../shared/normalizers/ShadowfiendNormalizer';
import Buffs from './modules/features/Buffs';

class CombatLogParser extends MainCombatLogParser {
  static specModules = {
    // core
    abilityTracker: AbilityTracker,
    insanity: Insanity,
    channeling: Channeling,
    globalCooldown: GlobalCooldown,

    // features:
    abilities: Abilities,
    buffs: Buffs,
    alwaysBeCasting: AlwaysBeCasting,
    checklist: Checklist,
    skippableCasts: SkippableCasts,

    // spells:
    mindbender: Mindbender,
    shadowfiend: Shadowfiend,
    vampiricTouch: VampiricTouch,
    shadowWordPain: ShadowWordPain,
    voidform: Voidform,
    voidformAverageStacks: VoidformAverageStacks,
    dispersion: Dispersion,
    callToTheVoid: CallToTheVoid,
    vampiricEmbrace: VampiricEmbrace,

    // talents:
    twistOfFate: TwistOfFate,
    voidTorrent: VoidTorrent,
    shadowCrash: ShadowCrash,
    auspiciousSpirits: AuspiciousSpirits,

    shadowfiendNormalizer: ShadowfiendNormalizer,
  };
}

export default CombatLogParser;
