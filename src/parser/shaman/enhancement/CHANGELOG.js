import React from 'react';

import { HawkCorrigan, niseko, mtblanton } from 'CONTRIBUTORS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { change, date } from 'common/changelog';

export default [
  change(date(2018, 11, 18), 'Small updates to various Enhancement spells', [mtblanton]),
  change(date(2018, 11, 4), <>Added support for <SpellLink id={SPELLS.PACK_SPIRIT_TRAIT.id} /> and <SpellLink id={SPELLS.SERENE_SPIRIT_TRAIT.id} /> azerite traits.</>, [niseko]),
  change(date(2018, 11, 1), <>Added support for <SpellLink id={SPELLS.ASTRAL_SHIFT.id} /> damage reduction.</>, [niseko]),
  change(date(2018, 10, 24), 'Added "Use your offensive cooldowns..." to the Enhancement checklist', [mtblanton]),
  change(date(2018, 10, 19), 'Added "Always be casting" to the Enhancement checklist', [mtblanton]),
  change(date(2018, 9, 16), 'Updated Enhancement Shaman for BfA.', [HawkCorrigan]),
];
