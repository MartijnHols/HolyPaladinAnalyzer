import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import { formatNumber } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import Analyzer from 'parser/core/Analyzer';

class ThermalVoid extends Analyzer {
  casts = 0;
  buffApplied = 0;
  extraUptime = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.THERMAL_VOID_TALENT.id);
  }

  on_toPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.ICY_VEINS.id) {
      this.casts += 1;
      this.buffApplied = event.timestamp;
    }
  }

  on_finished() {
    if (this.selectedCombatant.hasBuff(SPELLS.ICY_VEINS.id)) {
      this.casts -= 1;
      this.extraUptime = this.owner.currentTimestamp - this.buffApplied;
    }
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.ICY_VEINS.id) - this.extraUptime;
  }

  get averageDuration() {
    return this.uptime / this.casts;
  }

  get averageDurationSeconds() {
    return this.averageDuration / 1000;
  }

  get suggestionThresholds() {
    return {
      actual: this.averageDuration / 1000,
      isLessThan: {
        minor: 40,
        average: 37,
        major: 33,
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>Your <SpellLink id={SPELLS.THERMAL_VOID_TALENT.id} /> duration boost can be improved. Make sure you use <SpellLink id={SPELLS.FROZEN_ORB.id} /> during <SpellLink id={SPELLS.ICY_VEINS.id} /> in order to get extra <SpellLink id={SPELLS.FINGERS_OF_FROST.id} /> Procs</>)
          .icon(SPELLS.ICY_VEINS.icon)
          .actual(`${formatNumber(actual)} seconds Average Icy Veins Duration`)
          .recommended(`${formatNumber(recommended)} is recommended`);
      });
  }

  statistic() {
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(100)}
        icon={<SpellIcon id={SPELLS.ICY_VEINS.id} />}
        value={`${formatNumber(this.averageDurationSeconds)}s`}
        label="Avg Icy Veins Duration"
        tooltip="Icy Veins Casts that do not complete before the fight ends are removed from this statistic"
      />
    );
  }
}

export default ThermalVoid;
