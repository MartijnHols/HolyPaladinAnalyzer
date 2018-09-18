import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import DamageDone from 'Parser/Core/Modules/DamageDone';
import Abilities from './Modules/Abilities';

import MaelstromTracker from '../Shared/MaelstromChart/MaelstromTracker';
import MaelstromTab from '../Shared/MaelstromChart/MaelstromTab';

import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import Flametongue from './Modules/ShamanCore/Flametongue';
import FlametongueRefresh from './Modules/ShamanCore/FlametongueRefresh';
import Rockbiter from './Modules/ShamanCore/Rockbiter';

import CrashingStorm from './Modules/Talents/CrashingStorm';
import EarthenSpike from './Modules/Talents/EarthenSpike';
import FuryOfAir from './Modules/Talents/FuryOfAir';
import ForcefulWinds from './Modules/Talents/ForcefulWinds';
import Hailstorm from './Modules/Talents/Hailstorm';
import HotHand from './Modules/Talents/HotHand';
import Landslide from './Modules/Talents/Landslide';
import SearingAssault from './Modules/Talents/SearingAssault';
import Sundering from './Modules/Talents/Sundering';

import StaticCharge from '../Shared/Talents/StaticCharge';
import AnkhNormalizer from '../Shared/Normalizers/AnkhNormalizer';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    // ShamanCore
    damageDone: [DamageDone, { showStatistic: true }],
    flametongue: Flametongue,
    rockbiter: Rockbiter,
    flametongueRefresh: FlametongueRefresh,
    // Features
    alwaysBeCasting: AlwaysBeCasting,
    abilities: Abilities,
    cooldownThroughputTracker: CooldownThroughputTracker,

    //Talents
    crashingStorm: CrashingStorm,
    earthenSpike: EarthenSpike,
    forcefulWinds: ForcefulWinds,
    furyOfAir: FuryOfAir,
    hailstorm: Hailstorm,
    hotHand: HotHand,
    landslide: Landslide,
    searingAssault: SearingAssault,
    sundering: Sundering,

    staticCharge: StaticCharge,
    maelstromTracker: MaelstromTracker,
    maelstromTab: MaelstromTab,
    ankhNormalizer: AnkhNormalizer,
  };


}

export default CombatLogParser;
