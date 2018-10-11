import React from 'react';
import PropTypes from 'prop-types';

/**
 * I think this is ugly but it works so I am going to concede and use it. Turns React elements into a human readable sentence.
 * E.g. <Maintainer1><Maintainer2><Maintainer3> becomes <Maintainer1>, <Maintainer2> and <Maintainer3>
 */
const ReadableList = ({ children, groupType }) => {
  const numItems = children.length;
  const results = [];
  React.Children.forEach(children, (child, index) => {
    const isFirst = index === 0;
    if (!isFirst) {
      const isLast = index === numItems - 1;
      if (isLast) {
        results.push(` ${groupType} `);
      } else {
        results.push(', ');
      }
    }
    results.push(child);
  });
  return results;
};
ReadableList.propTypes = {
  children: PropTypes.node.isRequired,
  groupType: PropTypes.oneOf(['and', 'or']),
};
ReadableList.defaultProps = {
  groupType: 'and',
};

export default ReadableList;
