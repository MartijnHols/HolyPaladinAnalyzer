import React from 'react';
import PropTypes from 'prop-types';
import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import LocalizationLoader from './LocalizationLoader';

export const i18n = setupI18n();

class RootLocalizationProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <LocalizationLoader>
        {({ language, catalogs }) => (
          <I18nProvider i18n={i18n} language={language} catalogs={catalogs}>
            {this.props.children}
          </I18nProvider>
        )}
      </LocalizationLoader>
    );
  }
}

export default RootLocalizationProvider;
