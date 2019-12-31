import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import ItemDamageDone from 'interface/ItemDamageDone';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

/**
 *
 * Summons a Spitting Cobra for 20 sec that attacks your target for (31.2% of Attack power) Nature damage every 2 sec.
 * While the Cobra is active you gain 2 Focus every sec. * Increases the effectiveness of your pet's Predator's Thirst, Endurance Training, and Pathfinding passives by 50%.
 *
 * Example log: https://www.warcraftlogs.com/reports/Z6GjqpNcvw3kBAL2#fight=3&type=damage-done
 */

class SpittingCobra extends Analyzer {

  damage = 0;
  focusGained = 0;
  focusWasted = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.SPITTING_COBRA_TALENT.id);
  }

  on_byPlayer_energize(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.SPITTING_COBRA_TALENT.id) {
      return;
    }
    this.focusGained += event.resourceChange - event.waste;
    this.focusWasted += event.waste;
  }

  on_byPlayerPet_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.SPITTING_COBRA_DAMAGE.id) {
      return;
    }
    this.damage += event.amount + (event.absorbed || 0);
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL(13)}
        size="flexible"
        category={'TALENTS'}
        tooltip={(
          <>
            You wasted {this.focusWasted} focus by being too close to focus cap when Spitting Cobra gave you focus.
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.SPITTING_COBRA_TALENT}>
          <>
            <ItemDamageDone amount={this.damage} /> <br />
            {this.focusGained} <small>focus gained</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default SpittingCobra;
