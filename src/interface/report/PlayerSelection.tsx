import ROLES from 'game/ROLES';
import SPECS from 'game/SPECS';
import React from 'react';

import './PlayerSelection.scss';
import Player from '../../parser/core/Player';
import PlayerTile from './PlayerTile';

const ROLE_SORT_KEY: { [key: string]: number } = {
  [ROLES.TANK]: 0,
  [ROLES.HEALER]: 1,
  //Different sort for range/melee was tested and felt intuitive.
  //Because of this all DPS are treated the same for sorting purposes.
  [ROLES.DPS.MELEE]: 2,
  [ROLES.DPS.RANGED]: 2,
};

function sortPlayers(a: Player, b: Player) {
  const aSpec = SPECS[a.combatant.specID];
  const bSpec = SPECS[b.combatant.specID];
  const aRoleSortKey = aSpec ? ROLE_SORT_KEY[aSpec.role] : -1;
  const bRoleSortKey = bSpec ? ROLE_SORT_KEY[bSpec.role] : -1;

  if (aRoleSortKey !== bRoleSortKey) {
    return aRoleSortKey - bRoleSortKey;
  }

  const aSpecSortKey = aSpec ? aSpec.className : '';
  const bSpecSortKey = bSpec ? bSpec.className : '';
  if (aSpecSortKey !== bSpecSortKey) {
    return aSpecSortKey.localeCompare(bSpecSortKey);
  }

  return a.name.localeCompare(b.name);
}

interface Props {
  players: Player[];
  makeUrl: (playerId: number) => string;
}

const PlayerSelection = ({ players, makeUrl }: Props) => (
  <div className="player-selection">
    {players.sort(sortPlayers).map((player) => (
      <PlayerTile key={player.guid} player={player} makeUrl={makeUrl} />
    ))}
  </div>
);

export default PlayerSelection;
