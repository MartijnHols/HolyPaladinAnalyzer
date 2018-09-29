import React from 'react';

import { Cloake, tsabo } from 'CONTRIBUTORS';
import SPECS from 'game/SPECS';
import Warning from 'interface/common/Alert/Warning';

import CHANGELOG from './CHANGELOG';

export default {
  // The people that have contributed to this spec recently. People don't have to sign up to be long-time maintainers to be included in this list. If someone built a large part of the spec or contributed something recently to that spec, they can be added to the contributors list. If someone goes MIA, they may be removed after major changes or during a new expansion.
  contributors: [tsabo, Cloake],
  // The WoW client patch this spec was last updated to be fully compatible with.
  patchCompatibility: '7.3',
  // Explain the status of this spec's analysis here. Try to mention how complete it is, and perhaps show links to places users can learn more.
  // If this spec's analysis does not show a complete picture please mention this in the `<Warning>` component.
  description: (
    <React.Fragment>
      <Warning>
        Assassination rogue analysis isn't complete yet. Analysis should pick up most general mistakes, however:
        <ul>
          <li>there is no in-depth analysis for the Pre-Patch </li>
          <li>target values may be tuned incorrectly for things like energy waste or downtime. </li>
        </ul>
        <br />
        If something is missing, incorrect, or inaccurate, please report it on <a href="https://github.com/WoWAnalyzer/WoWAnalyzer/issues/new">GitHub</a> or contact <kbd>@Cloake</kbd> on <a href="https://discord.gg/AxphPxU">Discord</a>.
      </Warning>
    </React.Fragment>
  ),
  // A recent example report to see interesting parts of the spec. Will be shown on the homepage.
  exampleReport: '/report/zRbrjmWkMfnQpC2c/4-Mythic+Garothi+Worldbreaker+-+Kill+(4:26)/80-Nightshades',

  // Don't change anything below this line;
  // The current spec identifier. This is the only place (in code) that specifies which spec this parser is about.
  spec: SPECS.ASSASSINATION_ROGUE,
  // The contents of your changelog.
  changelog: CHANGELOG,
  // The CombatLogParser class for your spec.
  parser: () => import('./CombatLogParser' /* webpackChunkName: "Rogue" */).then(exports => exports.default),
  // The path to the current directory (relative form project root). This is used for generating a GitHub link directly to your spec's code.
  path: __dirname,
};
