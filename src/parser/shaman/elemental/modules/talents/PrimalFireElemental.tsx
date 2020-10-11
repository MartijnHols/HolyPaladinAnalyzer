import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { formatNumber } from 'common/format';

import Analyzer, { Options, SELECTED_PLAYER, SELECTED_PLAYER_PET } from 'parser/core/Analyzer';

import { STATISTIC_ORDER } from 'interface/others/StatisticBox';
import Events, { CastEvent, DamageEvent } from 'parser/core/Events';
import { When } from 'parser/core/ParseResults';
import ItemDamageDone from 'interface/ItemDamageDone';
import Statistic from 'interface/statistics/Statistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

const damagingCasts = [SPELLS.FIRE_ELEMENTAL_METEOR.id, SPELLS.FIRE_ELEMENTAL_IMMOLATE.id, SPELLS.FIRE_ELEMENTAL_FIRE_BLAST.id];

class PrimalFireElemental extends Analyzer {
  meteorCasts: number = 0;
  PFEcasts: number = 0;

  usedCasts: {[key: number]: boolean};

  damageGained: number = 0;
  maelstromGained: number = 0;

  constructor(options: Options) {
    super(options);
    this.usedCasts = {
      [SPELLS.METEOR.id] : false,
      [SPELLS.IMMOLATE.id] : false,
      [SPELLS.FIRE_BLAST.id]: false,
    };
    this.active = this.selectedCombatant.hasTalent(SPELLS.PRIMAL_ELEMENTALIST_TALENT.id)
      && (!this.selectedCombatant.hasTalent(SPELLS.STORM_ELEMENTAL_TALENT.id));
    this.addEventListener(Events.damage.by(SELECTED_PLAYER_PET).spell(damagingCasts), this.onDamage);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(SPELLS.FIRE_ELEMENTAL), this.onFECast);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER_PET).spell(damagingCasts), this.onDamagingCast);
  }

  onDamage(event: DamageEvent) {
    this.damageGained+=event.amount;
  }

  onFECast(event: CastEvent) {
    this.PFEcasts += 1;
  }

  onDamagingCast(event: CastEvent) {
    this.usedCasts[event.ability.guid] = true;
  }

  get missedMeteorCasts() {
    return this.PFEcasts-this.meteorCasts;
  }

  suggestions(when: When) {
    const unusedSpells = Object.keys(this.usedCasts).filter(key => !this.usedCasts[Number(key)]);
    const unusedSpellsString = unusedSpells.join(', ');
    const unusedSpellsCount = unusedSpells.length;
    when(unusedSpellsCount).isGreaterThan(0)
      .addSuggestion((suggest, actual, recommended) => suggest(<span> Your Fire Elemental is not using all of it's spells. Check if immolate and Fire Blast are set to autocast and you are using Meteor.</span>)
          .icon(SPELLS.FIRE_ELEMENTAL.icon)
          .actual(`${formatNumber(unusedSpellsCount)} spells not used by your Fire Elemental (${unusedSpellsString})`)
          .recommended(`You should be using all spells of your Fire Elemental.`)
          .major(recommended+1));
    when(this.missedMeteorCasts).isGreaterThan(0)
      .addSuggestion((suggest, actual, recommended) => suggest(<span>You are not using <SpellLink id={SPELLS.FIRE_ELEMENTAL_METEOR.id} /> every time you cast <SpellLink id={SPELLS.FIRE_ELEMENTAL.id} /> if you are using <SpellLink id={SPELLS.PRIMAL_ELEMENTALIST_TALENT.id} />. Only wait with casting meteor if you wait for adds to spawn.</span>)
          .icon(SPELLS.FIRE_ELEMENTAL.icon)
          .actual(`${formatNumber(this.missedMeteorCasts)} missed Meteor Casts.`)
          .recommended(`You should cast Meteor every time you summon your Fire Elemental `)
          .major(recommended+1));
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL()}
        size="flexible"
        >
        <>
          <BoringSpellValueText spell={SPELLS.FIRE_ELEMENTAL}>
            <ItemDamageDone amount={this.damageGained} />
          </BoringSpellValueText>
        </>
      </Statistic>
    );
  }
}

export default PrimalFireElemental;