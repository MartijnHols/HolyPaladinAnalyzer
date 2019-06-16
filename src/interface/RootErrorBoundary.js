import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import FullscreenError from 'interface/common/FullscreenError';
import ErrorBoundary from 'interface/common/ErrorBoundary';
import ApiDownBackground from 'interface/common/images/api-down-background.gif';

class RootErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorDetails: null,
    };

    this.handleErrorEvent = this.handleErrorEvent.bind(this);
    this.handleUnhandledrejectionEvent = this.handleUnhandledrejectionEvent.bind(this);

    window.addEventListener('error', this.handleErrorEvent);
    window.addEventListener('unhandledrejection', this.handleUnhandledrejectionEvent);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleErrorEvent);
    window.removeEventListener('unhandledrejection', this.handleUnhandledrejectionEvent);
  }

  handleErrorEvent(event) {
    const { error } = event;
    // XXX Ignore errors that will be processed by componentDidCatch.
    // SEE: https://github.com/facebook/react/issues/10474
    if (error && error.stack && error.stack.includes('invokeGuardedCallbackDev')) {
      return;
    }
    this.error(event, 'error');
  }
  handleUnhandledrejectionEvent(event) {
    this.error(event.reason, 'unhandledrejection');
  }

  error(error, details = null) {
    if (error && (error.message === 'Script error.' || error.message.includes('adsbygoogle'))) {
      // Some errors are triggered by third party scripts, such as browser plug-ins. These errors should generally not affect the application, so we can safely ignore them for our error handling. If a plug-in like Google Translate messes with the DOM and that breaks the app, that triggers a different error so those third party issues are still handled.
      return;
    }

    (window.errors = window.errors || []).push(error);

    this.setState({
      error: error,
      errorDetails: details,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <FullscreenError
          error={<Trans>An error occured.</Trans>}
          details={<Trans>An unexpected error occured in the app. Please try again.</Trans>}
          background={ApiDownBackground}
          errorDetails={(
            <>
              <p>{this.state.error.message}</p>
              <pre style={{ color: 'red', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                {this.state.error.stack}
              </pre>
              {this.state.errorDetails && (
                <pre style={{ color: 'red' }}>
                  {this.state.errorDetails}
                </pre>
              )}
            </>
          )}
        >
          <div className="text-muted">
            <Trans>This is usually caused by a bug, please let us know about the issue on GitHub or Discord so we can fix it.</Trans>
          </div>
        </FullscreenError>
      );
    }
    return (
      <ErrorBoundary>
        {this.props.children}
      </ErrorBoundary>
    );
  }
}

export default RootErrorBoundary;
