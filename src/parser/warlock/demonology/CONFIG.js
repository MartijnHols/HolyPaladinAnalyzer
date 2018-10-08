import React from 'react';

import { Chizu, Hordehobbs } from 'CONTRIBUTORS';
import SPECS from 'game/SPECS';
import Warning from 'interface/common/Alert/Warning';

import CHANGELOG from './CHANGELOG';

export default {
  // The people that have contributed to this spec recently. People don't have to sign up to be long-time maintainers to be included in this list. If someone built a large part of the spec or contributed something recently to that spec, they can be added to the contributors list. If someone goes MIA, they may be removed after major changes or during a new expansion.
  contributors: [Chizu, Hordehobbs],
  // The WoW client patch this spec was last updated to be fully compatible with.
  patchCompatibility: '8.0',
  // If set to  false`, the spec will show up as unsupported.
  isSupported: true,
  // Explain the status of this spec's analysis here. Try to mention how complete it is, and perhaps show links to places users can learn more.
  // If this spec's analysis does not show a complete picture please mention this in the `<Warning>` component.
  description: (
    <>
      Hello fellow Netherlords! Currently this spec is still in development as I have yet to add the Demonology legendaries, keep that in mind. While I gotta admit this tool feels more like a statistic than something that really helps you (just yet!), I hope it still is useful to you. Any suggestions as to what could be useful to see are welcome and I'll try to implement them in order for this tool to be more than just a glorified WCL log. <br /> <br />

      I'm terribly sorry if you see your Downtime (time not spent doing anything) in negative numbers as that makes no sense but I currently have no clue as to why it happens. Any help with that from some savvy programmer would be appreciated. <br /> <br />

      If you have any questions about Warlocks, feel free to pay a visit to <a href="https://goo.gl/7PH6Bn" target="_blank" rel="noopener noreferrer">Council of the Black Harvest Discord</a>, if you'd like to discuss anything about this analyzer, leave a message on the GitHub issue or message either @Chizu or @🥓Hordehobbs on WoWAnalyzer Discord.<br /><br />

      <Warning>
        The Demonology Warlock analysis isn't complete yet. What we do show should be good to use, but it does not show the complete picture.<br />
        If there is something missing, incorrect, or inaccurate, please report it on <a href="https://github.com/WoWAnalyzer/WoWAnalyzer/issues/new">GitHub</a> or contact us on <a href="https://discord.gg/AxphPxU">Discord</a>.
      </Warning>
    </>
  ),
  // A recent example report to see interesting parts of the spec. Will be shown on the homepage.
  exampleReport: '/report/hMn6w8afHVDLgFBZ/11-Heroic+Vectis+-+Kill+(6:45)/14-Sharora',

  // Don't change anything below this line;
  // The current spec identifier. This is the only place (in code) that specifies which spec this parser is about.
  spec: SPECS.DEMONOLOGY_WARLOCK,
  // The contents of your changelog.
  changelog: CHANGELOG,
  // The CombatLogParser class for your spec.
  parser: () => import('./CombatLogParser' /* webpackChunkName: "Warlock" */).then(exports => exports.default),
  // The path to the current directory (relative form project root). This is used for generating a GitHub link directly to your spec's code.
  path: __dirname,
};
