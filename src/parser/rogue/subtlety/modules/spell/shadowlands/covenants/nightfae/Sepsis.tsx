import React from 'react';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Abilities from 'parser/core/modules/Abilities';
import SPELLS from 'common/SPELLS';
import Events, { DamageEvent } from 'parser/core/Events';
import Statistic from 'interface/statistics/Statistic';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import COVENANTS from 'game/shadowlands/COVENANTS';
import ItemDamageDone from 'interface/ItemDamageDone';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

class EchoingReprimand extends Analyzer {
  static dependencies = {
    abilities: Abilities,
  };
  damage: number = 0;
  poisonDamage: number = 0;
  protected abilities!: Abilities;

  constructor(options: any) {
    super(options);
    this.active = this.selectedCombatant.hasCovenant(COVENANTS.NIGHT_FAE.id);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(SPELLS.SEPSIS), this.onDamage);
    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.SEPSIS_POISON),
      this.onPoisonDamage,
    );
  }

  onDamage(event: DamageEvent) {
    this.damage += event.amount + (event.absorbed || 0);
  }

  onPoisonDamage(event: DamageEvent) {
    this.damage += event.amount + (event.absorbed || 0);
    this.poisonDamage += event.amount + (event.absorbed || 0);
  }

  statistic() {
    return (
      <>
        <Statistic
          position={STATISTIC_ORDER.CORE()}
          size="flexible"
          category={STATISTIC_CATEGORY.COVENANTS}
        >
          <BoringSpellValueText spell={SPELLS.SEPSIS}>
            <>
              <ItemDamageDone amount={this.damage} />
              <ItemDamageDone amount={this.poisonDamage} />
            </>
          </BoringSpellValueText>
        </Statistic>
      </>
    );
  }
}

export default EchoingReprimand;