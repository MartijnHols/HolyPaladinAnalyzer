import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@lingui/macro';

import SkullIcon from 'interface/icons/Skull';
import CancelIcon from 'interface/icons/Cancel';
import { i18n } from 'interface/RootLocalizationProvider';
import DIFFICULTIES from 'game/DIFFICULTIES';
import { findByBossId } from 'raids';

import ProgressBar from './ProgressBar';

const formatDuration = (duration) => {
  const seconds = Math.floor(duration % 60);
  return `${Math.floor(duration / 60)}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const FightSelectionPanelListItem = ({ difficulty, name, kill, start_time, end_time, wipes, fightPercentage, boss: bossId, ...others }) => {
  const duration = Math.round((end_time - start_time) / 1000);

  delete others.bossPercentage;
  delete others.partial;
  delete others.fightPercentage;
  delete others.lastPhaseForPercentageDisplay;

  const Icon = kill ? SkullIcon : CancelIcon;
  const boss = findByBossId(bossId);

  return (
    <div className="flex wrapable" {...others}>
      <div className="flex-sub" style={{ minWidth: 350 }}>
        {boss && boss.headshot && <img src={boss.headshot} style={{ height: '1.8em', borderRadius: 5, marginRight: 10, marginTop: '-0.2em', marginBottom: '-0.2em' }} alt="Boss headshot" />}
        {DIFFICULTIES[difficulty]} {name} {!kill && `(${i18n._(t`Wipe ${wipes}`)})`}
      </div>
      <div className={`flex-main ${kill ? 'kill' : 'wipe'}`} style={{ whiteSpace: 'nowrap' }}>
        <Icon />
        {' '}{formatDuration(duration)}
        <ProgressBar percentage={kill ? 100 : (10000 - fightPercentage) / 100} height={8} />
      </div>
    </div>
  );
};
FightSelectionPanelListItem.propTypes = {
  id: PropTypes.number.isRequired,
  difficulty: PropTypes.number.isRequired,
  boss: PropTypes.number.isRequired,
  start_time: PropTypes.number.isRequired,
  end_time: PropTypes.number.isRequired,
  wipes: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  kill: PropTypes.bool.isRequired,
  fightPercentage: PropTypes.number,
};

export default FightSelectionPanelListItem;
