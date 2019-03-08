import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';

import getDifficulty from 'common/getDifficulty';
import getBossName from 'common/getBossName';
import ChecklistIcon from 'interface/icons/Checklist';
import StatisticsIcon from 'interface/icons/Statistics';
import TimelineIcon from 'interface/icons/Timeline';
import ArmorIcon from 'interface/icons/Armor';
import EventsIcon from 'interface/icons/Events';
import AboutIcon from 'interface/icons/About';

import './Header.scss';

class Header extends React.PureComponent {
  static propTypes = {
    config: PropTypes.shape({
      spec: PropTypes.shape({
        className: PropTypes.string.isRequired,
        specName: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    characterProfile: PropTypes.shape({
      region: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
    }),
    boss: PropTypes.shape({
      headshot: PropTypes.string.isRequired,
    }),
    fight: PropTypes.object.isRequired,
    makeTabUrl: PropTypes.func.isRequired,
    selectedTab: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.node.isRequired,
      url: PropTypes.string.isRequired,
      order: PropTypes.number,
    })),
  };

  get pages() {
    const { tabs, selectedTab } = this.props;

    const pages = [
      {
        icon: ChecklistIcon,
        name: <Trans>Overview</Trans>,
        url: 'overview',
      },
      {
        icon: StatisticsIcon,
        name: <Trans>Statistics</Trans>,
        url: 'statistics',
      },
      {
        icon: TimelineIcon,
        name: <Trans>Timeline</Trans>,
        url: 'timeline',
      },
      ...tabs ? tabs.sort((a, b) => a.order - b.order).map(tab => ({
        icon: tab.icon || TimelineIcon,
        name: tab.title,
        url: tab.url,
      })) : [],
      {
        icon: ArmorIcon,
        name: <Trans>Character</Trans>,
        url: 'character',
      },
      {
        icon: AboutIcon,
        name: <Trans>About</Trans>,
        url: 'about',
      },
    ];

    if (selectedTab === 'events') {
      pages.push({
        icon: EventsIcon,
        name: <Trans>Events</Trans>,
        url: 'events',
      });
    }
    return pages;
  }
  get playerIcon() {
    const { characterProfile, config } = this.props;
    if (characterProfile && characterProfile.thumbnail) {
      return `https://render-${characterProfile.region}.worldofwarcraft.com/character/${characterProfile.thumbnail}`;
    }
    return `/specs/${config.spec.className}-${config.spec.specName}.jpg`.replace(/ /, '');
  }

  renderBackground() {
    const { boss } = this.props;

    let backgroundImage = '/img/header.jpg';
    let backgroundPosition = 'center';
    if (boss && boss.background) {
      backgroundImage = boss.background;
      backgroundPosition = boss.backgroundPosition;
    }

    return (
      <div className="background">
        <div className="img" style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: backgroundPosition }} />
      </div>
    );
  }
  renderInfo() {
    const { config: { spec }, name, fight, boss } = this.props;

    return (
      <div className="info container">
        <div className="boss">
          <h2>
            {getDifficulty(fight)}
          </h2>
          <h1>
            {boss ? boss.name : getBossName(fight, false)}
          </h1>
        </div>
        <div className="player">
          <div className="avatar">
            <img src={this.playerIcon} alt="" />
          </div>
          <div className="details">
            <h2>
              {spec.specName} {spec.className}
            </h2>
            <h1 className="name">
              {name}
            </h1>
          </div>
        </div>
      </div>
    );
  }
  renderNavigation() {
    const { makeTabUrl, selectedTab } = this.props;

    return (
      <nav>
        <div className="container">
          <ul>
            {this.pages.map(({ icon: Icon, name, url }) => (
              <li key={url} className={url === selectedTab ? 'active' : undefined}>
                <Link to={makeTabUrl(url)}>
                  <Icon />
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  render() {
    return (
      <header>
        {this.renderBackground()}
        {this.renderInfo()}
        {this.renderNavigation()}
      </header>
    );
  }
}

export default Header;
