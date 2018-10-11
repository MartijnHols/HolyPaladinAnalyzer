import React from 'react';
import PropTypes from 'prop-types';

import ResourceIcon from 'common/ResourceIcon';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';

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
      <>
        <ResourceIcon id={RESOURCE_TYPES.MANA.id} />{' '}
        {approximate && '≈'}{parser.formatManaRestored(amount)}
      </>
    );
  }
}

export default ItemManaGained;
