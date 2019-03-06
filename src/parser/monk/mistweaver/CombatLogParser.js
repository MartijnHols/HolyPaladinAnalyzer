/* TODO: BfA Edition!
 * Rising Mist - Poor use suggestions
 * Upwelling - Additional healing added from channel, missed healing from channel?
 * Mana Tea vs SotC - Potentially compare common output of each talent.
 *    Suggest using one over the other?
 * Vivify or REM - Missed Vivify healing from less than 2 REMs out
 * Azerite Bonus Placeholders
 */

import React from 'react';

import CoreCombatLogParser from 'parser/core/CombatLogParser';

import Panel from 'interface/others/Panel';
import MonkSpreadsheet from 'interface/others/MonkSpreadsheet';
import LowHealthHealing from 'parser/shared/modules/features/LowHealthHealing';
import ManaLevelChart from 'parser/shared/modules/resources/mana/ManaLevelChart';
import ManaUsageChart from 'parser/shared/modules/resources/mana/ManaUsageChart';

import GlobalCooldown from './modules/core/GlobalCooldown';
import CoreChanneling from './modules/core/Channeling';
import HotTracker from './modules/core/HotTracker';
import SpellUsable from './modules/core/SpellUsable';

// Normalizers
import HotApplicationNormalizer from './normalizers/HotApplicationNormalizer';
import HotRemovalNormalizer from './normalizers/HotRemovalNormalizer';

// Features
import Abilities from './modules/features/Abilities';
import CooldownThroughputTracker from './modules/features/CooldownThroughputTracker';
import AlwaysBeCasting from './modules/features/AlwaysBeCasting';
import EssenceFontMastery from './modules/features/EssenceFontMastery';
import Checklist from './modules/features/Checklist/Module';
import StatValues from './modules/features/StatValues';
import EvmVivCastRatio from './modules/features/EvmVivCastRatio';
import MasteryStats from './modules/features/MasteryStats';

// Spells
import ThunderFocusTea from './modules/spells/ThunderFocusTea';
import EssenceFont from './modules/spells/EssenceFont';
import EnvelopingMists from './modules/spells/EnvelopingMists';
import SoothingMist from './modules/spells/SoothingMist';
import Vivify from './modules/spells/Vivify';
import LifeCocoon from './modules/spells/LifeCocoon';
import RenewingMist from './modules/spells/RenewingMist';

// Talents
import JadeSerpentStatue from './modules/talents/JadeSerpentStatue';
import ChiJi from './modules/talents/ChiJi';
import ChiBurst from './modules/talents/ChiBurst';
import ManaTea from './modules/talents/ManaTea';
import RefreshingJadeWind from './modules/talents/RefreshingJadeWind';
import Lifecycles from './modules/talents/Lifecycles';
import SpiritOfTheCrane from './modules/talents/SpiritOfTheCrane';
import RisingMist from './modules/talents/RisingMist';
import RenewingMistDuringManaTea from './modules/talents/RenewingMistDuringManaTea';

// Azerite Traits
import FontOfLife from './modules/spells/azeritetraits/FontOfLife';
import UpliftedSpirits from './modules/spells/azeritetraits/UpliftedSpirits';
import SecretInfusion from './modules/spells/azeritetraits/SecretInfusion';

// Mana Tracker
import MistweaverHealingEfficiencyDetails from './modules/features/MistweaverHealingEfficiencyDetails';
// import HealingEfficiencyDetails from '../../core/healingEfficiency/HealingEfficiencyDetails';
import HealingEfficiencyTracker from './modules/features/MistweaverHealingEfficiencyTracker';
import ManaTracker from '../../core/healingEfficiency/ManaTracker';

import { ABILITIES_AFFECTED_BY_HEALING_INCREASES } from './constants';

class CombatLogParser extends CoreCombatLogParser {
  static abilitiesAffectedByHealingIncreases = ABILITIES_AFFECTED_BY_HEALING_INCREASES;

  static specModules = {
    // Normalizer
    hotApplicationNormalizer: HotApplicationNormalizer,
    hotRemovalNormalizer: HotRemovalNormalizer,

    // Core
    lowHealthHealing: LowHealthHealing,
    channeling: CoreChanneling,
    globalCooldown: GlobalCooldown,
    hotTracker: HotTracker,
    spellUsable: SpellUsable,

    // Generic healer things
    manaLevelChart: ManaLevelChart,
    manaUsageChart: ManaUsageChart,

    // Features
    alwaysBeCasting: AlwaysBeCasting,
    abilities: Abilities,
    cooldownThroughputTracker: CooldownThroughputTracker,
    essenceFontMastery: EssenceFontMastery,
    checklist: Checklist,
    statValues: StatValues,
    evmVivCastRatio: EvmVivCastRatio,
    masteryStats: MasteryStats,

    // Spells
    essenceFont: EssenceFont,
    thunderFocusTea: ThunderFocusTea,
    envelopingMists: EnvelopingMists,
    soothingMist: SoothingMist, // Removed as this needs to be reworked with updated Soothing Mist Spell in BfA
    vivify: Vivify,
    renewingMist: RenewingMist,
    lifeCocoon: LifeCocoon,

    // Talents
    chiBurst: ChiBurst,
    chiJi: ChiJi,
    manaTea: ManaTea,
    refreshingJadeWind: RefreshingJadeWind,
    lifecycles: Lifecycles,
    spiritOfTheCrane: SpiritOfTheCrane,
    risingMist: RisingMist,
    jadeSerpentStatue: JadeSerpentStatue,
    renewingMistDuringManaTea: RenewingMistDuringManaTea,

    // Azerite Traits
    fontOfLife: FontOfLife,
    upliftedSpirits: UpliftedSpirits,
    secretInfusion: SecretInfusion,

    // Mana Tab
    manaTracker: ManaTracker,
    hpmDetails: MistweaverHealingEfficiencyDetails,
    hpmTracker: HealingEfficiencyTracker,
  };

  generateResults(...args) {
    const results = super.generateResults(...args);

    results.tabs = [
      ...results.tabs,
      {
        title: 'Player Log Data',
        url: 'player-log-data',
        render: () => (
          <Panel style={{ padding: '15px 22px 15px 15px' }}>
            <MonkSpreadsheet parser={this} />
          </Panel>
        ),
      },
    ];
    return results;
  }
}

export default CombatLogParser;
