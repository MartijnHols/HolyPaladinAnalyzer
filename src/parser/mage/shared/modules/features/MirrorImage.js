import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import Analyzer from 'parser/core/Analyzer';

const INCANTERS_FLOW_EXPECTED_BOOST = 0.12;

class MirrorImage extends Analyzer {
  // all images summoned by player seem to have the same sourceID, and vary only by instanceID
  mirrorImagesId;
  damage = 0;

  constructor(...args) {
    super(...args);
	   this.active = this.selectedCombatant.hasTalent(SPELLS.MIRROR_IMAGE_TALENT.id);
  }

  on_byPlayer_summon(event) {
    // there are a dozen different Mirror Image summon IDs which is used where or why... this is the easy way out
    if(event.ability.name === SPELLS.MIRROR_IMAGE_SUMMON.name) {
      this.mirrorImagesId = event.targetID;
    }
  }

  on_byPlayerPet_damage(event) {
    if(this.mirrorImagesId === event.sourceID) {
      this.damage += event.amount + (event.absorbed || 0);
    }
  }

  get damagePercent() {
    return this.owner.getPercentageOfTotalDamageDone(this.damage);
  }

  get damageIncreasePercent() {
    return this.damagePercent / (1 - this.damagePercent);
  }

  get damageSuggestionThresholds() {
    return {
      actual: this.damageIncreasePercent,
      isLessThan: {
        minor: INCANTERS_FLOW_EXPECTED_BOOST,
        average: INCANTERS_FLOW_EXPECTED_BOOST,
        major: INCANTERS_FLOW_EXPECTED_BOOST - 0.03,
      },
      style: 'percentage',
    };
  }

  suggestions(when) {
    when(this.damageSuggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<>Your <SpellLink id={SPELLS.MIRROR_IMAGE_TALENT.id} /> damage is below the expected passive gain from <SpellLink id={SPELLS.INCANTERS_FLOW_TALENT.id} />. Consider switching to <SpellLink id={SPELLS.INCANTERS_FLOW_TALENT.id} />.</>)
          .icon(SPELLS.MIRROR_IMAGE_TALENT.icon)
          .actual(`${formatPercentage(this.damageIncreasePercent)}% damage increase from Mirror Image`)
          .recommended(`${formatPercentage(recommended)}% is the passive gain from Incanter's Flow`);
        });
  }

  statistic() {
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(100)}
        icon={<SpellIcon id={SPELLS.MIRROR_IMAGE_TALENT.id} />}
        value={`${formatPercentage(this.damagePercent)} %`}
        label="Mirror Image damage"
        tooltip={`This is the portion of your total damage attributable to Mirror Image. Expressed as an increase vs never using Mirror Image, this is a <b>${formatPercentage(this.damageIncreasePercent)}% damage increase</b>.`}
      />
    );
  }
}

export default MirrorImage;
