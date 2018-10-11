import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Trans } from '@lingui/macro';

import lazyLoadComponent from 'common/lazyLoadComponent';
import { hasPremium } from 'interface/selectors/user';
import Ad from 'interface/common/Ad';
import makeNewsUrl from 'interface/news/makeUrl';
import { title as AboutArticleTitle } from 'articles/2017-01-31-About/index';
import { title as UnlistedLogsTitle } from 'articles/2017-01-31-UnlistedLogs/index';

import ReportSelecter from './others/ReportSelecter';
import LanguageSwitcher from './LanguageSwitcher';

import './Header.css';

const CharacterSearch = lazyLoadComponent(() => import(/* webpackChunkName: 'CharacterSearch', webpackPrefetch: true */ 'interface/character/Search').then(exports => exports.default));

class Header extends React.PureComponent {
  static propTypes = {
    showReportSelecter: PropTypes.bool.isRequired,
    premium: PropTypes.bool,
  };
  static defaultProps = {
    premium: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      reportActive: true,
    };
  }

  render() {
    const { showReportSelecter, premium } = this.props;

    return (
      <header>
        <div className="container image-overlay">
          <div className="row">
            <div className="col-lg-6 col-md-10">
              <h1><Trans>WoW&shy;Analyzer</Trans></h1>
              <div className="description">
                <Trans>Analyze your raid logs to get personal suggestions and metrics to improve your performance. Just enter a Warcraft Logs report:</Trans>
              </div>
              {showReportSelecter && (
                <div>
                  <div className="parse-tabs">
                    <span
                      onClick={() => this.setState({ reportActive: true })}
                      className={this.state.reportActive ? 'selected' : ''}
                    >
                      <Trans>Report</Trans>
                    </span>
                    <span
                      onClick={() => this.setState({ reportActive: false })}
                      className={this.state.reportActive ? '' : 'selected'}
                    >
                      <Trans>Character</Trans>
                    </span>
                  </div>
                  {this.state.reportActive ? (
                    <ReportSelecter />
                  ) : (
                    <CharacterSearch />
                  )}
                </div>
              )}
                
              <div className="about">
                <Link to={makeNewsUrl(AboutArticleTitle)}><Trans>About WoWAnalyzer</Trans></Link>
                {' '}| <Link to={makeNewsUrl(UnlistedLogsTitle)}><Trans>About unlisted logs</Trans></Link>
                {' '}| <a href="https://legion.wowanalyzer.com/"><Trans>Legion analyzer</Trans></a>
                {' '}| <a href="https://prepatch.wowanalyzer.com/"><Trans>Prepatch analyzer</Trans></a>
                {' '}| <Link to="/premium"><Trans>Premium</Trans></Link>
                {' '}| <LanguageSwitcher />
              </div>
            </div>
            {!premium && (
              <div className="col-lg-6 text-right hidden-md">
                <Ad format="mediumrectangle" />
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  premium: hasPremium(state),
});

export default connect(
  mapStateToProps
)(Header);
