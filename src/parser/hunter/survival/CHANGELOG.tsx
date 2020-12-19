import { Putro } from 'CONTRIBUTORS';
import { change, date } from 'common/changelog';
import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import React from 'react';

export default [
  change(date(2020, 12, 16), <> Fix an issue with <SpellLink id={SPELLS.BORN_TO_BE_WILD_TALENT.id} /> where it wouldn't load or register casts. </>, Putro),
  change(date(2020, 12, 15), 'Bumped level of support to 9.0.2', Putro),
  change(date(2020,12,4), <> Implement the 100% focus generation increase to focus generators from <SpellLink id={SPELLS.NESINGWARYS_TRAPPING_APPARATUS_EFFECT.id} />. </>, Putro),
  change(date(2020, 10, 1), 'Updated all Survival modules for Shadowlands', Putro),
];
