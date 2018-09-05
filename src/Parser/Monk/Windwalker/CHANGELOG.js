import { Juko8, Coryn, Talby, Anomoly, AttilioLH, Hewhosmites } from 'CONTRIBUTORS';

import React from 'react';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

export default [
  {
    date: new Date('2018-09-04'),
    changes: <React.Fragment>Added Azerite statistics for <SpellLink id={SPELLS.IRON_FISTS.id} /> and <SpellLink id={SPELLS.MERIDIAN_STRIKES.id} /> </React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-08-31'),
    changes: 'Removed "Casts in Storm, Earth and Fire/Serenity statistics" since it\'s no longer providing accurate analysis',
    contributors: [Juko8],
  },
  {
    date: new Date('2018-08-29'),
    changes: 'Removed legion legendaries and tiersets',
    contributors: [Juko8],
  },
  {
    date: new Date('2018-06-16'),
    changes: <React.Fragment>Updated for 8.0 Battle for Azeroth prepatch. All artifact traits and related analysis removed. Bad <SpellLink id={SPELLS.BLACKOUT_KICK.id} icon /> casts statistic and suggestions has been replaced with statistic and suggestions on <SpellLink id={SPELLS.BLACKOUT_KICK.id} icon />'s new cooldown reductions mechanic </React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-05-29'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.TOUCH_OF_DEATH.id} /> module showing damage from the 10% duplication and its benefit from % damage taken buffs on targets</React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-05-10'),
    changes: <React.Fragment>Added highlighting Combo Breaker casts of <SpellLink id={SPELLS.BLACKOUT_KICK.id} /> in Spellcast Timeline</React.Fragment>,
    contributors: [Coryn],
  },
  {
    date: new Date('2018-03-15'),
    changes: <React.Fragment>Added module tracking bad casts of <SpellLink id={SPELLS.BLACKOUT_KICK.id} /> </React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-03-09'),
    changes: 'Added Checklist',
    contributors: [Juko8],
  },
  {
    date: new Date('2018-03-06'),
    changes: <React.Fragment>Added Statistics and Suggestions on use of <SpellLink id={SPELLS.TOUCH_OF_KARMA_CAST.id} icon /></React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-03-03'),
    changes: 'Added The Wind Blows statistic',
    contributors: [Hewhosmites],
  },
  {
    date: new Date('2018-02-16'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.SPINNING_CRANE_KICK.id} /> statistics and suggestion</React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-01-27'),
    changes: <React.Fragment>Added item breakdown for Drinking Horn Cover showing average time gained for each <SpellLink id={SPELLS.STORM_EARTH_AND_FIRE_CAST.id} /> or <SpellLink id={SPELLS.SERENITY_TALENT.id} /> cast</React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-01-24'),
    changes: <React.Fragment>Added Statistic showing actual casts vs expected casts of important spells during <SpellLink id={SPELLS.STORM_EARTH_AND_FIRE_CAST.id} /> or <SpellLink id={SPELLS.SERENITY_TALENT.id} /></React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-01-20'),
    changes: <React.Fragment>Updated Cooldown Tracker to include extended <SpellLink id={SPELLS.STORM_EARTH_AND_FIRE_CAST.id} /> duration from Drinking Horn Cover</React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2018-01-03'),
    changes: 'Updated AlwaysBeCasting with channeling and more accurate GCD and fixed Gol\'ganneths ravaging storm being shown in Cooldowns tab',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-12-05'),
    changes: <React.Fragment>Updated Cast Efficiency to better handle <SpellLink id={SPELLS.SERENITY_TALENT.id} /> cooldown reduction on <SpellLink id={SPELLS.FISTS_OF_FURY_CAST.id} /> and Strike of the Windlord /></React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2017-11-23'),
    changes: 'Added Chi breakdown tab, suggestions and chi wasted statistic',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-11-22'),
    changes: 'Added T21 4pc item breakdown',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-11-07'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.CRACKLING_JADE_LIGHTNING.id} /> damage from <SpellLink id={SPELLS.STORM_EARTH_AND_FIRE_CAST.id} /> clones in The Emperor's Capacitor item breakdown</React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2017-11-06'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.ENERGIZING_ELIXIR_TALENT.id} /> energy gained calculation and statistic</React.Fragment>,
    contributors: [Coryn],
  },
  {
    date: new Date('2017-11-05'),
    changes: <React.Fragment>Added basic display for <SpellLink id={SPELLS.INVOKE_XUEN_THE_WHITE_TIGER_TALENT.id} /> to Cooldown Throughput with plans for refinement</React.Fragment>,
    contributors: [Talby],
  },
  {
    date: new Date('2017-11-05'),
    changes: <React.Fragment>Updated Cast Efficiency - Added <SpellLink id={SPELLS.ENERGIZING_ELIXIR_TALENT.id} /> and fixed <SpellLink id={SPELLS.RUSHING_JADE_WIND_TALENT_WINDWALKER.id} /> showing when not talented</React.Fragment>,
    contributors: [Talby],
  },
  {
    date: new Date('2017-10-25'),
    changes: 'Updated Cast Efficiency - Changed reduction values from T19 2pc and added a few talents',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-23'),
    changes: <React.Fragment>Added tracking of <SpellLink id={SPELLS.FISTS_OF_FURY_CAST.id} /> ticks</React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-17'),
    changes: 'Updated Cast Efficiency - Added reductions from The Wind Blows and T19 2pc',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-17'),
    changes: 'Added Cenedril, Reflector of Hatred, The Emperor\'s Capacitor and Soul of the Grandmaster to legendary item breakdown',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-15'),
    changes: 'Added Katsuo\'s Eclipse chi reduction item breakdown</React.Fragment>',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-15'),
    changes: 'Finished AlwaysBeCasting',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-14'),
    changes: 'Updated Cast Efficiency - All primary Windwalker spells are now shown',
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-13'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.COMBO_BREAKER_BUFF.id} /> tracking with suggestions and statistic</React.Fragment>,
    contributors: [Juko8],
  },
  {
    date: new Date('2017-10-03'),
    changes: 'Added in mastery tracking and suggestions, along with updating the Maintainer and Configuration sections',
    contributors: [Anomoly],
  },
  {
    date: new Date('2017-09-24'),
    changes: <React.Fragment>Added additional Windwalker spells / cooldowns along with a simple <SpellLink id={SPELLS.HIT_COMBO_TALENT.id} /> tracker</React.Fragment>,
    contributors: [Anomoly],
  },
  {
    date: new Date('2017-07-22'),
    changes: 'Added basic Windwalker Monk support',
    contributors: [AttilioLH],
  },
];
