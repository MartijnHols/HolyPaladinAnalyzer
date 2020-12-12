import React from 'react';

import Analyzer, { SELECTED_PLAYER, Options } from 'parser/core/Analyzer';
import { When, ThresholdStyle } from 'parser/core/ParseResults';
import Events, { CastEvent, DamageEvent, ApplyDebuffEvent, RemoveDebuffEvent, FightEndEvent } from 'parser/core/Events';
import EventHistory from 'parser/shared/modules/EventHistory';
import EnemyInstances from 'parser/shared/modules/EnemyInstances';
import SPELLS from 'common/SPELLS';
import COVENANTS from 'game/shadowlands/COVENANTS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatPercentage } from 'common/format';
import Statistic from 'interface/statistics/Statistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import { t } from '@lingui/macro';

const AFFECTED_CASTS = [
  SPELLS.FROSTBOLT,
  SPELLS.EBONBOLT_TALENT,
  SPELLS.GLACIAL_SPIKE_TALENT,
  SPELLS.ICE_LANCE,
  SPELLS.COMET_STORM_TALENT,
  SPELLS.ICE_NOVA_TALENT,
  SPELLS.RAY_OF_FROST_TALENT,
];

const AFFECTED_DAMAGE = [
  SPELLS.FROSTBOLT_DAMAGE,
  SPELLS.EBONBOLT_DAMAGE,
  SPELLS.GLACIAL_SPIKE_DAMAGE,
  SPELLS.ICE_LANCE_DAMAGE,
  SPELLS.COMET_STORM_TALENT,
  SPELLS.ICE_NOVA_TALENT,
  SPELLS.RAY_OF_FROST_TALENT,
];

const WINTERS_CHILL_SPENDERS = [
  SPELLS.ICE_LANCE_DAMAGE,
  SPELLS.GLACIAL_SPIKE_DAMAGE,
  SPELLS.ICE_NOVA_TALENT,
  SPELLS.RAY_OF_FROST_TALENT,
];

const WINTERS_CHILL_HARDCASTS = [
SPELLS.FROSTBOLT_DAMAGE,
SPELLS.EBONBOLT_DAMAGE,
SPELLS.GLACIAL_SPIKE_DAMAGE,
SPELLS.RADIANT_SPARK,
];

const debug = false;

class WintersChill extends Analyzer {
  static dependencies = {
    enemies: EnemyInstances,
    eventHistory: EventHistory,
  };
  protected enemies!: EnemyInstances;
  protected eventHistory!: EventHistory;

  hasGlacialSpike: boolean;
  hasEbonbolt: boolean;
  isVenthyr: boolean;

  totalProcs = 0;
  totalChillStacks = 0;
  preCastFound = false;
  preCastIgnored = false;
  preCastSpellId = 0;
  wintersChillHits: number[] = [];
  lastCastEvent?: CastEvent;
  goodShatteredCasts = 0;
  badShatteredCasts = 0;
  missedHardcasts = 0;
  missedShatters = 0;
  badShatters = 0;
  buffRemovedTimestamp = 0;

  constructor(options: Options) {
    super(options);
    this.hasGlacialSpike = this.selectedCombatant.hasTalent(SPELLS.GLACIAL_SPIKE_TALENT.id);
    this.hasEbonbolt = this.selectedCombatant.hasTalent(SPELLS.EBONBOLT_TALENT.id);
    this.isVenthyr = this.selectedCombatant.hasCovenant(COVENANTS.VENTHYR.id);

    this.addEventListener(Events.cast.by(SELECTED_PLAYER).spell(AFFECTED_CASTS), this.onCast);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER).spell(AFFECTED_DAMAGE), this.onDamage);
    this.addEventListener(Events.applydebuff.by(SELECTED_PLAYER).spell(SPELLS.WINTERS_CHILL), this.onDebuffApplied);
    this.addEventListener(Events.removedebuff.by(SELECTED_PLAYER).spell(SPELLS.WINTERS_CHILL), this.onDebuffRemoved);
    this.addEventListener(Events.fightend, this.onFinished);
  }

  onCast(event: CastEvent) {
    this.lastCastEvent = event;
  }

  onDamage(event: DamageEvent) {
    const spellId = event.ability.guid;
    const enemy = this.enemies.getEntity(event);

    if (!enemy || !enemy.hasBuff(SPELLS.WINTERS_CHILL.id)) {
      return;
    }

    if (this.isVenthyr && enemy.hasBuff(SPELLS.MIRRORS_OF_TORMENT.id)) {
      this.preCastIgnored = true;
    } else if (WINTERS_CHILL_HARDCASTS.some(acceptable => acceptable.id === spellId) || this.preCastSpellId === SPELLS.RADIANT_SPARK.id) {
      this.preCastFound = true;
    } else if (WINTERS_CHILL_SPENDERS.some(acceptable => acceptable.id === spellId)) {
      this.goodShatteredCasts += 1;
    } else {
      this.badShatteredCasts += 1;
    }

    this.wintersChillHits.push(spellId);
    this.lastCastEvent = undefined;
  }

  onDebuffApplied(event: ApplyDebuffEvent) {
    this.preCastFound = false;
    this.preCastIgnored = false;
    this.preCastSpellId = 0;
    this.goodShatteredCasts = 0;
    this.badShatteredCasts = 0;
    this.wintersChillHits = [];
    const preCastSpell: any = this.eventHistory.last(2,1000,Events.cast.by(SELECTED_PLAYER));
    this.totalProcs += 1;
    this.totalChillStacks += 2;

    if (preCastSpell.length <= 1) {
      this.preCastFound = false;
    } else {
      this.preCastFound = true;
      this.preCastSpellId = preCastSpell!.find((spell: any) => spell.ability.guid !== SPELLS.FLURRY.id).ability.guid;
    }
  }

  onDebuffRemoved(event: RemoveDebuffEvent) {
    if (debug) {
      this.log("Pre Cast Found: " + this.preCastFound);
      this.log("Pre Cast Spell ID: " + this.preCastSpellId);
      this.log("Good Shatters: " + this.goodShatteredCasts);
      this.log("Bad Shatters: " + this.badShatteredCasts);
      this.log("Winter Chill Hits: " + this.wintersChillHits);
    }

    if (!this.preCastFound && !this.preCastIgnored) {
      this.missedHardcasts += 1;
    }

    if (this.goodShatteredCasts + this.badShatteredCasts < 2) {
      this.missedShatters += (2 - this.goodShatteredCasts + this.badShatteredCasts);
    } else if (this.badShatteredCasts > 0) {
      this.badShatters += this.badShatteredCasts;
    }

    this.buffRemovedTimestamp = event.timestamp;
  }

  onFinished(event: FightEndEvent) {
    //If there was a Winters Chill applied that had not been removed yet when the fight ended, adjust the total chill stacks and missed shatters to account for what the player didnt have time to use
    //Only reduce the total and missed numbers by the amount that was unused. So if they shattered one of the 2 casts then only reduce by 1.
    if (this.buffRemovedTimestamp === event.timestamp) {
      this.totalChillStacks -= 2 - this.goodShatteredCasts + this.badShatteredCasts;
      this.missedShatters -= 2 - this.goodShatteredCasts + this.badShatteredCasts;
    }

  }

  get shatterMissedPercent() {
    return (this.badShatters + this.missedShatters) / this.totalChillStacks || 0;
  }

  get shatterUtil() {
    return 1 - this.shatterMissedPercent;
  }

  get hardcastMissedPercent() {
    return (this.missedHardcasts / this.totalProcs) || 0;
  }

  get hardcastUtil() {
    return 1 - this.hardcastMissedPercent;
  }

  // less strict than the ice lance suggestion both because it's less important,
  // and also because using a Brain Freeze after being forced to move is a good excuse for missing the hardcast.
  get wintersChillHardCastThresholds() {
    return {
      actual: this.hardcastUtil,
      isLessThan: {
        minor: 0.90,
        average: 0.80,
        major: 0.60,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  get wintersChillShatterThresholds() {
    return {
      actual: this.shatterUtil,
      isLessThan: {
        minor: 0.95,
        average: 0.85,
        major: 0.75,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  suggestions(when: When) {
    when(this.wintersChillShatterThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>You failed to properly take advantage of <SpellLink id={SPELLS.WINTERS_CHILL.id} /> on your target {this.badShatters + this.missedShatters} times ({formatPercentage(this.shatterMissedPercent)}%). After debuffing the target via <SpellLink id={SPELLS.BRAIN_FREEZE.id} /> and <SpellLink id={SPELLS.FLURRY.id} />, you should ensure that you hit the target with {this.hasGlacialSpike ? <>a <SpellLink id={SPELLS.GLACIAL_SPIKE_TALENT.id} /> and an <SpellLink id={SPELLS.ICE_LANCE.id} /> (If Glacial Spike is available), or </> : ''} two <SpellLink id={SPELLS.ICE_LANCE.id} />s before the <SpellLink id={SPELLS.WINTERS_CHILL.id} /> debuff expires to get the most out of <SpellLink id={SPELLS.SHATTER.id} />.</>)
          .icon(SPELLS.ICE_LANCE.icon)
          .actual(t({
      id: "mage.frost.suggestions.wintersChill.notShatteredIceLance",
      message: `${formatPercentage(this.shatterMissedPercent)}% Winter's Chill not shattered with Ice Lance`
    }))
          .recommended(`${formatPercentage(1 - recommended)}% is recommended`));
    when(this.wintersChillHardCastThresholds)
      .addSuggestion((suggest, actual, recommended) => suggest(<>You failed to use a pre-cast ability before spending your <SpellLink id={SPELLS.BRAIN_FREEZE.id} /> {this.missedHardcasts} times ({formatPercentage(this.hardcastMissedPercent)}%). Because of the travel time of <SpellLink id={SPELLS.FLURRY.id} />, you should cast a damaging ability such as <SpellLink id={SPELLS.FROSTBOLT.id} /> {this.hasEbonbolt ? <>or <SpellLink id={SPELLS.EBONBOLT_TALENT.id} /></> : ''} immediately before using your instant cast <SpellLink id={SPELLS.FLURRY.id} />. Doing this will allow your pre-cast ability to hit the target after <SpellLink id={SPELLS.FLURRY.id} /> (unless you are standing too close to the target) allowing it to benefit from <SpellLink id={SPELLS.SHATTER.id} />. If you are a Kyrian, it is also acceptable to pre-cast <SpellLink id={SPELLS.RADIANT_SPARK.id} /> instead.</>)
          .icon(SPELLS.FROSTBOLT.icon)
          .actual(t({
      id: "mage.frost.suggestions.wintersChill.notShattered",
      message: `${formatPercentage(this.hardcastMissedPercent)}% Winter's Chill not shattered with Frostbolt, Glacial Spike, or Ebonbolt`
    }))
          .recommended(`${formatPercentage(1 - recommended)}% is recommended`));
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(30)}
        size="flexible"
        tooltip={(
          <>
            When using your Brain Freeze procs, you should always ensure that you have something immediately before it (Like Frostbolt, Ebonbolt, or Radiant Spark) as well as 2 Ice Lance Casts (Or Glacial Spike + Ice Lance) immediately after to get the most out of the Winter's Chill debuff that is applied to the target. Doing so will allow the cast before and the 2 casts after to all benefit from Shatter. Note that if you are very close to your target, then the ability you used immediately before Flurry might hit the target too quickly and not get shattered.
          </>
        )}
      >
        <BoringSpellValueText spell={SPELLS.WINTERS_CHILL}>
          <SpellIcon id={SPELLS.WINTERS_CHILL.id} /> {formatPercentage(this.shatterUtil, 0)}% <small>Spells shattered</small><br />
          <SpellIcon id={SPELLS.FROSTBOLT.id} /> {formatPercentage(this.hardcastUtil, 0)}% <small>Pre-casts shattered</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default WintersChill;
