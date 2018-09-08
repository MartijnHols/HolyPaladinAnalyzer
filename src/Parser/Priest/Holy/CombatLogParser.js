import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import LowHealthHealing from 'Parser/Core/Modules/Features/LowHealthHealing';
import HealingDone from 'Parser/Core/Modules/HealingDone';
import Abilities from './Modules/Abilities';

import SpellManaCost from './Modules/Core/SpellManaCost';

// Spell data
import DivineHymn from './Modules/Spells/DivineHymn';
import Sanctify from './Modules/Spells/Sanctify';
import SpiritOfRedemption from './Modules/Spells/SpiritOfRedemption';

//Talents
import TrailOfLight from './Modules/Talents/TrailOfLight';
import CosmicRipple from './Modules/Talents/CosmicRipple';
import Perseverance from './Modules/Talents/Perseverance';

// Features
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import Checklist from './Modules/Checklist/Module';
import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import SpellUsable from './Modules/Features/SpellUsable';

// Priest Core
import EnduringRenewal from './Modules/PriestCore/EnduringRenewal';
import MasteryBreakdown from './Modules/PriestCore/MasteryBreakdown';
import Serendipity from './Modules/PriestCore/Serendipity';
import SanctifyReduction from './Modules/PriestCore/SerendipityReduction/SanctifyReduction';
import SerenityReduction from './Modules/PriestCore/SerendipityReduction/SerenityReduction';
import HymnBuffBenefit from './Modules/PriestCore/HymnBuffBenefit';
import HolyWords from './Modules/PriestCore/HolyWords';
import Fortitude from './Modules/PriestCore/Fortitude';

import { ABILITIES_AFFECTED_BY_HEALING_INCREASES } from './Constants';

class CombatLogParser extends CoreCombatLogParser {
  static abilitiesAffectedByHealingIncreases = ABILITIES_AFFECTED_BY_HEALING_INCREASES;

  static specModules = {
    spellManaCost: SpellManaCost,
    healingDone: [HealingDone, { showStatistic: true }],
    abilities: Abilities,
    lowHealthHealing: LowHealthHealing,

    // Features
    alwaysBeCasting: AlwaysBeCasting,
    checklist: Checklist,
    cooldownThroughputTracker: CooldownThroughputTracker,
    spellUsable: SpellUsable,

    // Core
    enduringRenewal: EnduringRenewal,
    masteryBreakdown: MasteryBreakdown,
    serendipity: Serendipity,
    sancReduction: SanctifyReduction,
    sereReduction: SerenityReduction,
    hymnBuffBenefit: HymnBuffBenefit,
    holyWords: HolyWords,
    fortitude: Fortitude,

    // Spells
    divineHymn: DivineHymn,
    sanctify: Sanctify,
    spiritOfRedemption: SpiritOfRedemption,

    // Talents
    trailOfLight: TrailOfLight,
    cosmicRipple: CosmicRipple,
    perseverance: Perseverance,
  };
}

export default CombatLogParser;
