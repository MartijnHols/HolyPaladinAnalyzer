import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS';
import TalentStatisticBox, { STATISTIC_ORDER } from 'interface/others/TalentStatisticBox';
import STATISTIC_CATEGORY from 'interface/others/STATISTIC_CATEGORY';
import SpellIcon from 'common/SpellIcon';
import React from 'react';
import HolyWordSanctify from 'parser/priest/holy/modules/spells/holyword/HolyWordSanctify';
import HolyWordSerenity from 'parser/priest/holy/modules/spells/holyword/HolyWordSerenity';
import HolyWordChastise from 'parser/priest/holy/modules/spells/holyword/HolyWordChastise';
import { formatNumber } from 'common/format';
import ItemManaGained from 'interface/others/ItemManaGained';

// Example Log: /report/NfFqTvxrQ8GLWDpY/12-Normal+Fetid+Devourer+-+Kill+(1:25)/6-Yrret
class Apotheosis extends Analyzer {
  static dependencies = {
    sanctify: HolyWordSanctify,
    serenity: HolyWordSerenity,
    chastise: HolyWordChastise,
  };

  apotheosisCasts = 0;
  apotheosisActive = false;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.APOTHEOSIS_TALENT.id);
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.APOTHEOSIS_TALENT.id) {
      this.apotheosisCasts++;
      this.apotheosisActive = true;
    }
  }

  on_byPlayer_removebuff(event) {
    const spellId = event.ability.guid;
    if (spellId === SPELLS.APOTHEOSIS_TALENT.id) {
      this.apotheosisActive = false;
    }
  }

  statistic() {
    return (

      <TalentStatisticBox
        category={STATISTIC_CATEGORY.TALENTS}
        icon={<SpellIcon id={SPELLS.APOTHEOSIS_TALENT.id} />}
        value={(
          <>
            <ItemManaGained amount={this.sanctify.apotheosisManaReduction + this.serenity.apotheosisManaReduction + this.chastise.apotheosisManaReduction} /><br />
            {formatNumber((this.sanctify.apotheosisCooldownReduction + this.serenity.apotheosisCooldownReduction + this.chastise.apotheosisCooldownReduction) / 1000)}s Cooldown Reduction
          </>
        )}
        label="Apotheosis"
        tooltip={`
          Serenity: ${this.sanctify.apotheosisCooldownReduction / 1000}s CDR | ${this.sanctify.apotheosisManaReduction} Mana saved <br />
          Sanctify: ${this.serenity.apotheosisCooldownReduction / 1000}s CDR | ${this.serenity.apotheosisManaReduction} Mana saved <br />
          Chastise: ${this.chastise.apotheosisCooldownReduction / 1000}s CDR | ${this.chastise.apotheosisManaReduction} Mana saved
        `}
        position={STATISTIC_ORDER.CORE(7)}
      />

    );
  }
}

export default Apotheosis;
