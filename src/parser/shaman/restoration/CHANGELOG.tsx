import React from 'react';

import { niseko, Abelito75 } from 'CONTRIBUTORS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { change, date } from 'common/changelog';

export default [
  change(date(2020, 10, 1), <>Added the potency conduits <SpellLink id={SPELLS.EMBRACE_OF_EARTH.id} />, <SpellLink id={SPELLS.HEAVY_RAINFALL.id} /> and <SpellLink id={SPELLS.SWIRLING_CURRENTS.id} />.</>, Abelito75),
  change(date(2020, 10, 1), (
    <>
      Updated Restoration Shaman for Shadowlands.<br />
      Changes include:<br />
      <ul>
        <li>Coming soon.</li>
      </ul>
    </>
  ), [niseko]),
];
