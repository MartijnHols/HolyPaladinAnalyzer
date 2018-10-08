import React from 'react';

import { Chizu } from 'CONTRIBUTORS';
import SPECS from 'game/SPECS';
import Warning from 'interface/common/Alert/Warning';
import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';

import CHANGELOG from './CHANGELOG';

export default {
  // The people that have contributed to this spec recently. People don't have to sign up to be long-time maintainers to be included in this list. If someone built a large part of the spec or contributed something recently to that spec, they can be added to the contributors list. If someone goes MIA, they may be removed after major changes or during a new expansion.
  contributors: [Chizu],
  // The WoW client patch this spec was last updated to be fully compatible with.
  patchCompatibility: '8.0',
  // If set to  false`, the spec will show up as unsupported.
  isSupported: true,
  // Explain the status of this spec's analysis here. Try to mention how complete it is, and perhaps show links to places users can learn more.
  // If this spec's analysis does not show a complete picture please mention this in the `<Warning>` component.
  description: (
    <>
      Hello fellow Netherlords! While I gotta admit this tool feels more like a statistic than something that really helps you (just yet!), I hope it still is useful to you. Any suggestions as to what could be useful to see are welcome and I'll try to implement them in order for this tool to be more than just a glorified WCL log. <br /> <br />

      As for a general rule of thumb - keep your <SpellLink id={SPELLS.IMMOLATE_DEBUFF.id} /> up as much as you can, cast <SpellLink id={SPELLS.CONFLAGRATE.id} /> on CD. Dump shards into fat <SpellLink id={SPELLS.CHAOS_BOLT.id} /> and just overall don't forget to cast spells when you have them (<SpellLink id={SPELLS.CHANNEL_DEMONFIRE_TALENT.id} />, <SpellLink id={SPELLS.HAVOC.id} /> when there's something to cleave etc.). <br /> <br />

      If you have any questions about Warlocks, feel free to pay a visit to <a href="https://goo.gl/7PH6Bn" target="_blank" rel="noopener noreferrer">Council of the Black Harvest Discord</a>, if you'd like to discuss anything about this analyzer, leave a message on the GitHub issue or message me @Chizu on WoWAnalyzer Discord.<br /><br />

      <Warning>
        The Destruction Warlock analysis isn't complete yet. What we do show should be good to use, but it does not show the complete picture.<br />
        If there is something missing, incorrect, or inaccurate, please report it on <a href="https://github.com/WoWAnalyzer/WoWAnalyzer/issues/new">GitHub</a> or contact us on <a href="https://discord.gg/AxphPxU">Discord</a>.
      </Warning>
    </>
  ),
  // A recent example report to see interesting parts of the spec. Will be shown on the homepage.
  exampleReport: '/report/LYXJDPpyN68QaWrm/24-Heroic+Vectis+-+Kill+(7:13)/9-Jeanvoeruler',

  // Don't change anything below this line;
  // The current spec identifier. This is the only place (in code) that specifies which spec this parser is about.
  spec: SPECS.DESTRUCTION_WARLOCK,
  // The contents of your changelog.
  changelog: CHANGELOG,
  // The CombatLogParser class for your spec.
  parser: () => import('./CombatLogParser' /* webpackChunkName: "Warlock" */).then(exports => exports.default),
  // The path to the current directory (relative form project root). This is used for generating a GitHub link directly to your spec's code.
  path: __dirname,
};
