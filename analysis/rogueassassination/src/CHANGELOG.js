import { change, date } from 'common/changelog';
import SPELLS from 'common/SPELLS';
import { Tyndi, Zeboot, Putro, Hordehobbs } from 'CONTRIBUTORS';
import { SpellLink } from 'interface';
import React from 'react';


export default [
  change(date(2021,3,4), <>Removed analyzer and suggestion for <SpellLink id={SPELLS.INSTANT_POISON.id} /> application.</>, Hordehobbs),
  change(date(2021,2,27), <>Add analyzer and suggestion for <SpellLink id={SPELLS.INSTANT_POISON.id} /> application.</>, Hordehobbs),
  change(date(2020, 12, 28), <> Fixed an issue where <SpellLink id={SPELLS.DUSKWALKERS_PATCH.id} /> module wouldn't load, as well as various crashes. </>, Putro),
  change(date(2020, 12, 18), <> Fixed an issue where the analyzer couldn't reduce the cooldown of <SpellLink id={SPELLS.SERRATED_BONE_SPIKE.id} />. </>, Putro),
  change(date(2020, 12, 15), 'Added warning for spec not being supported', Tyndi),
  change(date(2020, 11, 2), 'Update modules to TS', Tyndi),
  change(date(2020, 10, 25), 'Update Invigorating Shadowdust module', Tyndi),
  change(date(2020, 10, 20), <>Added <SpellLink id={SPELLS.INVIGORATING_SHADOWDUST.id} /> Legendary</>, Tyndi),
  change(date(2020, 10, 19), <>Added <SpellLink id={SPELLS.ESSENCE_OF_BLOODFANG.id} /> Legendary</>, Tyndi),
  change(date(2020, 10, 18), 'Converted legacy listeners to new event filters', Zeboot),
  change(date(2020, 10, 16), <>Added <SpellLink id={SPELLS.DUSKWALKERS_PATCH.id} /> Legendary</>, Tyndi),
  change(date(2020, 10, 2), <>Added <SpellLink id={SPELLS.DASHING_SCOUNDREL.id} /> Legendary</>, Tyndi),
  change(date(2020, 9, 29), 'Updated for Shadowlands', Tyndi),
];
