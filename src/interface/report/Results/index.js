import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trans, t } from '@lingui/macro';

import { findByBossId } from 'raids';
import lazyLoadComponent from 'common/lazyLoadComponent';
import retryingPromise from 'common/retryingPromise';
import makeWclUrl from 'common/makeWclUrl';
import Tooltip from 'common/Tooltip';
import getFightName from 'common/getFightName';
import REPORT_HISTORY_TYPES from 'interface/home/ReportHistory/REPORT_HISTORY_TYPES';
import { appendReportHistory } from 'interface/actions/reportHistory';
import { getResultTab } from 'interface/selectors/url/report';
import { hasPremium } from 'interface/selectors/user';
import Warning from 'interface/common/Alert/Warning';
import Ad from 'interface/common/Ad';
import ReadableList from 'interface/common/ReadableList';
import Contributor from 'interface/contributor/Button';
import WipefestLogo from 'interface/images/Wipefest-logo.png';
import { i18n } from 'interface/RootLocalizationProvider';
import LoadingBar from 'interface/layout/NavigationBar/LoadingBar';
import Panel from 'interface/others/Panel';
import ChangelogTab from 'interface/others/ChangelogTab';
import ErrorBoundary from 'interface/common/ErrorBoundary';
import Checklist from 'parser/shared/modules/features/Checklist/Module';
import StatTracker from 'parser/shared/modules/StatTracker';

import './Results.scss';
import Header from './Header';
import About from './About';
import Overview from './Overview';
import Statistics from './Statistics';
import Character from './Character';
import EncounterStats from './EncounterStats';
import EVENT_PARSING_STATE from '../EVENT_PARSING_STATE';
import BOSS_PHASES_STATE from '../BOSS_PHASES_STATE';
import ScrollToTop from './ScrollToTop';

const TimelineTab = lazyLoadComponent(() => retryingPromise(() => import(/* webpackChunkName: 'TimelineTab' */ './Timeline/Container').then(exports => exports.default)), 0);
const EventsTab = lazyLoadComponent(() => retryingPromise(() => import(/* webpackChunkName: 'EventsTab' */ 'interface/others/EventsTab').then(exports => exports.default)));

const CORE_TABS = {
  OVERVIEW: 'overview',
  STATISTICS: 'statistics',
  TIMELINE: 'timeline',
  CHARACTER: 'character',
  EVENTS: 'events',
  ABOUT: 'about',
};

class Results extends React.PureComponent {
  static propTypes = {
    parser: PropTypes.shape({
    }),
    characterProfile: PropTypes.object,
    selectedTab: PropTypes.string,
    makeTabUrl: PropTypes.func.isRequired,
    report: PropTypes.shape({
      code: PropTypes.string.isRequired,
    }).isRequired,
    fight: PropTypes.shape({
      start_time: PropTypes.number.isRequired,
      end_time: PropTypes.number.isRequired,
      boss: PropTypes.number.isRequired,
    }).isRequired,
    player: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    isLoadingParser: PropTypes.bool,
    isLoadingEvents: PropTypes.bool,
    bossPhaseEventsLoadingState: PropTypes.oneOf(Object.values(BOSS_PHASES_STATE)),
    isLoadingCharacterProfile: PropTypes.bool,
    parsingState: PropTypes.oneOf(Object.values(EVENT_PARSING_STATE)),
    progress: PropTypes.number,
    premium: PropTypes.bool,
    appendReportHistory: PropTypes.func.isRequired,
  };
  static childContextTypes = {
    updateResults: PropTypes.func.isRequired,
    parser: PropTypes.object,
  };
  getChildContext() {
    return {
      updateResults: this.forceUpdate.bind(this),
      parser: this.props.parser,
    };
  }
  static contextTypes = {
    config: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      adjustForDowntime: false,
    };
  }

  componentDidMount() {
    this.scrollToTop();
    this.appendHistory(this.props.report, this.props.fight, this.props.player);
  }
  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.selectedTab !== prevProps.selectedTab) {
      // TODO: To improve user experience we could try to avoid scrolling when the header is still within vision.
      this.scrollToTop();
    }
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  appendHistory(report, fight, player) {
    // TODO: Add spec and show it in the list
    this.props.appendReportHistory({
      code: report.code,
      title: report.title,
      start: Math.floor(report.start / 1000),
      end: Math.floor(report.end / 1000),
      fightId: fight.id,
      fightName: getFightName(report, fight),
      playerId: player.id,
      playerName: player.name,
      playerClass: player.type,
      type: REPORT_HISTORY_TYPES.REPORT,
    });
  }

  get warning() {
    const parser = this.props.parser;
    const boss = parser.boss;
    if (boss && boss.fight.resultsWarning) {
      return boss.fight.resultsWarning;
    }
    return null;
  }
  get isLoading() {
    return this.props.isLoadingParser
      || this.props.isLoadingEvents
      || this.props.bossPhaseEventsLoadingState === BOSS_PHASES_STATE.LOADING
      || this.props.isLoadingCharacterProfile
      || this.props.parsingState !== EVENT_PARSING_STATE.DONE;
  }

  renderContent(selectedTab, results) {
    const { parser, premium } = this.props;

    switch (selectedTab) {
      case CORE_TABS.OVERVIEW: {
        if (this.isLoading) {
          return this.renderLoadingIndicator();
        }
        const checklist = parser.getModule(Checklist, true);
        return (
          <Overview
            checklist={checklist && checklist.render()}
            issues={results.issues}
          />
        );
      }
      case CORE_TABS.STATISTICS:
        if (this.isLoading) {
          return this.renderLoadingIndicator();
        }
        return (
          <Statistics parser={parser}>{results.statistics}</Statistics>
        );
      case CORE_TABS.TIMELINE:
        if (this.isLoading) {
          return this.renderLoadingIndicator();
        }
        return (
          <TimelineTab parser={parser} />
        );
      case CORE_TABS.EVENTS:
        if (this.isLoading) {
          return this.renderLoadingIndicator();
        }
        return (
          <div className="container">
            <EventsTab parser={parser} />
          </div>
        );
      case CORE_TABS.CHARACTER: {
        if (this.isLoading) {
          return this.renderLoadingIndicator();
        }
        const statTracker = parser.getModule(StatTracker);

        return (
          <div className="container">
            <Character
              statTracker={statTracker}
              combatant={parser.selectedCombatant}
            />

            {premium === false && (
              <div style={{ margin: '40px 0' }}>
                <Ad />
              </div>
            )}

            <EncounterStats
              currentBoss={parser.fight.boss}
              difficulty={parser.fight.difficulty}
              spec={parser.selectedCombatant._combatantInfo.specID}
              duration={parser.fight.end_time - parser.fight.start_time}
            />
          </div>
        );
      }
      case CORE_TABS.ABOUT: {
        const config = this.context.config;
        return (
          <div className="container">
            <About config={config} />

            {premium === false && (
              <div style={{ margin: '40px 0' }}>
                <Ad />
              </div>
            )}

            <ChangelogTab />
          </div>
        );
      }
      default: {
        if (this.isLoading) {
          return this.renderLoadingIndicator();
        }

        const tab = results.tabs.find(tab => tab.url === selectedTab);

        return (
          <div className="container">
            <ErrorBoundary>
              {tab ? tab.render() : '404 tab not found'}
            </ErrorBoundary>
          </div>
        );
      }
    }
  }
  renderLoadingIndicator() {
    const { progress, isLoadingParser, isLoadingEvents, bossPhaseEventsLoadingState, isLoadingCharacterProfile, parsingState } = this.props;

    return (
      <div className="container" style={{ marginBottom: 40 }}>
        <Panel
          title="Loading..."
          className="loading-indicators"
        >
          <LoadingBar progress={progress} style={{ marginBottom: 30 }} />

          <div className="row">
            <div className="col-md-8">
              Spec analyzer from WoWAnalyzer
            </div>
            <div className={`col-md-4 ${isLoadingParser ? 'loading' : 'ok'}`}>
              {isLoadingParser ? 'Loading...' : 'OK'}
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              Player events from Warcraft Logs
            </div>
            <div className={`col-md-4 ${isLoadingEvents ? 'loading' : 'ok'}`}>
              {isLoadingEvents ? 'Loading...' : 'OK'}
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              Boss events from Warcraft Logs
            </div>
            <div className={`col-md-4 ${bossPhaseEventsLoadingState === BOSS_PHASES_STATE.LOADING ? 'loading' : (bossPhaseEventsLoadingState === BOSS_PHASES_STATE.SKIPPED ? 'skipped' : 'ok')}`}>
              {bossPhaseEventsLoadingState === BOSS_PHASES_STATE.SKIPPED && 'Skipped'}
              {bossPhaseEventsLoadingState === BOSS_PHASES_STATE.LOADING && 'Loading...'}
              {bossPhaseEventsLoadingState === BOSS_PHASES_STATE.DONE && 'OK'}
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              Character info from Blizzard
            </div>
            <div className={`col-md-4 ${isLoadingCharacterProfile ? 'loading' : 'ok'}`}>
              {isLoadingCharacterProfile ? 'Loading...' : 'OK'}
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              Analyzing events
            </div>
            <div className={`col-md-4 ${parsingState === EVENT_PARSING_STATE.WAITING ? 'waiting' : (parsingState === EVENT_PARSING_STATE.PARSING ? 'loading' : 'ok')}`}>
              {parsingState === EVENT_PARSING_STATE.WAITING && 'Waiting'}
              {parsingState === EVENT_PARSING_STATE.PARSING && 'Loading...'}
              {parsingState === EVENT_PARSING_STATE.DONE && 'OK'}
            </div>
          </div>
        </Panel>
      </div>
    );
  }
  render() {
    const { parser, report, fight, player, characterProfile, makeTabUrl, selectedTab, premium } = this.props;
    const config = this.context.config;

    const boss = findByBossId(fight.boss);

    const results = !this.isLoading && parser.generateResults({
      i18n, // TODO: Remove and use singleton
      adjustForDowntime: this.state.adjustForDowntime,
    });

    const contributorinfo = <ReadableList>{(config.contributors.length !== 0) ? config.contributors.map(contributor => <Contributor key={contributor.nickname} {...contributor} />) : 'CURRENTLY UNMAINTAINED'}</ReadableList>;

    return (
      <div className={`results boss-${fight.boss}`}>
        <Header
          config={config}
          name={player.name}
          characterProfile={characterProfile}
          boss={boss}
          fight={fight}
          tabs={results ? results.tabs : []}
          makeTabUrl={makeTabUrl}
          selectedTab={selectedTab}
        />

        {boss && boss.fight.resultsWarning && (
          <div className="container">
            <Warning style={{ marginBottom: 30 }}>
              {boss.fight.resultsWarning}
            </Warning>
          </div>
        )}

        {this.renderContent(selectedTab, results)}

        {premium === false && (
          <div key={`${selectedTab}-1`} className="container" style={{ marginTop: 40 }}>
            <Ad />
          </div>
        )}

        <div className="container" style={{ marginTop: 40 }}>
          <div className="row">
            <div className="col-md-8">
              <small>Provided by</small>
              <div style={{ fontSize: 16 }}>
                <Trans>{config.spec.specName} {config.spec.className} analysis has been provided by {contributorinfo}. They love hearing what you think, so please let them know! <Link to={makeTabUrl('about')}>More information about this spec's analyzer.</Link></Trans>
              </div>
            </div>
            <div className="col-md-3">
              <small>View on</small><br />
              <Tooltip content={i18n._(t`Opens in a new tab. View the original report.`)}>
                <a
                  href={makeWclUrl(report.code, { fight: fight.id, source: parser ? parser.playerId : undefined })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ fontSize: 20, padding: '6px 0' }}
                >
                  <img src="/img/wcl.png" alt="" style={{ height: '1.4em', marginTop: '-0.15em' }} /> Warcraft Logs
                </a>
              </Tooltip><br />
              <Tooltip content={i18n._(t`Opens in a new tab. View insights and timelines for raid encounters.`)}>
                <a
                  href={`https://www.wipefest.net/report/${report.code}/fight/${fight.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ fontSize: 20, padding: '6px 0' }}
                >
                  <img src={WipefestLogo} alt="" style={{ height: '1.4em', marginTop: '-0.15em' }} /> Wipefest
                </a>
              </Tooltip>
            </div>
            <div className="col-md-1">
              <Tooltip content={<Trans>Scroll back to the top.</Trans>}>
                <ScrollToTop />
              </Tooltip>
            </div>
          </div>
        </div>

        {premium === false && (
          <div key={`${selectedTab}-2`} className="container" style={{ marginTop: 40 }}>
            <Ad />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedTab: getResultTab(state) || CORE_TABS.OVERVIEW,
  premium: hasPremium(state),
});

export default connect(
  mapStateToProps,
  {
    appendReportHistory,
  }
)(Results);
