import { change, date } from 'common/changelog';
import SPELLS from 'common/SPELLS';
import { Putro, Tyndi, Zeboot, Canotsa, Hordehobbs, Akai } from 'CONTRIBUTORS';
import { SpellLink } from 'interface';
import React from 'react';


export default [
  change(date(2021, 3, 4), <>Fixed error where <SpellLink id={SPELLS.DREADBLADES_TALENT.id} /> was being suggested even when not talented</>, Akai),
  change(date(2021, 2, 27), <>Add analyzer and suggestion for <SpellLink id={SPELLS.INSTANT_POISON.id} /> application.</>, Hordehobbs),
  change(date(2021, 1, 17), <>Suggestion added to cast <SpellLink id={SPELLS.BETWEEN_THE_EYES.id} /> more often</>, Canotsa),
  change(date(2020, 12, 21), 'Minor update to suggestions', Tyndi),
  change(date(2020, 12, 18), <> Fixed an issue where the analyzer couldn't reduce the cooldown of <SpellLink id={SPELLS.SERRATED_BONE_SPIKE.id} />. </>, Putro),
  change(date(2020, 12, 15), 'Added warning for spec not being supported', Tyndi),
  change(date(2020, 11, 30), 'Fixed error with Slice and Dice', Tyndi),
  change(date(2020, 10, 20), <>Added <SpellLink id={SPELLS.INVIGORATING_SHADOWDUST.id} /> Legendary</>, Tyndi),
  change(date(2020, 10, 19), <>Added <SpellLink id={SPELLS.ESSENCE_OF_BLOODFANG.id} /> Legendary</>, Tyndi),
  change(date(2020, 10, 18), 'Converted legacy listeners to new event filters', Zeboot),
  change(date(2020, 10, 16), <>Added <SpellLink id={SPELLS.GREENSKINS_WICKERS.id} /> Legendary</>, Tyndi),
  change(date(2020, 10, 5), 'Updated Blade Flurry and Blade Rush to calculate CD reduction properly', Tyndi),
  change(date(2020, 10, 1), 'Move Slice and Dice from talent to spell, update Rogue spec configs, update spells', Tyndi),
];
