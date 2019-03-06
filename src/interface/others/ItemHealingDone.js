import React from 'react';
import PropTypes from 'prop-types';
import { formatPercentage, formatNumber } from 'common/format';

class ItemHealingDone extends React.PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    approximate: PropTypes.bool,
    greaterThan: PropTypes.bool,
  };
  static contextTypes = {
    parser: PropTypes.object.isRequired,
  };

  render() {
    const { amount, approximate, greaterThan } = this.props;
    const { parser } = this.context;

    return (
      <>
        <img
          src="/img/healing.png"
          alt="Healing"
          className="icon"
        />{' '}
        {approximate && '≈'}
        {greaterThan && '>'}{formatNumber(amount / parser.fightDuration * 1000)} HPS <small>{formatPercentage(parser.getPercentageOfTotalHealingDone(amount))}% of total</small>
      </>
    );
  }
}

export default ItemHealingDone;
