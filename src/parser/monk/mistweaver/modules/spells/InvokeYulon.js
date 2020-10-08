import React from 'react';
import SPELLS from 'common/SPELLS';
import {Trans} from '@lingui/macro';
import Analyzer, { SELECTED_PLAYER, SELECTED_PLAYER_PET } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import { formatNumber } from 'common/format';
import ItemHealingDone from 'interface/ItemHealingDone';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';

class InvokeYulon extends Analyzer {
  soothHealing = 0;
  envelopHealing = 0;

  constructor(...args) {
    super(...args);
    this.active = !this.selectedCombatant.hasTalent(SPELLS.INVOKE_CHIJI_THE_RED_CRANE_TALENT.id);
    if (!this.active) return;
    this.addEventListener(Events.heal.by(SELECTED_PLAYER).spell(SPELLS.ENVELOPING_BREATH), this.handleEnvelopingBreath);
    this.addEventListener(Events.heal.by(SELECTED_PLAYER_PET).spell(SPELLS.SOOTHING_BREATH), this.handleSoothingBreath);
  }

  handleEnvelopingBreath(event) {
    this.envelopHealing += (event.amount || 0) + (event.absorbed || 0);
  }

  handleSoothingBreath(event) {
    this.soothHealing += (event.amount || 0) + (event.absorbed || 0);
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(50)}
        size="flexible"
        tooltip={
          <Trans>
                Healing Breakdown:
                <ul>
                  <li>{formatNumber(this.soothHealing)} healing from Soothing Breath.</li>
                  <li>{formatNumber(this.envelopHealing)} healing from Enveloping Breath.</li>
                </ul>
          </Trans>
        }
      >
        <BoringSpellValueText spell={SPELLS.INVOKE_YULON_THE_JADE_SERPENT}>
          <ItemHealingDone amount={this.soothHealing + this.envelopHealing} /><br />
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default InvokeYulon;
