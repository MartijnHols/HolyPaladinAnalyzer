import React from 'react';

import { niseko, HawkCorrigan } from 'CONTRIBUTORS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { change, date } from 'common/changelog';

export default [
  change(date(2019, 5, 6), <>Added support for the damage part of <SpellLink id={SPELLS.IGNEOUS_POTENTIAL.id} />.</>, [niseko]),
  change(date(2019, 3, 20), <>Fixing <SpellLink id={SPELLS.MASTER_OF_THE_ELEMENTS_TALENT.id} />-Tracker and Damage Calculation.</>, [HawkCorrigan]),
  change(date(2018, 11, 13), <>Added a basic Checklist, with the cross-spec functionalities.</>, [HawkCorrigan]),
  change(date(2018, 11, 4), <>Added support for <SpellLink id={SPELLS.PACK_SPIRIT_TRAIT.id} /> and <SpellLink id={SPELLS.SERENE_SPIRIT_TRAIT.id} /> azerite traits.</>, [niseko]),
  change(date(2018, 11, 1), <>Added support for <SpellLink id={SPELLS.ASTRAL_SHIFT.id} /> damage reduction.</>, [niseko]),
  change(date(2018, 10, 17), <>Flagged the Elemental Shaman Analyzer as supported.</>, [HawkCorrigan]),
  change(date(2018, 10, 15), <>Added Checks for the correct usage of <SpellLink id={SPELLS.STORM_ELEMENTAL_TALENT.id} /> and <SpellLink id={SPELLS.FIRE_ELEMENTAL.id} /> when talented into <SpellLink id={SPELLS.PRIMAL_ELEMENTALIST_TALENT.id} />.</>, [HawkCorrigan]),
];
