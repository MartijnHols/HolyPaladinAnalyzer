import React from 'react';
import PropTypes from 'prop-types';

import SPELLS from 'common/SPELLS';

const PRE_INTELLECT_POTION_BUFF = 900;

class MonkSpreadsheet extends React.Component {
  static propTypes = {
    parser: PropTypes.object.isRequired,
  };

  render() {
    const { parser } = this.props;

    const styles = {
      cellBorder: { borderTop: '.5px solid #dddddd' },
      table: { borderBottom: '1px solid #dddddd', borderTop: '1px solid #dddddd', align: 'left', padding: '10px', float: 'left', margin: '5px', borderCollapse: 'separate', borderSpacing: '10px 0' },
    };

    const getAbility = spellId => parser._modules.abilityTracker.getAbility(spellId);

    const overhealingSpell = spellId => (getAbility(spellId).healingOverheal || 0) / ((getAbility(spellId).healingOverheal || 0) + (getAbility(spellId).healingEffective || 0)) >= 0 ? ((getAbility(spellId).healingOverheal || 0) / ((getAbility(spellId).healingOverheal || 0) + (getAbility(spellId).healingEffective || 0))).toFixed(4) : '';

    const cpm = spellId => getAbility(spellId).casts / (parser.fightDuration / 1000 / 60) >= 0 ? (getAbility(spellId).casts / (parser.fightDuration / 1000 / 60)).toFixed(2) : '';

    const prePotion = parser._modules.prePotion.usedPrePotion ? PRE_INTELLECT_POTION_BUFF : 0;

    return (

      <div>
        <div style={{ padding: '0px 22px 15px 0px' }}>Please use the below table to populate the Player Log section of the Mistweaver Spreadsheet by Garg.                                                                                                                                    <a href="http://www.peakofserenity.com/mistweaver/spreadsheet/" target="_blank" rel="noopener noreferrer">Link to the sheet</a><br /></div>
        <div>
          <table style={styles.table}>
          <tbody>
            <tr><td>Intellect Rating</td><td>{parser.selectedCombatant._combatantInfo.intellect - prePotion}</td></tr>
            <tr><td>Critical Strike Rating</td><td>{parser.selectedCombatant._combatantInfo.critSpell}</td></tr>
            <tr><td>Haste Rating</td><td>{parser.selectedCombatant._combatantInfo.hasteSpell}</td></tr>
            <tr><td>Mastery Rating</td><td>{parser.selectedCombatant._combatantInfo.mastery}</td></tr>
            <tr><td>Versatility Rating</td><td>{parser.selectedCombatant._combatantInfo.versatilityHealingDone}</td></tr>
            <tr><td>Fight Length (s)</td><td>{Math.floor(parser.fightDuration / 1000)}</td></tr>
            <tr><td>Renewing Mists per Vivify</td><td>{parser._modules.vivify.averageRemPerVivify.toFixed(2) || ''}</td></tr>
            <tr><td>Renewing Mist Average Duration</td><td>{((getAbility(SPELLS.RENEWING_MIST_HEAL.id).healingHits / getAbility(SPELLS.RENEWING_MIST.id).casts) * 2).toFixed(2) || ''}</td></tr>
            <tr><td>Total Healing from Enveloping Mist Healing Bonus</td><td>{parser._modules.envelopingMists.healing.toFixed(2) || ''}</td></tr>
            <tr><td>Total healing from Life Cocoon HoT Bonus</td><td>{parser._modules.lifeCocoon.healing.toFixed(2)}</td></tr>
            <tr><td>Essence Font Bolts per Cast</td><td>{parser._modules.essenceFont.avgTargetsHitPerEF.toFixed(2) || ''}</td></tr>
            <tr><td>Essence Font HoT Effectiveness</td><td>{parser._modules.essenceFont.efHotOverlap}</td></tr>
            <tr><td>Revival Targets per Cast</td><td>{(getAbility(SPELLS.REVIVAL.id).healingHits / getAbility(SPELLS.REVIVAL.id).casts).toFixed(2) || ''}</td></tr>
            <tr><td>Gust of Mists from Essence Font HoT per Min</td><td>{((parser._modules.essenceFontMastery.healEF / 2) / (parser.fightDuration / 1000 / 60)).toFixed(2) || ''}</td></tr>
            <tr><td>Gust of Mists from Soothing Mist Deck per Min</td><td>{((parser._modules.soothingMist.gustProc) / (parser.fightDuration / 1000 / 60)).toFixed(2) || ''}</td></tr>
            <tr><td>Chi Burst Targets per Cast</td><td>{parser._modules.chiBurst.active === true ? (parser._modules.chiBurst.targetsChiBurst / parser._modules.chiBurst.castChiBurst).toFixed(2) : ''}</td></tr>
            <tr><td>Invoke Chi-Ji Crane Heal Casts</td><td>{parser._modules.chiJi.active === true ? (parser._modules.chiJi.casts / getAbility(SPELLS.INVOKE_CHIJI_THE_RED_CRANE_TALENT.id).casts).toFixed(2) : ''}</td></tr>
            <tr><td>Rising Mist Targets per Cast</td><td>{parser._modules.risingMist.active === true ? parser._modules.risingMist.averageTargetsPerRM.toFixed(2) : ''}</td></tr>
            <tr><td>Total Healing from Rising Mist HoT Extension</td><td>{parser._modules.risingMist.active === true ? parser._modules.risingMist.hotHealing.toFixed(2) : ''}</td></tr>
            <tr><td>Total Healing from Azerite Traits</td><td>{((getAbility(SPELLS.OVERFLOWING_MISTS_HEAL.id).healingEffective || 0) + (parser._modules.fontOfLife.healing || 0) + (parser._modules.invigoratingBrew.healing || 0) + (parser._modules.upliftedSpirits.healing || 0) + (getAbility(SPELLS.BURST_OF_LIFE_HEAL.id).healingEffective || 0)).toFixed(0)}</td></tr>
          </tbody>
          </table>
          <br />
          <br />
          <table style={styles.table}>
          <tbody>
              <tr><td>Renewing Mist</td><td>{overhealingSpell(SPELLS.RENEWING_MIST_HEAL.id)}</td><td>{cpm(SPELLS.RENEWING_MIST.id)}</td></tr>
              <tr><td>Enveloping Mist</td><td>{overhealingSpell(SPELLS.ENVELOPING_MIST.id)}</td><td>{cpm(SPELLS.ENVELOPING_MIST.id)}</td></tr>
              <tr><td>Essence Font Bolt</td><td>{overhealingSpell(SPELLS.ESSENCE_FONT_BUFF.id)}</td><td>{cpm(SPELLS.ESSENCE_FONT.id)}</td></tr>
              <tr><td>Essence Font HOT</td><td>{parser._modules.essenceFont.efHotOverhealing}</td><td> N/A </td></tr>
              <tr><td>Vivify</td><td>{overhealingSpell(SPELLS.VIVIFY.id)}</td><td>{cpm(SPELLS.VIVIFY.id)}</td></tr>
              <tr><td>Soothing Mist</td><td>{overhealingSpell(SPELLS.SOOTHING_MIST.id)}</td><td>{cpm(SPELLS.SOOTHING_MIST.id)}</td></tr>
              <tr><td>Gust of Mists</td><td>{overhealingSpell(SPELLS.GUSTS_OF_MISTS.id)}</td><td>{(getAbility(SPELLS.GUSTS_OF_MISTS.id).healingHits / Math.floor(parser.fightDuration / 1000 / 60) || 0).toFixed(2)}</td></tr>
              <tr><td>Life Cocoon</td><td>{overhealingSpell(SPELLS.LIFE_COCOON.id)}</td><td>{cpm(SPELLS.LIFE_COCOON.id)}</td></tr>
              <tr><td>Revival</td><td>{overhealingSpell(SPELLS.REVIVAL.id)}</td><td>{cpm(SPELLS.REVIVAL.id)}</td></tr>
              <tr><td>Chi Burst</td><td>{overhealingSpell(SPELLS.CHI_BURST_HEAL.id)}</td><td>{cpm(SPELLS.CHI_BURST_TALENT.id)}</td></tr>
              <tr><td>Chi Wave</td><td>{overhealingSpell(SPELLS.CHI_WAVE_TALENT.id)}</td><td>{cpm(SPELLS.CHI_WAVE_TALENT.id)}</td></tr>
              <tr><td>Refreshing Jade Wind</td><td>{overhealingSpell(SPELLS.REFRESHING_JADE_WIND_HEAL.id)}</td><td>{cpm(SPELLS.REFRESHING_JADE_WIND_TALENT.id)}</td></tr>
              <tr><td>Invoke Chi-Ji, the Red Crane</td><td>{(parser._modules.chiJi.active ? parser._modules.chiJi.chiJiOverHealing : '')}</td><td>{cpm(SPELLS.INVOKE_CHIJI_THE_RED_CRANE_TALENT.id)}</td></tr>
              <tr><td>Jade Serpent Statue</td><td>{(parser._modules.jadeSerpentStatue.active ? parser._modules.jadeSerpentStatue.jadeSerpentStatueOverHealing : '')}</td><td>{(parser._modules.jadeSerpentStatue.active ? (parser._modules.jadeSerpentStatue.casts / (parser.fightDuration / 1000 / 60)).toFixed(2) : '')}</td></tr>
          </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default MonkSpreadsheet;
