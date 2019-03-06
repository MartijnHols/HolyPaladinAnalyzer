import React from 'react';
import PropTypes from 'prop-types';

import ResourceIcon from 'common/ResourceIcon';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import { TooltipElement } from 'common/Tooltip';
import { formatThousands } from 'common/format';

class ItemManaGained extends React.PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    approximate: PropTypes.bool,
  };
  static contextTypes = {
    parser: PropTypes.object.isRequired,
  };

  render() {
    const { amount, approximate } = this.props;
    const { parser } = this.context;

    return (
      <TooltipElement content={`${formatThousands(amount)} mana`}>
        <ResourceIcon id={RESOURCE_TYPES.MANA.id} />{' '}
        {approximate && '≈'}{formatThousands(amount / parser.fightDuration * 1000 * 5)} MP5
      </TooltipElement>
    );
  }
}

export default ItemManaGained;
