import React from 'react';

import { Chizu } from 'CONTRIBUTORS';
import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';

export default [
  {
    date: new Date('2018-10-08'),
    changes: <>Added simple <SpellLink id={SPELLS.NIGHTFALL_TALENT.id} />, <SpellLink id={SPELLS.DRAIN_SOUL_TALENT.id} /> and <SpellLink id={SPELLS.PHANTOM_SINGULARITY_TALENT.id} /> modules.</>,
    contributors: [Chizu],
  },
  {
    date: new Date('2018-09-30'),
    changes: <>Added <SpellLink id={SPELLS.SUMMON_DARKGLARE.id} /> module.</>,
    contributors: [Chizu],
  },
  {
    date: new Date('2018-09-21'),
    changes: 'Grouped dot uptimes and talents into their respective statistic boxes.',
    contributors: [Chizu],
  },
  {
    date: new Date('2018-09-21'),
    changes: 'Removed all legendaries and tier set modules.',
    contributors: [Chizu],
  },
  {
    date: new Date('2018-09-20'),
    changes: <>Added <SpellLink id={SPELLS.UNSTABLE_AFFLICTION_CAST.id} icon /> uptime module and added it into Checklist.</>,
    contributors: [Chizu],
  },
  {
    date: new Date('2018-09-20'),
    changes: <>Added <SpellLink id={SPELLS.DEATHBOLT_TALENT.id} icon /> module and made updates to <SpellLink id={SPELLS.HAUNT_TALENT.id} icon /> module.</>,
    contributors: [Chizu],
  },
  {
    date: new Date('2018-06-22'),
    changes: 'Updated the basics of the spec for BFA.',
    contributors: [Chizu],
  },
];
