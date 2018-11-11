import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

import { tsabo, Cloake, Zerotorescue, Gebuz } from 'CONTRIBUTORS';

export default [
  {
    date: new Date('2018-11-05'),
    changes: 'Updated resource tracking to display percent instead of per minute, and added spenders to the energy tab.',
    contributors: [Gebuz],
  },
  {
    date: new Date('2018-11-05'),
    changes: 'Added Checklist.',
    contributors: [Gebuz],
  },
  {
    date: new Date('2018-11-04'),
    changes: <>Added suggestions for <SpellLink id={SPELLS.GARROTE.id} /> and <SpellLink id={SPELLS.RUPTURE.id} /> uptime.</>,
    contributors: [Gebuz],
  },
  {
    date: new Date('2018-11-04'),
    changes: 'Added cooldowns tab',
    contributors: [Gebuz],
  },
  {
    date: new Date('2018-11-04'),
    changes: 'Updated timeline with buffs & debuffs and added missing GCDs',
    contributors: [Gebuz],
  },
  {
    date: new Date('2018-08-02'),
    changes: 'Added natural energy regen.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-07-27'),
    changes: <>Added <SpellLink id={SPELLS.ELABORATE_PLANNING_TALENT.id} /> support.</>,
    contributors: [Cloake],
  },
  {
    date: new Date('2018-07-09'),
    changes: 'Added blindside support.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-07-07'),
    changes: 'Update for prepatch.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-06-24'),
    changes: 'Update all abilities to new BFA values.',
    contributors: [Zerotorescue],
  },
];
