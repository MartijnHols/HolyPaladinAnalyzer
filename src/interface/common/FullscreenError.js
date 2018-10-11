import React from 'react';
import PropTypes from 'prop-types';

import DiscordButton from 'interface/common/thirdpartybuttons/Discord';
import GithubButton from 'interface/common/thirdpartybuttons/GitHub';

import AppBackgroundImage from './AppBackgroundImage';

const FullscreenError = ({ error, details, background, children, errorDetails }) => {
  // I want this to permanently block rendering since we need people to refresh to load the new version. If they don't refresh they might try requests that may not work anymore.
  // Do note there's another part to this page; below at AppBackgroundImage we're overriding the background image as well.
  return (
    <div className="container" style={{ fontSize: '2em' }}>
      <h1 style={{ fontSize: '4.5em', marginBottom: 0, marginTop: '1em' }}>{error}</h1>
      <div style={{ fontSize: '1.5em' }}>
        {details}
      </div>
      {children}
      <div style={{ marginTop: 30 }}>
        <DiscordButton />
        <GithubButton style={{ marginLeft: 20 }} />
      </div>
      {errorDetails && (
        <div style={{ marginTop: 30 }}>
          {errorDetails}
        </div>
      )}
      <AppBackgroundImage image={background} />
    </div>
  );
};
FullscreenError.propTypes = {
  error: PropTypes.node.isRequired,
  details: PropTypes.node.isRequired,
  background: PropTypes.string.isRequired,
  children: PropTypes.node,
  errorDetails: PropTypes.node,
};

export default FullscreenError;
