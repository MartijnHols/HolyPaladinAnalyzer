import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import Analyzer from 'parser/core/Analyzer';
import AbilityTracker from 'parser/shared/modules/AbilityTracker';
import EnemyInstances, { encodeTargetString } from 'parser/shared/modules/EnemyInstances';

const debug = false;

const GUARANTEE_CRIT_SPELLS = [
  SPELLS.FIRE_BLAST.id,
  SPELLS.PHOENIX_FLAMES_TALENT.id,
];

class HeatingUp extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    enemies: EnemyInstances,
  };

  fireBlastWithoutHeatingUp = 0;
  phoenixFlamesWithoutHeatingUp = 0;
  fireBlastWithHotStreak = 0;
  phoenixFlamesWithHotStreak = 0;
  targetId = 0;
  currentHealth = 0;
  maxHealth = 0;

  constructor(...args) {
    super(...args);
    this.hasFirestarterTalent = this.selectedCombatant.hasTalent(SPELLS.FIRESTARTER_TALENT.id);
    this.hasSearingTouch = this.selectedCombatant.hasTalent(SPELLS.SEARING_TOUCH_TALENT.id);
    this.hasPhoenixFlames = this.selectedCombatant.hasTalent(SPELLS.PHOENIX_FLAMES_TALENT.id);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.PHOENIX_FLAMES_TALENT.id) {
      return;
    }
    this.targetId = encodeTargetString(event.targetID, event.targetInstance);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    const damageTarget = encodeTargetString(event.targetID, event.targetInstance);
    const combustionActive = this.selectedCombatant.hasBuff(SPELLS.COMBUSTION.id);
    const hasHotStreak = this.selectedCombatant.hasBuff(SPELLS.HOT_STREAK.id);
    if (this.selectedCombatant.hasTalent(SPELLS.FIRESTARTER_TALENT.id) && GUARANTEE_CRIT_SPELLS.includes(spellId)) {
      this.currentHealth = event.hitPoints;
      this.maxHealth = event.maxHitPoints;
    }
    if (!GUARANTEE_CRIT_SPELLS.includes(spellId) || (spellId === SPELLS.PHOENIX_FLAMES_TALENT.id && (this.targetId !== damageTarget))) {
      return;
    }

    if ((combustionActive || (this.hasFirestarterTalent && this.healthPercent > .90) || (this.hasSearingTouch && this.healthPercent < .30)) && !hasHotStreak) {
      debug && this.log("Event Ignored @ ");
    } else if (spellId === SPELLS.FIRE_BLAST.id) {
      if (this.selectedCombatant.hasBuff(SPELLS.HOT_STREAK.id)) {
        this.fireBlastWithHotStreak += 1;
        debug && this.log("Fire Blast with Hot Streak");
      } else if (!this.selectedCombatant.hasBuff(SPELLS.HEATING_UP.id)) {
        this.fireBlastWithoutHeatingUp += 1;
        debug && this.log("Fire Blast without Heating Up");
      }
    } else if (spellId === SPELLS.PHOENIX_FLAMES_TALENT.id) {
        if (this.selectedCombatant.hasBuff(SPELLS.HOT_STREAK.id)) {
          this.phoenixFlamesWithHotStreak += 1;
          debug && this.log("Phoenix Flames with Hot Streak");
        } else if (!this.selectedCombatant.hasBuff(SPELLS.HEATING_UP.id)) {
          this.phoenixFlamesWithoutHeatingUp += 1;
          debug && this.log("Phoenix Flames without Heating Up");
        }
    }
  }

  get fireBlastWasted() {
    return this.fireBlastWithoutHeatingUp + this.fireBlastWithHotStreak;
  }

  get phoenixFlamesWasted() {
    return this.phoenixFlamesWithoutHeatingUp + this.phoenixFlamesWithHotStreak;
  }

  get totalWasted() {
    return this.fireBlastWasted + this.phoenixFlamesWasted;
  }

  get fireBlastUtil() {
    return 1 - this.fireBlastMissedPercent;
  }

  get phoenixFlamesUtil() {
    return 1 - this.phoenixFlamesMissedPercent;
  }

  get fireBlastMissedPercent() {
    return this.fireBlastWasted / this.abilityTracker.getAbility(SPELLS.FIRE_BLAST.id).casts;
  }

  get phoenixFlamesMissedPercent() {
    return this.phoenixFlamesWasted / this.abilityTracker.getAbility(SPELLS.PHOENIX_FLAMES_TALENT.id).casts;
  }

  get healthPercent() {
    return this.currentHealth / this.maxHealth;
  }

  get fireBlastUtilSuggestionThresholds() {
    return {
      actual: this.fireBlastUtil,
      isLessThan: {
        minor: 0.95,
        average: 0.85,
        major: 0.70,
      },
      style: 'percentage',
    };
  }

  get phoenixFlamesUtilSuggestionThresholds() {
    return {
      actual: this.phoenixFlamesUtil,
      isLessThan: {
        minor: 0.90,
        average: 0.80,
        major: 0.70,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
		when(this.fireBlastUtilSuggestionThresholds)
			.addSuggestion((suggest, actual, recommended) => {
				return suggest(<>You cast <SpellLink id={SPELLS.FIRE_BLAST.id} /> {this.fireBlastWithHotStreak} times while <SpellLink id={SPELLS.HOT_STREAK.id} /> was active and {this.fireBlastWithoutHeatingUp} times while you didnt have <SpellLink id={SPELLS.HEATING_UP.id} />. Make sure that you are only using Fire Blast to convert Heating Up into Hot Streak.</>)
					.icon(SPELLS.FIRE_BLAST.icon)
					.actual(`${formatPercentage(this.fireBlastUtil)}% Utilization`)
					.recommended(`<${formatPercentage(recommended)}% is recommended`);
			});
    when(this.phoenixFlamesUtilSuggestionThresholds)
			.addSuggestion((suggest, actual, recommended) => {
				return suggest(<>You cast <SpellLink id={SPELLS.PHOENIX_FLAMES_TALENT.id} /> {this.phoenixFlamesWithHotStreak} times while <SpellLink id={SPELLS.HOT_STREAK.id} /> was active and {this.phoenixFlamesWithoutHeatingUp} times while you didnt have <SpellLink id={SPELLS.HEATING_UP.id} />. While ideally you should only be using these to convert Heating Up into Hot Streak, there are some minor circumstances where it is acceptable (i.e. If you are about to cap on Phoenixs Flames charges or when used alongside <SpellLink id={SPELLS.FIREBALL.id} /> to bait Heating Up or Hot Streak just before <SpellLink id={SPELLS.COMBUSTION.id} />.</>)
					.icon(SPELLS.PHOENIX_FLAMES_TALENT.icon)
					.actual(`${formatPercentage(this.phoenixFlamesUtil)}% Utilization`)
					.recommended(`<${formatPercentage(recommended)}% is recommended`);
			});
	}

  statistic() {
    if (this.hasPhoenixFlames) {
      return (
        <StatisticBox
          position={STATISTIC_ORDER.CORE(14)}
          icon={<SpellIcon id={SPELLS.HEATING_UP.id} />}
          value={(
            <span>
              <SpellIcon
                id={SPELLS.FIRE_BLAST.id}
                style={{
                  height: '1.2em',
                  marginBottom: '.15em',
                }}
              />
              {' '}{formatPercentage(this.fireBlastUtil, 0)}{' %'}
              <br />
              <SpellIcon
                id={SPELLS.PHOENIX_FLAMES_TALENT.id}
                style={{
                  height: '1.2em',
                  marginBottom: '.15em',
                }}
              />
              {' '}{formatPercentage(this.phoenixFlamesUtil, 0)}{' %'}
            </span>
          )}
          label="Heating Up Utilization"
          tooltip={`Spells that are guaranteed to crit like Fire Blast and Phoenix Flames should only be used to convert Heating Up to Hot Streak. While there are minor exceptions to this (like if you are about to cap on Phoenix Flames charges or using Fireball & Phoenixs Flames to bait Heating Up/Hot Streak just before Combustion), the goal should be to waste as few of these as possible.
            <ul>
              <li>Fireblast Used with no procs: ${this.fireBlastWithoutHeatingUp}</li>
              <li>Fireblast used during Hot Streak: ${this.fireBlastWithHotStreak}</li>
              <li>Phoenix Flames used with no procs: ${this.phoenixFlamesWithoutHeatingUp}</li>
              <li>Phoenix Flames used during Hot Streak: ${this.phoenixFlamesWithHotStreak}</li>
            </ul>`}
        />
      );
    } else {
      return (
        <StatisticBox
          position={STATISTIC_ORDER.CORE(14)}
          icon={<SpellIcon id={SPELLS.HEATING_UP.id} />}
          value={`${formatPercentage(this.fireBlastUtil, 0)} %`}
          label="Heating Up Utilization"
          tooltip={`Spells that are guaranteed to crit like Fire Blast should only be used to convert Heating Up to Hot Streak.
          <ul>
            <li>Fireblast Used with no procs: ${this.fireBlastWithoutHeatingUp}</li>
            <li>Fireblast used during Hot Streak: ${this.fireBlastWithHotStreak}</li>
          </ul>`}
        />
      );
    }
  }
}

export default HeatingUp;
