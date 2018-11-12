import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

import { Zerotorescue, tsabo, Gebuz, Aelexe } from 'CONTRIBUTORS';

export default [
  {
    date: new Date('2018-11-11'),
    changes: <>Added suggestion for <SpellLink id={SPELLS.SHARPENED_BLADES.id} /> stack wastage.</>,
    contributors: [Aelexe],
  },
  {
    date: new Date('2018-11-05'),
    changes: 'Updated resource tracking to display percent instead of per minute, and added spenders to the energy tab.',
    contributors: [Gebuz],
  },
  {
    date: new Date('2018-08-12'),
    changes: 'Initial Checklist.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-08-02'),
    changes: 'Added natural energy regen.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-07-15'),
    changes: 'Find Weakness usage analysis. Stealth ability usage analysis.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-07-07'),
    changes: 'Update analysis for PrePatch',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-06-27'),
    changes: 'Update all abilities to new BFA values.',
    contributors: [Zerotorescue],
  },
];
