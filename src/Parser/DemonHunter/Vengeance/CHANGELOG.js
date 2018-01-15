import React from 'react';

import { Mamtooth } from 'MAINTAINERS';
import Wrapper from 'common/Wrapper';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

export default [
  { 
    date: new Date('2017-09-03'),
    changes: 'Changed the Github link for the issues of Vengeance spec.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-02'),
    changes: 'Pain chart now displays a error message for corrupted logs.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-10-13'),
    changes: 'Pain chart bug fix.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-10-12'),
    changes: <Wrapper>Cooldown tab for <SpellLink id={SPELLS.METAMORPHOSIS_TANK.id} /> is now implemented.</Wrapper>,
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-10-12'),
    changes: 'Updated \'More Information\' tab, with introduction text and links.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-23'),
    changes: 'Tier 20 - 2 and 4 piece bonus is now being tracked.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-16'),
    changes: 'Created a Soul Fragments tracker (with total generated/spent/wasted/unused) and improvement suggestion for wasted Soul Fragments.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-16'),
    changes: <Wrapper><SpellLink id={SPELLS.SPIRIT_BOMB_TALENT.id} /> is now on statistics boxes too.</Wrapper>,
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-09'),
    changes: 'Some nearly unused abilities and/or no CD abilities now doesn\'t show \'can be improved\' in Cast Efficiency tab.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-07'),
    changes: 'Abilities now trigger mouseover tooltips on statistic boxes.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-07'),
    changes: 'Updated timers in the statistics tooltips.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-06'),
    changes: <Wrapper>Added more suggestions to <SpellLink id={SPELLS.IMMOLATION_AURA_BUFF.id} /> buff uptime.</Wrapper>,
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-09-06'),
    changes: <Wrapper>Fixed <SpellLink id={SPELLS.SIGIL_OF_FLAME_DEBUFF.id} /> debuff uptime to best fit in more cases.</Wrapper>,
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-08-27'),
    changes: <Wrapper>Fixed a bug with <SpellLink id={SPELLS.SPIRIT_BOMB_TALENT.id} /> uptime suggestions and modified the Dead GCD recommended time (ABC).</Wrapper>,
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-08-20'),
    changes: <Wrapper>Added Pain tracker chart and changed <SpellLink id={SPELLS.SPIRIT_BOMB_TALENT.id} /> uptime buff to <SpellLink id={SPELLS.FRAILTY_SPIRIT_BOMB_DEBUFF.id} /> debuff uptime.</Wrapper>,
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-08-19'),
    changes: 'Added more useful and specific statistics tooltips.',
    contributors: [Mamtooth],
  },
  { 
    date: new Date('2017-08-16'),
    changes: 'Added Vengeance Demon Hunter support.',
    contributors: [Mamtooth],
  },
];
