import React from 'react';

// import { Zerotorescue } from 'CONTRIBUTORS';
import SPECS from 'game/SPECS';
import Warning from 'interface/common/Alert/Warning';

import CHANGELOG from './CHANGELOG';

export default {
  // The people that have contributed to this spec recently. People don't have to sign up to be long-time maintainers to be included in this list. If someone built a large part of the spec or contributed something recently to that spec, they can be added to the contributors list. If someone goes MIA, they may be removed after major changes or during a new expansion.
  contributors: [],
  // The WoW client patch this spec was last updated to be fully compatible with.
  patchCompatibility: '7.3',
  // Explain the status of this spec's analysis here. Try to mention how complete it is, and perhaps show links to places users can learn more.
  // If this spec's analysis does not show a complete picture please mention this in the `<Warning>` component.
  description: (
    <React.Fragment>
      <Warning>
        This spec does not have anyone maintaining it so it may not be helpful. We're actively looking for volunteers to help us support more specs. If you want to give it a try, check <a href="https://github.com/WoWAnalyzer/WoWAnalyzer">GitHub</a> for more information or join us on <a href="https://wowanalyzer.com/discord">Discord</a>.<br /><br />

        See <a href="https://www.icy-veins.com/wow/shadow-priest-pve-dps-common-worst-mistakes">the Icy Veins "Most Common and Worst Mistakes Shadow Priests Make in Battle for Azeroth (BfA) 8.0.1" page</a> for up-to-date suggestions.
      </Warning>
    </React.Fragment>
  ),
  // A recent example report to see interesting parts of the spec. Will be shown on the homepage.
  exampleReport: '/report/8HDXjhqwk6Q97mgV/21-Heroic+Vectis+-+Kill+(5:31)/22-Cinios',

  // Don't change anything below this line;
  // The current spec identifier. This is the only place (in code) that specifies which spec this parser is about.
  spec: SPECS.SHADOW_PRIEST,
  // The contents of your changelog.
  changelog: CHANGELOG,
  // The CombatLogParser class for your spec.
  parser: () => import('./CombatLogParser' /* webpackChunkName: "Priest" */).then(exports => exports.default),
  // The path to the current directory (relative form project root). This is used for generating a GitHub link directly to your spec's code.
  path: __dirname,
};
