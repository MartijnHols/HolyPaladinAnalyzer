import React from 'react';

import SPECS from 'common/SPECS';
import SPEC_ANALYSIS_COMPLETENESS from 'common/SPEC_ANALYSIS_COMPLETENESS';

import CombatLogParser from './CombatLogParser';
import CHANGELOG from './CHANGELOG';

import thebadbossy_avatar from './Images/thebadbossy_avatar.jpg';

export default {
  spec: SPECS.ARMS_WARRIOR,
  // TODO: Make maintainer an array
  maintainer: '@TheBadBossy',
  maintainerAvatar: thebadbossy_avatar,
  description: (
    <div>
      Hey I've been hard at work making this analyzer for you. I hope the suggestions give you useful pointers to improve your performance. Remember: focus on improving only one or two important things at a time. Improving isn't easy and will need your full focus until it becomes second nature to you.<br /><br />
      </div>
  ),
  // When changing this please make a PR with ONLY this value changed, we will do a review of your analysis to find out of it is complete enough.
  completeness: SPEC_ANALYSIS_COMPLETENESS.NEEDS_MORE_WORK,
  specDiscussionUrl: 'https://github.com/WoWAnalyzer/WoWAnalyzer/issues/579',

  // Shouldn't have to change these:
  changelog: CHANGELOG,
  parser: CombatLogParser,
  // used for generating a GitHub link directly to your spec
  path: __dirname,
};
