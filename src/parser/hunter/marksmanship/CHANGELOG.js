import React from 'react';

import { Putro } from 'CONTRIBUTORS';
import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';

export default [
  {
    date: new Date('2018-09-28'),
    changes: <>Adds simple tracking for <SpellLink id={SPELLS.STEADY_AIM.id} /> azerite trait, and disables focus capping module when that trait is active.</>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-08-06'),
    changes: <>Adds initial tracking for <SpellLink id={SPELLS.STEADY_FOCUS_TALENT.id} /> to ensure the GCD is accurate in the analyzer.</>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-08-12'),
    changes: 'Removed all legendaries and tier gear in preparation for Battle for Azeroth launch',
    contributors: [Putro],
  },
  {
    date: new Date('2018-08-06'),
    changes: <>Adds buff indicators to relevant spells in the timeline, adjusted placement of statistic boxes and added example logs to everything BFA related.</>,
    contributors: [Putro],
  },
  {
    date: new Date('2018-07-23'),
    changes: 'Updated a large amount of modules to be ready for pre-patch and BFA. Updated patch combatility to 8.0.1.',
    contributors: [Putro],
  },
];
