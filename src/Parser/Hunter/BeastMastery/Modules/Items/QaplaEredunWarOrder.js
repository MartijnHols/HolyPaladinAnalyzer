import React from 'react';

import SPELLS from 'common/SPELLS';
import Analyzer from 'Parser/Core/Analyzer';
import SpellUsable from 'Parser/Core/Modules/SpellUsable';
import { formatNumber, formatPercentage } from 'common/format';
import ITEMS from "common/ITEMS/HUNTER";
import SpellLink from "common/SpellLink";
import GlobalCooldown from 'Parser/Core/Modules/GlobalCooldown';
import SUGGESTION_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';
import ItemLink from 'common/ItemLink';

const COOLDOWN_REDUCTION_MS = 3000;

/**
 * Qa'pla, Eredun War Order
 * Barbed Shot reduces the remaining cooldown on Kill Command by 3 sec.
 */
class QaplaEredunWarOrder extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    globalCooldown: GlobalCooldown,
  };

  effectiveKillCommandReductionMs = 0;
  wastedKillCommandReductionMs = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasFeet(ITEMS.QAPLA_EREDUN_WAR_ORDER.id);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.BARBED_SHOT.id) {
      return;
    }
    if (this.spellUsable.isOnCooldown(SPELLS.KILL_COMMAND.id)) {
      const globalCooldown = this.globalCooldown.getGlobalCooldownDuration(spellId);
      if (this.spellUsable.cooldownRemaining(SPELLS.KILL_COMMAND.id) < (COOLDOWN_REDUCTION_MS + globalCooldown)) {
        const effectiveReductionMs = this.spellUsable.cooldownRemaining(SPELLS.KILL_COMMAND.id) - globalCooldown;
        this.effectiveKillCommandReductionMs += effectiveReductionMs;
        this.wastedKillCommandReductionMs += (COOLDOWN_REDUCTION_MS - effectiveReductionMs);
      } else {
        const reductionMs = this.spellUsable.reduceCooldown(SPELLS.KILL_COMMAND.id, COOLDOWN_REDUCTION_MS);
        this.effectiveKillCommandReductionMs += reductionMs;
      }
    } else {
      this.wastedKillCommandReductionMs += COOLDOWN_REDUCTION_MS;
    }
  }

  wastedKillCommandCDRPercent() {
    return this.wastedKillCommandReductionMs / (this.wastedKillCommandReductionMs + this.effectiveKillCommandReductionMs);
  }

  averageEffectiveCDR() {
    return (this.effectiveKillCommandReductionMs / ((this.wastedKillCommandReductionMs + this.effectiveKillCommandReductionMs) / (COOLDOWN_REDUCTION_MS / 1000)));
  }

  get wastedSuggestionThreshold() {
    return {
      actual: this.averageEffectiveCDR(),
      isLessThan: {
        minor: 2.5,
        average: 2.25,
        major: 2,
      },
      style: 'decimal',
    };
  }

  get killerCobraThreshold() {
    return {
      actual: this.selectedCombatant.hasTalent(SPELLS.KILLER_COBRA_TALENT.id),
      isEqual: true,
      style: 'boolean',
    };
  }

  suggestions(when) {
    when(this.killerCobraThreshold).addSuggestion((suggest) => {
      return suggest(<React.Fragment>Due to the <SpellLink id={SPELLS.KILL_COMMAND.id} /> reduction capabilities of both <ItemLink id={ITEMS.QAPLA_EREDUN_WAR_ORDER.id} /> and <SpellLink id={SPELLS.KILLER_COBRA_TALENT.id} />, using them together is generally not recommended. </React.Fragment>)
        .icon(ITEMS.QAPLA_EREDUN_WAR_ORDER.icon)
        .actual(`You had both Qa'pla, Eredun War Order equipped and talented Killer Cobra`)
        .recommended(`Only one or the other is recommended`)
        .staticImportance(SUGGESTION_IMPORTANCE.MINOR);

    });
    when(this.wastedSuggestionThreshold).addSuggestion((suggest, actual, recommended) => {
      return suggest(<React.Fragment>Your average cast of <SpellLink id={SPELLS.BARBED_SHOT.id} /> reduced <SpellLink id={SPELLS.KILL_COMMAND.id} /> by less than {recommended} seconds. Try and optimise this legendary by making sure to utilise it's cooldown reduction utility better. </React.Fragment>)
        .icon(ITEMS.QAPLA_EREDUN_WAR_ORDER.icon)
        .actual(`${(actual).toFixed(2)} average seconds of CDR per Barbed Shot cast`)
        .recommended(`>${recommended}sec is recommended`);
    });
  }
  item() {
    return {
      item: ITEMS.QAPLA_EREDUN_WAR_ORDER,
      result: (
        <dfn data-tip={`You wasted ${formatNumber(this.wastedKillCommandReductionMs / 1000)} (${formatPercentage(this.wastedKillCommandCDRPercent())}%) seconds of CDR by using Dire Beast when Kill Command wasn't on cooldown or had less than 3 seconds remaning on CD.`}>
          reduced <SpellLink id={SPELLS.KILL_COMMAND.id} /> CD by {formatNumber(this.effectiveKillCommandReductionMs / 1000)}s in total.
        </dfn>
      ),
    };
  }
}

export default QaplaEredunWarOrder;
