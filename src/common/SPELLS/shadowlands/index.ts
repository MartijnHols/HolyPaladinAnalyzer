import safeMerge from 'common/safeMerge';

import Conduits from './conduits';
import Soulbinds from './soulbinds';
import Covenants from './covenants';
import Legendaries from './legendaries';
import Enchants from './enchants';
import Potions from './potions';
import Others from './others';

export default safeMerge(Conduits, Soulbinds, Covenants, Legendaries, Enchants, Potions, Others);
