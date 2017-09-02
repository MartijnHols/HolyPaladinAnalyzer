import { formatNumber, formatPercentage } from 'common/format';

import Status from './Modules/Status';
import HealingDone from './Modules/HealingDone';
import DamageDone from './Modules/DamageDone';
import DamageTaken from './Modules/DamageTaken';

import Combatants from './Modules/Combatants';
import AbilityTracker from './Modules/AbilityTracker';
import AlwaysBeCasting from './Modules/AlwaysBeCasting';
import Enemies from './Modules/Enemies';
import HealEventTracker from './Modules/HealEventTracker';
import ManaValues from './Modules/ManaValues';
import SpellManaCost from './Modules/SpellManaCost';

import CritEffectBonus from './Modules/Helpers/CritEffectBonus';
import Bloodlust from './Modules/Helpers/Bloodlust';

// Shared Legendaries
import Prydaz from './Modules/Items/Prydaz';
import Velens from './Modules/Items/Velens';
import SephuzsSecret from './Modules/Items/SephuzsSecret';
import KiljaedensBurningWish from './Modules/Items/KiljaedensBurningWish';
import ArchimondesHatredReborn from './Modules/Items/ArchimondesHatredReborn';
// Shared Epics
import DrapeOfShame from './Modules/Items/DrapeOfShame';
import DarkmoonDeckPromises from './Modules/Items/DarkmoonDeckPromises';
import AmalgamsSeventhSpine from './Modules/Items/AmalgamsSeventhSpine';
import ArchiveOfFaith from './Modules/Items/ArchiveOfFaith';
import BarbaricMindslaver from './Modules/Items/BarbaricMindslaver';
import SeaStar from './Modules/Items/SeaStarOfTheDepthmother';
import DeceiversGrandDesign from './Modules/Items/DeceiversGrandDesign';
import PrePotion from './Modules/Items/PrePotion';
import GnawedThumbRing from './Modules/Items/GnawedThumbRing';
import VialOfCeaselessToxins from './Modules/Items/VialOfCeaselessToxins';
import SpecterOfBetrayal from './Modules/Items/SpecterOfBetrayal';
import EngineOfEradication from './Modules/Items/EngineOfEradication';
import TarnishedSentinelMedallion from './Modules/Items/TarnishedSentinelMedallion';
import SpectralThurible from './Modules/Items/SpectralThurible';
import TerrorFromBelow from './Modules/Items/TerrorFromBelow';
import TomeOfUnravelingSanity from './Modules/Items/TomeOfUnravelingSanity';

// Shared Buffs
import VantusRune from './Modules/VantusRune';

import ParseResults from './ParseResults';

const debug = false;

class CombatLogParser {
  static abilitiesAffectedByHealingIncreases = [];

  static defaultModules = {
    status: Status,
    healingDone: HealingDone,
    damageDone: DamageDone,
    damageTaken: DamageTaken,

    combatants: Combatants,
    enemies: Enemies,
    spellManaCost: SpellManaCost,
    abilityTracker: AbilityTracker,
    healEventTracker: HealEventTracker,
    alwaysBeCasting: AlwaysBeCasting,
    manaValues: ManaValues,
    vantusRune: VantusRune,

    critEffectBonus: CritEffectBonus,
    bloodlust: Bloodlust,

    // Items:
    // Legendaries:
    prydaz: Prydaz,
    velens: Velens,
    sephuzsSecret: SephuzsSecret,
    kiljaedensBurningWish: KiljaedensBurningWish,
    archimondesHatredReborn: ArchimondesHatredReborn,
    // Epics:
    drapeOfShame: DrapeOfShame,
    amalgamsSeventhSpine: AmalgamsSeventhSpine,
    darkmoonDeckPromises: DarkmoonDeckPromises,
    prePotion: PrePotion,
    gnawedThumbRing: GnawedThumbRing,
    // Tomb trinkets:
    archiveOfFaith: ArchiveOfFaith,
    barbaricMindslaver: BarbaricMindslaver,
    seaStar: SeaStar,
    deceiversGrandDesign: DeceiversGrandDesign,
    vialCeaslessToxins: VialOfCeaselessToxins,
    specterOfBetrayal: SpecterOfBetrayal,
    engineOfEradication: EngineOfEradication,
    tarnishedSentinelMedallion: TarnishedSentinelMedallion,
    spectralThurible: SpectralThurible,
    terrorFromBelow: TerrorFromBelow,
    tomeOfUnravelingSanity: TomeOfUnravelingSanity,
  };
  // Override this with spec specific modules
  static specModules = {};

  report = null;
  player = null;
  fight = null;

  modules = {};
  get activeModules() {
    return Object.keys(this.modules)
      .map(key => this.modules[key])
      .filter(module => module.active);
  }

  get playerId() {
    return this.player.id;
  }

  /** @returns {Combatant} */
  get selectedCombatant() {
    return this.modules.combatants.selected;
  }

  get currentTimestamp() {
    return this.finished ? this.fight.end_time : this._timestamp;
  }
  get fightDuration() {
    return this.currentTimestamp - this.fight.start_time;
  }
  get finished() {
    return this.modules.status.finished;
  }

  get playersById() {
    return this.report.friendlies.reduce((obj, player) => {
      obj[player.id] = player;
      return obj;
    }, {});
  }

  constructor(report, player, fight) {
    this.report = report;
    this.player = player;
    this.fight = fight;

    this.initializeModules({
      ...this.constructor.defaultModules,
      ...this.constructor.specModules,
    });
  }

  initializeModules(modules) {
    const failedModules = [];
    Object.keys(modules).forEach(desiredModuleName => {
      const moduleClass = modules[desiredModuleName];
      if (!moduleClass) {
        return;
      }

      const availableDependencies = {};
      const missingDependencies = [];
      if (moduleClass.dependencies) {
        Object.keys(moduleClass.dependencies).forEach(desiredDependencyName => {
          const dependencyClass = moduleClass.dependencies[desiredDependencyName];

          const dependencyModule = this.findModule(dependencyClass);
          if (dependencyModule) {
            availableDependencies[desiredDependencyName] = dependencyModule;
          } else {
            missingDependencies.push(dependencyClass);
          }
        });
      }

      if (missingDependencies.length === 0) {
        if (debug) {
          if (Object.keys(availableDependencies).length === 0) {
            console.log('Loading', moduleClass.name);
          } else {
            console.log('Loading', moduleClass.name, 'with dependencies:', Object.keys(availableDependencies));
          }
        }
        this.modules[desiredModuleName] = new moduleClass(this, availableDependencies, Object.keys(this.modules).length);
      } else {
        debug && console.warn(moduleClass.name, 'could not be loaded, missing dependencies:', missingDependencies.map(d => d.name));
        failedModules.push(desiredModuleName);
      }
    });

    if (failedModules.length !== 0) {
      debug && console.warn(`${failedModules.length} modules failed to load, trying again:`, failedModules.map(key => modules[key].name));
      const newBatch = {};
      failedModules.forEach(key => {
        newBatch[key] = modules[key];
      });
      this.initializeModules(newBatch);
    }
  }
  findModule(type) {
    return Object.keys(this.modules)
      .map(key => this.modules[key])
      .find(module => module instanceof type);
  }

  _debugEventHistory = [];
  parseEvents(events) {
    events = this.reorderEvents(events);
    if (process.env.NODE_ENV === 'development') {
      this._debugEventHistory = [
        ...this._debugEventHistory,
        ...events,
      ];
    }
    return new Promise((resolve, reject) => {
      events.forEach(event => {
        if (this.error) {
          throw new Error(this.error);
        }
        this._timestamp = event.timestamp;

        // Triggering a lot of events here for development pleasure; does this have a significant performance impact?
        this.triggerEvent(event.type, event);
      });

      resolve(events.length);
    });
  }

  reorderEvents(events) {
    this.activeModules
      .sort((a, b) => a.priority - b.priority) // lowest should go first, as `priority = 0` will have highest prio
      .forEach(module => {
        if (module.reorderEvents) {
          events = module.reorderEvents(events);
        }
      });
    return events;
  }

  triggerEvent(eventType, event, ...args) {
    this.activeModules
      .sort((a, b) => a.priority - b.priority) // lowest should go first, as `priority = 0` will have highest prio
      .forEach(module => module.triggerEvent(eventType, event, ...args));
  }

  byPlayer(event, playerId = this.player.id) {
    return (event.sourceID === playerId);
  }
  toPlayer(event, playerId = this.player.id) {
    return (event.targetID === playerId);
  }

  // TODO: Damage taken from LOTM

  getPercentageOfTotalHealingDone(healingDone) {
    return healingDone / this.modules.healingDone.total.effective;
  }
  formatItemHealingDone(healingDone) {
    return `${formatPercentage(this.getPercentageOfTotalHealingDone(healingDone))} % / ${formatNumber(healingDone / this.fightDuration * 1000)} HPS`;
  }
  formatItemAbsorbDone(absorbDone) {
    return `${formatNumber(absorbDone)}`;
  }
  getPercentageOfTotalDamageDone(damageDone) {
    return damageDone / this.modules.damageDone.total.effective;
  }
  formatItemDamageDone(damageDone) {
    return `${formatPercentage(this.getPercentageOfTotalDamageDone(damageDone))} % / ${formatNumber(damageDone / this.fightDuration * 1000)} DPS`;
  }

  generateResults() {
    const results = new ParseResults();

    this.activeModules
      .sort((a, b) => b.priority - a.priority)
      .forEach(module => {
        if (module.statistic) {
          const statistic = module.statistic();
          if (statistic) {
            results.statistics.push({
              statistic,
              order: module.statisticOrder,
            });
          }
        }
        if (module.item) {
          const item = module.item();
          if (item) {
            results.items.push(item);
          }
        }
        if (module.tab) {
          const tab = module.tab();
          if (tab) {
            results.tabs.push(tab);
          }
        }
        if (module.suggestions) {
          module.suggestions(results.suggestions.when);
        }
      });

    return results;
  }
}

export default CombatLogParser;
