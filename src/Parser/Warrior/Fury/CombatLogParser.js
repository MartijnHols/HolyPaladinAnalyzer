import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import DamageDone from 'Parser/Core/Modules/DamageDone';

import Abilities from './Modules/Abilities';
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import SpellUsable from './Modules/Features/SpellUsable';

import EnrageUptime from './Modules/BuffDebuff/EnrageUptime';
import FrothingBerserkerUptime from './Modules/BuffDebuff/FrothingBerserkerUptime';
import Juggernaut from './Modules/BuffDebuff/Juggernaut';

import RampageFrothingBerserker from './Modules/Features/RampageFrothingBerserker';
import RampageCancelled from './Modules/Features/RampageCancelled';
import AngerManagement from './Modules/Talents/AngerManagement';
import FuriousSlashTimesByStacks from './Modules/Talents/FuriousSlashTimesByStacks';
import FuriousSlashUptime from './Modules/Talents/FuriousSlashUptime';

import T21_2set from './Modules/Items/T21_2set';
import T21_4set from './Modules/Items/T21_4set';

import PrePotion from './Modules/Items/PrePotion';

class CombatLogParser extends CoreCombatLogParser {
  static specModules = {
    damageDone: [DamageDone, {showStatistic: true}],

    abilities: Abilities,
    alwaysBeCasting: AlwaysBeCasting,
    cooldownThroughputTracker: CooldownThroughputTracker,
    spellUsable: SpellUsable,

    enrageUptime: EnrageUptime,
    frothingBerserkerUptime: FrothingBerserkerUptime,
    juggernaut: Juggernaut,

    rampageFrothingBerserker: RampageFrothingBerserker,
    rampageCancelled: RampageCancelled,
    angerManagement: AngerManagement,
	furiousSlashTimesByStacks: FuriousSlashTimesByStacks,
	furiousSlashUptime: FuriousSlashUptime,

    t21_2set: T21_2set,
    t21_4set: T21_4set,

    // Overrides default PrePotion
    prePotion: PrePotion,
  };
}

export default CombatLogParser;
