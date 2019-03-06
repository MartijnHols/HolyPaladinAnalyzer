import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

import { Zerotorescue, tsabo, Gebuz, Aelexe } from 'CONTRIBUTORS';

export default [
  {
    date: new Date('2019-01-27'),
    changes: 'Improvements to the Nightblade analysis.',
    contributors: [tsabo],
  },
  {
    date: new Date('2019-01-19'),
    changes: 'Fix Shuriken Storm CP waste. Any Shuriken Storm that generates at least 3CPs will not be considered waste, otherwise waste will be limited by the CP pool size.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-12-28'),
    changes: 'Updates for 8.1, minor fixes.',
    contributors: [tsabo],
  },
  {
    date: new Date('2018-11-15'),
    changes: <>Fixed <SpellLink id={SPELLS.ARCANE_TORRENT_ENERGY.id} /> GCD.</>,
    contributors: [Aelexe],
  },
  {
    date: new Date('2018-11-13'),
    changes: <>Fixed cooldown tracking for <SpellLink id={SPELLS.MARKED_FOR_DEATH_TALENT.id} /> when targets die with the debuff.</>,
    contributors: [Aelexe],
  },
  {
    date: new Date('2018-11-11'),
    changes: <>Added suggestion for Sharpened Blades stack wastage.</>,
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
