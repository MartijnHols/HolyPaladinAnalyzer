import React from 'react';
import PropTypes from 'prop-types';
import ITEMS from './ITEMS';
import ItemLink from './ItemLink';
import Icon from './Icon';

const ItemIcon = ({ id, noLink, details, alt, ...others }) => {
  const icon = (
    <Icon
      icon={ITEMS[id].icon}
      alt={alt !== '' ? ITEMS[id].name : ''}
      {...others}
    />
  );

  if (noLink) {
    return icon;
  }

  return (
    <ItemLink id={id} details={details} icon={false}>
      {icon}
    </ItemLink>
  );
};
ItemIcon.propTypes = {
  id: PropTypes.number.isRequired,
  noLink: PropTypes.bool,
  details: PropTypes.object,
  alt: PropTypes.string,
};

export default ItemIcon;
