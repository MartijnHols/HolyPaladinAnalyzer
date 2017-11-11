import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import DamageDone from 'Parser/Core/Modules/DamageDone';

import CastEfficiency from './Modules/Features/CastEfficiency';
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import WintersChillTracker from './Modules/Features/WintersChill';
import BrainFreeze from './Modules/Features/BrainFreeze';
import IceLance from './Modules/Features/IceLance';
import ThermalVoid from './Modules/Features/ThermalVoid';
import GlacialSpike from './Modules/Features/GlacialSpike';
import ArcticGale from './Modules/Features/ArcticGale';
import FrostBomb from './Modules/Features/FrostBomb';
import RuneOfPower from '../Shared/Modules/Features/RuneOfPower';
import MirrorImage from '../Shared/Modules/Features/MirrorImage';
import UnstableMagic from '../Shared/Modules/Features/UnstableMagic';
import SplittingIce from './Modules/Features/SplittingIce';
import CancelledCasts from '../Shared/Modules/Features/CancelledCasts';
import Blizzard from './Modules/Features/Blizzard';

import FrozenOrb from './Modules/Cooldowns/FrozenOrb';
import IcyVeins from './Modules/Cooldowns/IcyVeins';

import ShardOfTheExodar from '../Shared/Modules/Items/ShardOfTheExodar';
import Tier20_2set from './Modules/Items/Tier20_2set';
import Tier20_4set from './Modules/Items/Tier20_4set';
import ZannesuJourney from './Modules/Items/ZannesuJourney';
import IceTime from './Modules/Items/IceTime';
import MagtheridonsBanishedBracers from './Modules/Items/MagtheridonsBanishedBracers';
import ShatteredFragmentsOfSindragosa from './Modules/Items/ShatteredFragmentsOfSindragosa';
import LadyVashjsGrasp from './Modules/Items/LadyVashjsGrasp';
import SoulOfTheArchmage from './Modules/Items/SoulOfTheArchmage';



class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    // Features
    castEfficiency: CastEfficiency,
    alwaysBeCasting: AlwaysBeCasting,
    cancelledCasts: CancelledCasts,
    cooldownThroughputTracker: CooldownThroughputTracker,
	  wintersChillTracker: WintersChillTracker,
	  brainFreeze: BrainFreeze,
    iceLance: IceLance,
	  thermalVoid: ThermalVoid,
	  glacialSpike: GlacialSpike,
    damageDone: [DamageDone, { showStatistic: true }],
    runeOfPower: RuneOfPower,
    mirrorImage: MirrorImage,
    unstableMagic: UnstableMagic,
    arcticGale: ArcticGale,
    frostBomb: FrostBomb,
    splittingIce: SplittingIce,
    blizzard: Blizzard,

	  //Cooldowns
    frozenOrb: FrozenOrb,
    icyVeins: IcyVeins,

	  //Items
	  tier20_2set: Tier20_2set,
    tier20_4set: Tier20_4set,
	  shardOfTheExodar: ShardOfTheExodar,
    zannesuJourney: ZannesuJourney,
    iceTime: IceTime,
    magtheridonsBanishedBracers: MagtheridonsBanishedBracers,
    shatteredFragmentsOfSindragosa: ShatteredFragmentsOfSindragosa,
    ladyVashjsGrasp: LadyVashjsGrasp,
    soulOfTheArchmage: SoulOfTheArchmage,
  };
}

export default CombatLogParser;
