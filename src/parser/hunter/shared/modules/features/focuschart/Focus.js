//Based on Main/Mana.js and parser/VengeanceDemonHunter/Modules/PainChart
//Note: For those that might wish to add Boss Health in the future- some of the work is already done here: https://github.com/leapis/WoWAnalyzer/tree/focusChartBossHealth

import React from 'react';
import PropTypes from 'prop-types';
import SPELLS from 'common/SPELLS';

import Haste from 'parser/shared/modules/Haste';

import FocusComponent from './FocusComponent';
import FocusChart from './FocusChart';

const PASSIVE_WASTE_THRESHOLD_PERCENTAGE = .03; // (wasted passive focus generated) / (total passive focus generated), anything higher will trigger "CAN BE IMPROVED"

//TODO: Purge the entire focuschart folder and implement the more modern implementation
class Focus extends React.PureComponent {
  static propTypes = {
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    playerHaste: PropTypes.number.isRequired,
    focusMax: PropTypes.number,
    focusPerSecond: PropTypes.array,
    tracker: PropTypes.number,
    secondsCapped: PropTypes.number,
    activeFocusGenerated: PropTypes.object,
    activeFocusWasted: PropTypes.object,
    generatorCasts: PropTypes.object,
    activeFocusWastedTimeline: PropTypes.object,
  };

  static dependencies = {
    haste: Haste,
  };

  get plot() {
    const {
      playerHaste,
      focusMax,
      start,
      end,
      focusPerSecond,
      activeFocusWastedTimeline,
    } = this.props;
    const focusGen = Math.round((10 + .1 * playerHaste / 375) * 100) / 100;

    //not it's own module since it's "fake data" meant to look visually accurate, not be numerically accurate
    let lastCatch = 0; //records the timestamp of the last event
    const overCapBySecond = [];
    const focusBySecond = [];
    const magicGraphNumber = Math.floor(focusMax / 2);
    let passiveWasteIndex = 0;
    if (focusPerSecond && activeFocusWastedTimeline) {
      focusPerSecond.forEach((item) => {
        const secIntoFight = Math.floor(passiveWasteIndex / 1000);
        if (Math.max(focusBySecond[secIntoFight], item) >= magicGraphNumber) { //aims to get highest peak
          focusBySecond[secIntoFight] = Math.max(focusBySecond[secIntoFight], item);
        } else if (Math.max(focusBySecond[secIntoFight], item) < magicGraphNumber) { //aims to get lowest valley
          focusBySecond[secIntoFight] = Math.min(focusBySecond[secIntoFight], item);
        } else if (!focusBySecond[secIntoFight]) {
          focusBySecond[secIntoFight] = item;
        }
        lastCatch = Math.floor(passiveWasteIndex / 1000);
        passiveWasteIndex++;
      });
      for (let i = 0; i < lastCatch; i++) { //extrapolates for passive focus gain
        if (!focusBySecond[i]) {
          if (focusBySecond[i - 1] > focusMax - focusGen) {
            focusBySecond[i] = focusMax;
          } else {
            focusBySecond[i] = focusBySecond[i - 1] + focusGen;
          }
        }
        if (focusBySecond[i] >= focusMax) {
          if (activeFocusWastedTimeline[i]) {
            overCapBySecond[i] = focusGen + activeFocusWastedTimeline[i];
          } else {
            overCapBySecond[i] = focusGen;
          }
        } else if (activeFocusWastedTimeline[i] && focusBySecond[i] + activeFocusWastedTimeline[i] > focusMax) {
          overCapBySecond[i] = (focusBySecond[i] + activeFocusWastedTimeline[i]) - focusMax;
        } else {
          overCapBySecond[i] = 0;
        }
      }
    }

    const fightDurationSec = Math.floor((end - start) / 1000);
    for (let i = 0; i <= fightDurationSec; i += 1) {
      focusBySecond[i] = focusBySecond[i] !== undefined ? focusBySecond[i] : null;
      if (focusBySecond[i] !== null) {
        focusBySecond[i] = focusBySecond[i] > 0 ? focusBySecond[i] : 0;
      }
      overCapBySecond[i] = overCapBySecond[i] !== undefined ? overCapBySecond[i] : null;
    }

    // transform the data to a format react-vis uses
    const focus = Object.entries(focusBySecond).map(([key, value]) => ({ x: Number(key), y: value }));
    const wasted = Object.entries(overCapBySecond).map(([key, value]) => ({ x: Number(key), y: value }));

    return (
      <FocusChart
        maxFocus={focusMax}
        focus={focus}
        wasted={wasted}
      />
    );
  }

  render() {
    if (!this.props.tracker) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    const {
      playerHaste,
      start,
      end,
      secondsCapped, //counts time focus capped (in seconds)
      generatorCasts,
      activeFocusWasted,
      activeFocusGenerated,
    } = this.props;

    const focusGen = Math.round((10 + .1 * playerHaste / 375) * 100) / 100;

    //not it's own module since it's "fake data" meant to look visually accurate, not be numerically accurate
    const abilitiesAll = {};
    const categories = {
      generated: 'Focus Generators',
      //spent: 'Focus Spenders', //I see no reason to display focus spenders, but leaving this in if someone later wants to add them
    };
    if (generatorCasts && activeFocusWasted && activeFocusGenerated) {
      Object.keys(generatorCasts).forEach(generator => {
        const spell = SPELLS[generator];
        if (!spell) {
          throw new Error(`Missing spell: ${generator}`);
        }
        abilitiesAll[`${generator}_gen`] = {
          ability: {
            category: 'Focus Generators',
            name: spell.name,
            spellId: Number(generator),
          },
          casts: generatorCasts[generator],
          created: activeFocusGenerated[generator],
          wasted: activeFocusWasted[generator],
        };
      });
    }

    const abilities = Object.keys(abilitiesAll).map(key => abilitiesAll[key]);
    abilities.sort((a, b) => {
      if (a.created < b.created) {
        return 1;
      } else if (a.created === b.created) {
        return 0;
      }
      return -1;
    });

    const fightDurationSec = Math.floor((end - start) / 1000);
    const wastedFocus = Math.round(secondsCapped * focusGen);
    const totalFocus = Math.floor(fightDurationSec * focusGen);
    let ratingOfPassiveWaste = '';
    if ((secondsCapped / totalFocus) > PASSIVE_WASTE_THRESHOLD_PERCENTAGE) {
      ratingOfPassiveWaste = 'Can be improved.';
    }
    const totalWasted = [totalFocus, wastedFocus, ratingOfPassiveWaste];

    return (
      <div>
        {this.plot}
        <FocusComponent
          abilities={abilities}
          categories={categories}
          passive={(totalWasted)}
        />
      </div>
    );

  }
}

export default Focus;
