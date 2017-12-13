// Heavily inspired by resource breakdown in Feral and Retribution
import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import Tab from 'Main/Tab';
import StatisticBox, { STATISTIC_ORDER } from 'Main/StatisticBox';

import ChiBreakdown from './ChiBreakdown';
import ChiTracker from './ChiTracker';

import WastedChiIcon from '../../images/ability_monk_forcesphere.jpg';


class ChiDetails extends Analyzer {
    static dependencies = {
        chiTracker: ChiTracker,
    };

    suggestions(when) {
        const chiWasted = this.chiTracker.chiWasted;
        const chiWastedPerMinute = (chiWasted / this.owner.fightDuration) * 1000 * 60;
        const MINOR = 0;
        const AVG = 1;
        const MAJOR = 2;
        when(chiWastedPerMinute).isGreaterThan(MINOR)
            .addSuggestion((suggest, actual, recommended) => {
                return suggest('You are wasting Chi. Try to use it and not let it cap and go to waste')
                    .icon('creatureportrait_bubble')
                    .actual(`${chiWasted} Chi wasted (${chiWastedPerMinute.toFixed(2)} per minute)`)
                    .recommended(`${recommended.toFixed(2)} Chi wasted is recommended`)
                    .regular(AVG).major(MAJOR);
            });
    }

    statistic() {
        const chiWasted = this.chiTracker.chiWasted;
        return (
            <StatisticBox
            icon={(
              <img
                src={WastedChiIcon}
                alt="Wasted Chi"
              />
            )}
                value={`${chiWasted}`}
                label="Wasted Chi"
            />
        );
    }

    tab() {
        return {
            title: 'Chi',
            url: 'chi',
            render: () => (
              <Tab title="Chi usage breakdown">
                <ChiBreakdown
                  chiGained={this.chiTracker.gained}
                  chiSpent={this.chiTracker.spent}
                  chiWasted={this.chiTracker.wasted}
                  chiCast={this.chiTracker.casts}
                    />
                </Tab>
            ),
        };
    }

    statisticOrder = STATISTIC_ORDER.CORE(2);
}

export default ChiDetails;
