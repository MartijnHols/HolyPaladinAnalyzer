// import SPECS from 'common/SPECS';
import React from 'react';
import SPEC_ANALYSIS_COMPLETENESS from 'common/SPEC_ANALYSIS_COMPLETENESS';

import CombatLogParser from './CombatLogParser';
import CHANGELOG from './CHANGELOG';

export default {
  spec: { id: 0, className: 'Unsupported', specName: 'Spec' }, // SPECS.HOLY_PALADIN,
  maintainer: '@Zerotorescue',
  description: (
    <div>
      You don't need to to do anything special to add a spec. The real issue preventing specs from being added is that in order to add a spec, you need to have the following 3 properties:<br />
      1. Know the spec well enough to actually create something useful<br />
      2. Know how to program well enough to implement the analysis<br />
      3. Have the time and motivation to actually do it<br /><br />

      If you want to give it a try you can find documentation here:{' '}
      <a href="https://github.com/WoWAnalyzer/WoWAnalyzer/blob/master/README.md">https://github.com/WoWAnalyzer/WoWAnalyzer/blob/master/README.md</a>
    </div>
  ),
  completeness: SPEC_ANALYSIS_COMPLETENESS.NOT_ACTIVELY_MAINTAINED, // When changing this please make a PR with ONLY this value changed, we will do a review of your analysis to find out of it is complete enough.
  parser: CombatLogParser,
  changelog: CHANGELOG,
  path: __dirname, // used for generating a GitHub link directly to your spec
};
