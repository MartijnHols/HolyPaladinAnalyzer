import { HawkCorrigan, niseko, mtblanton } from 'CONTRIBUTORS';

import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

export default [
  {
    date: new Date('2018-11-04'),
    changes: <>Added support for <SpellLink id={SPELLS.PACK_SPIRIT_TRAIT.id} /> and <SpellLink id={SPELLS.SERENE_SPIRIT_TRAIT.id} /> azerite traits.</>,
    contributors: [niseko],
  },
  {
    date: new Date('2018-11-01'),
    changes: <>Added support for <SpellLink id={SPELLS.ASTRAL_SHIFT.id} /> damage reduction.</>,
    contributors: [niseko],
  },
  {
    date: new Date('2018-10-24'),
    changes: 'Added "Use your offensive cooldowns..." to the Enhancement checklist',
    contributors: [mtblanton], 
  },
  {
    date: new Date('2018-10-19'),
    changes: 'Added "Always be casting" to the Enhancement checklist',
    contributors: [mtblanton],
  },
  {
    date: new Date('2018-09-16'),
    changes: 'Updated Enhancement Shaman for BfA.',
    contributors: [HawkCorrigan],
  },
];
