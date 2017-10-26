import React from 'react';

import SPELLS from 'common/SPELLS';

import CoreCooldownTracker, { BUILT_IN_SUMMARY_TYPES } from 'Parser/Core/Modules/CooldownTracker';

import Tab from 'Main/Tab';
import CooldownOverview from 'Main/CooldownOverview';

class ProcTracker extends CoreCooldownTracker {
  static cooldownSpells = [
    {
      spell: SPELLS.ASCENDANCE_TALENT_ENHANCEMENT,
      summary: [
        BUILT_IN_SUMMARY_TYPES.DAMAGE,
      ],
    },
  ];

  tab() {
    return {
      title: 'Procs',
      url: 'procs',
      render: () => (
        <Tab title="Cooldowns">
          <CooldownOverview
            fightStart={this.owner.fight.start_time}
            fightEnd={this.owner.fight.end_time}
            cooldowns={this.pastCooldowns}
          />
        </Tab>
      ),
    };
  }
}

export default ProcTracker;
