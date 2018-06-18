import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import HealingDone from 'Parser/Core/Modules/HealingDone';
import DamageDone from 'Parser/Core/Modules/DamageDone';
import DamageTaken from 'Parser/Core/Modules/DamageTaken';

import Haste from './Modules/Core/Haste';
import Abilities from './Modules/Abilities';
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import SpellUsable from './Modules/Features/SpellUsable';

import Shield_Block from './Modules/Spells/ShieldBlock';
import Checklist from './Modules/Features/Checklist';
import IgnorePain from './Modules/Features/IgnorePain';
import RageTracker from './Modules/Core/RageTracker';
import RageDetails from './Modules/Core/RageDetails';
import Avatar from './Modules/Features/Avatar';

import AngerManagement from './Modules/Talents/AngerManagement';
import BoomingVoice from './Modules/Talents/BoomingVoice';
import RenewedFury from './Modules/Talents/RenewedFury';
import HeavyRepercussions from './Modules/Talents/HeavyRepercussions';
import IntoTheFray from './Modules/Talents/IntoTheFray';
import Vengeance from './Modules/Talents/Vengeance';
import Punish from './Modules/Talents/Punish';
import DragonRoar from './Modules/Talents/DragonRoar';

import T21_2pc from './Modules/Items/T21_2pc';
import ThundergodsVigor from './Modules/Items/ThundergodsVigor';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    // Core
    damageTaken: [DamageTaken, { showStatistic: true }],
    healingDone: [HealingDone, { showStatistic: true }],
    damageDone: [DamageDone, { showStatistic: true }],
    haste: Haste,
    // Features
    abilities: Abilities,
    alwaysBeCasting: AlwaysBeCasting,
    shield_block: Shield_Block,
    spellUsable: SpellUsable,
    checklist: Checklist,
    ignorePain: IgnorePain,
    rageTracker: RageTracker,
    rageDetails: RageDetails,
    avatar: Avatar,
    //Talents
    angerManagement: AngerManagement,
    boomingVoice: BoomingVoice,
    renewedFury: RenewedFury,
    heavyRepercussions: HeavyRepercussions,
    intoTheFray: IntoTheFray,
    vengeance: Vengeance,
    punish: Punish,
    dragonRoar: DragonRoar,
    //Items
    t21: T21_2pc,
    thunderlordsVigor: ThundergodsVigor,
  };
}

export default CombatLogParser;
