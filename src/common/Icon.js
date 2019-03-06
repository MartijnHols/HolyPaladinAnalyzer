import React from 'react';
import PropTypes from 'prop-types';

import BAD_ICONS from 'common/BAD_ICONS';

const Icon = ({ icon, className, ...others }) => {
  if (!icon) {
    return null;
  }
  icon = icon.replace('.jpg', '').replace(/-/g, '');
  if (icon === 'petbattle_healthdown') {
    // Blizzard seems to have forgotten to remove the dash for this one... or something
    icon = 'petbattle_health-down';
  }
  if (icon === 'class_demonhunter') {
    // Blizzard seems to have forgotten to remove the dash for this one too
    icon = 'class_demon-hunter';
  }

  let baseURL = `//render-us.worldofwarcraft.com/icons/56`;
  if (BAD_ICONS.includes(icon)) {
    baseURL = `/img/Icons`;
  }

  return (
    <img
      src={`${baseURL}/${icon}.jpg`}
      alt="" // Implementers should annotate these as desired, but it's usually just decorating the name of a spell/item so doesn't add anything and in fact makes copy-pasting uglier
      className={`icon game ${className}`}
      {...others}
    />
  );
};
Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
};
Icon.defaultProps = {
  className: '',
};

export default Icon;
