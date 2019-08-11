import React from 'react';

import { Anomoly, Gao, Zerotorescue, Abelito75, niseko } from 'CONTRIBUTORS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import { change, date } from 'common/changelog';

export default [
  change(date(2019, 8, 6), <>Valid for 8.2</>, Abelito75),
  change(date(2019, 8, 2), <>Fixed trait calculations being unaffected by healing increases or decreases.</>, niseko),
  change(date(2019, 7, 23), <>Fixed strange bug with mana tea where if you didn't have it selected it crashed the Overview tab</>, Abelito75),
  change(date(2019, 7, 18), <>Made <SpellLink id={SPELLS.WAY_OF_THE_CRANE.id} /> infographic.</>, Abelito75),
  change(date(2019, 7, 2), <><SpellLink id={SPELLS.MANA_TEA_TALENT.id} /> rewrite. Includes all spells</>, Abelito75),
  change(date(2019, 7, 2), <>Added <SpellLink id={SPELLS.WAY_OF_THE_CRANE.id} /> to the cooldowns tab.</>, [Anomoly]),
  change(date(2019, 6, 1), <>Added a check to make sure you using <SpellLink id={SPELLS.SOOTHING_MIST.id} /> efficiency while channeling it.</>, [Abelito75]),
  change(date(2019, 3, 30), <>Added a check to make sure you cast <SpellLink id={SPELLS.SPINNING_CRANE_KICK.id} /> when there are enough targets around.</>, [Abelito75]),
  change(date(2019, 3, 23), <>Updated <SpellLink id={SPELLS.MANA_TEA_TALENT.id} /> to check if you have innervate before counting mana.</>, [Abelito75]),
  change(date(2019, 3, 21), <>Updated mastery tracking to more accurately reflect the spell that triggered the <SpellLink id={SPELLS.GUSTS_OF_MISTS.id} />. This includes updates to the statistic and healing efficiency sections.</>, [Abelito75]),
  change(date(2019, 3, 15), <>Updated Mistweaver Spreadsheet tab to include  <SpellLink id={SPELLS.REFRESHING_JADE_WIND_TALENT.id} /> efficiency.</>, [Abelito75]),
  change(date(2019, 3, 15), <>Added SI to buffs to buffs module to track  <SpellLink id={SPELLS.SECRET_INFUSION.id} />.</>, [Abelito75]),
  change(date(2019, 3, 11), 'Added new Buffs module to track and highlight Mistweaver specific buffs on the timeline', [Anomoly]),
  change(date(2019, 3, 11), 'Updated look and feel of Mistweaver Azerite traits to conform to new 3.0 style.', [Anomoly]),
  change(date(2019, 3, 10), <>Added overhealing check for <SpellLink id={SPELLS.MANA_TEA_TALENT.id} />.</>, [Abelito75]),
  change(date(2019, 2, 25), <>Added statistics, suggestion, and checklist item for  <SpellLink id={SPELLS.SUMMON_JADE_SERPENT_STATUE_TALENT.id} /> casting uptime.</>, [Anomoly]),
  change(date(2019, 2, 21), <>Added statistics for tracking the average stat gain from <SpellLink id={SPELLS.SECRET_INFUSION.id} />.</>, [Anomoly]),
  change(date(2019, 2, 7), <>Added statistics for tracking the number of <SpellLink id={SPELLS.RENEWING_MIST.id} /> during <SpellLink id={SPELLS.VIVIFY.id} /> casts. Also, did a quick bug fix for the Monk Spreadsheet import.</>, [Anomoly]),
  change(date(2019, 2, 7), <>Added statistics, suggestions, and checklist item for tracking the number of <SpellLink id={SPELLS.RENEWING_MIST.id} /> during <SpellLink id={SPELLS.MANA_TEA_TALENT.id} />. Also, adding some additional tooltips to the Healing Efficiency page.</>, [Anomoly]),
  change(date(2019, 1, 21), <>Ignore cooldown errors caused by <SpellLink id={SPELLS.FONT_OF_LIFE.id} /> (it is not detectable in logs so we can't make it 100% accurate).</>, [Zerotorescue]),
  change(date(2019, 1, 21), <>Fixed a bug where <SpellLink id={SPELLS.SOOTHING_MIST.id} /> incorrectly triggered two GCDs, making downtime off.</>, [Zerotorescue]),
  change(date(2018, 11, 14), <>Added <SpellLink id={SPELLS.GUSTS_OF_MISTS.id}>Gusts of Mists</SpellLink> breakdown chart. Fixed bug with the ReM and Vivify mana efficiency.</>, [Gao]),
  change(date(2018, 11, 2), <>Added the mana efficiency tab. Updated the Env:Viv cast ratio picture sizes.</>, [Gao]),
  change(date(2018, 10, 30), <>Fixed an bug with <SpellLink id={SPELLS.MANA_TEA_TALENT.id} /> suggestion not displaying the correct mana saved amount.</>, [Anomoly]),
  change(date(2018, 9, 11), <>Added <SpellLink id={SPELLS.SUMMON_JADE_SERPENT_STATUE_TALENT.id} /> to spreadsheet tab for use importing into Monk spreadsheet.</>, [Anomoly]),
  change(date(2018, 9, 11), <>Fixed <SpellLink id={SPELLS.SOOTHING_MIST.id} /> channeling time to be taken into account with Downtime statistic and suggestion.</>, [Anomoly]),
  change(date(2018, 9, 11), 'Added healing contribution statistic box for the Mistweaver Specific Azerite traits.', [Anomoly]),
  change(date(2018, 9, 8), 'Updated Checklist to leverage new format and included updates to the suggestions and thresholds. Cleaned up unused legendary files also.', [Anomoly]),
  change(date(2018, 9, 7), 'Updated Player Log Data tab to include fixes and additional data needed to support the BfA Mistweaver Monk spreadsheet.', [Anomoly]),
  change(date(2018, 9, 5), <>Fixed mana cost of all spells. Updated suggestion for <SpellLink id={SPELLS.LIFECYCLES_TALENT.id} /> usage and removed <SpellLink id={SPELLS.SOOTHING_MIST.id} /> suggestion from the analyzer.</>, [Anomoly]),
  change(date(2018, 7, 22), <>Fix crash when Drape of Shame is used.</>, [Anomoly]),
  change(date(2018, 7, 20), 'Pre-Patch Updates: Removed Effuse from the analyzer as the ability was removed in BfA. Updated Mana Costs of spells to use fixed cost versus a percentage of max mana.', [Anomoly]),
  change(date(2018, 7, 19), 'Pre-Patch Updates: Removed Uplifting Trance, Updated Renewing Mist Cooldown, Removed Essence Font from Thunder Focus Tea statistics, Removed Thunder Focus Tea suggestion for now as correct use is being defined', [Anomoly]),
  change(date(2018, 7, 1), 'Trait and Artifact clean up along with GCD changes in Abilities for Battle for Azeroth', [Anomoly]),
  change(date(2018, 6, 15), 'Updated Vivify to incorporate new healing interaction with Renewing Mist. Updated Renewing Mist change to now be a 2 charge spell.', [Anomoly]),
];
