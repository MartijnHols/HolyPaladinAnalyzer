import React from 'react';

import { Gebuz, Abelito75 } from 'CONTRIBUTORS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { change, date } from 'common/changelog';

export default [
  change(date(2019, 4, 30), 'Added High Noon and Power of the Moon azerite pieces to the statistics tab.', [Abelito75]),
  change(date(2019, 4, 27), 'Added DawningSun azerite piece to the statistics tab.', [Abelito75]),
  change(date(2018, 8, 26), 'Updated the empowerment tracker to use the new log format for the buff.', [Gebuz]),
  change(date(2018, 6, 21), <>Removed Stellar Empowerment and added haste tracker for <SpellLink id={SPELLS.STARLORD_TALENT.id} /></>, [Gebuz]),
];
