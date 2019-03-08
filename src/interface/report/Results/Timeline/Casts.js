import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from 'common/Tooltip';
import { formatDuration } from 'common/format';
import Icon from 'common/Icon';
import SpellLink from 'common/SpellLink';
import CASTS_THAT_ARENT_CASTS from 'parser/core/CASTS_THAT_ARENT_CASTS';

import './Casts.scss';

const ICON_WIDTH = 22;

class Casts extends React.PureComponent {
  static propTypes = {
    start: PropTypes.number.isRequired,
    secondWidth: PropTypes.number.isRequired,
    parser: PropTypes.shape({
      eventHistory: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
  };

  constructor() {
    super();
    this.renderEvent = this.renderEvent.bind(this);
  }

  getOffsetLeft(timestamp) {
    return (timestamp - this.props.start) / 1000 * this.props.secondWidth;
  }

  isApplicableCastEvent(event) {
    const parser = this.props.parser;

    if (!parser.byPlayer(event)) {
      // Ignore pet/boss casts
      return false;
    }
    const spellId = event.ability.guid;
    if (CASTS_THAT_ARENT_CASTS.includes(spellId)) {
      return false;
    }
    return true;
  }

  renderEvent(event) {
    switch (event.type) {
      case 'cast':
        if (this.isApplicableCastEvent(event)) {
          return this.renderCast(event);
        } else {
          return null;
        }
      case 'beginchannel':
        if (this.isApplicableCastEvent(event)) {
          return this.renderBeginChannel(event);
        } else {
          return null;
        }
      case 'endchannel':
        return this.renderChannel(event);
      case 'globalcooldown':
        return this.renderGlobalCooldown(event);
      default:
        return null;
    }
  }
  _lastLowered = null;
  _level = 0;
  _maxLevel = 0;
  renderCast(event) {
    if (event.channel) {
      // If a spell has a channel event, it has a cast time/is channeled and we already rendered it in the `beginchannel` event
      return null;
    }

    let className = '';
    const left = this.getOffsetLeft(event.timestamp);

    // Hoist abilities off the GCD below the main timeline-bar
    const lower = !event.globalCooldown;
    let level = 0;
    if (lower) {
      className += ' lower';
      // Avoid overlapping icons
      const margin = left - this._lastLowered;
      if (this._lastLowered && margin < ICON_WIDTH) {
        this._level += 1;
        level = this._level;
        this._maxLevel = Math.max(this._maxLevel, level);
      } else {
        this._level = 0;
      }
      this._lastLowered = left;
    }

    let castReason;
    const meta = event.meta;
    if (meta) {
      if (meta.isInefficientCast) {
        className += ' inefficient';
        castReason = meta.inefficientCastReason;
      } else if (meta.isEnhancedCast) {
        className += ' enhanced';
        castReason = meta.enhancedCastReason;
      }
    }

    return this.renderIcon(event, {
      className,
      style: {
        '--level': level > 0 ? level : undefined,
      },
      children: lower ? (
        <div className="time-indicator" />
      ) : undefined,
      tooltip: castReason,
    });
  }
  renderBeginChannel(event) {
    let className = '';
    let castReason;
    if (event.isCancelled) {
      className += ' cancelled';
      castReason = 'Cast never finished.';
    }
    // If the beginchannel has a meta prop use that.
    // If it doesn't, look inside the trigger (which should be a begincast).
    // If the trigger doesn't have a meta prop, and it's a begincast event, use the cast event's instead. We need to do this since often we can only determine if something was a bad cast on cast finish, e.g. if a player should only cast something while a buff is up on finish.
    // Using the cast event's meta works here since the timeline is only ever called when parsing has finished, so it doesn't matter that it's not chronological.
    // This is kind of an ugly hack, but it's the only way to render an icon on the beginchannel event while allowing maintainers to mark the cast events bad. We could have forced everyone to modify meta on the beginchannel/begincast event instead, but that would be inconvenient and unexpected with no real gain.
    const meta = event.meta || (event.trigger && event.trigger.meta) || (event.trigger && event.trigger.type === 'begincast' && event.trigger.castEvent && event.trigger.castEvent.meta);
    if (meta) {
      if (meta.isInefficientCast) {
        className += ' inefficient';
        castReason = meta.inefficientCastReason;
      } else if (meta.isEnhancedCast) {
        className += ' enhanced';
        castReason = meta.enhancedCastReason;
      }
    }

    return this.renderIcon(event, {
      className,
      tooltip: castReason,
    });
  }
  renderIcon(event, { className = '', style = {}, children, tooltip } = {}) {
    const left = this.getOffsetLeft(event.timestamp);
    const icon = (
      <SpellLink
        key={`cast-${left}-${event.ability.guid}`}
        id={event.ability.guid}
        icon={false}
        className={`cast ${className}`}
        style={{
          left,
          ...style,
        }}
      >
        <Icon
          icon={event.ability.abilityIcon.replace('.jpg', '')}
          alt={event.ability.name}
        />
        {children}
      </SpellLink>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip}>
          {icon}
        </Tooltip>
      );
    } else {
      return icon;
    }
  }
  renderChannel(event) {
    const start = this.props.start;
    const left = this.getOffsetLeft(event.start);
    const fightDuration = (event.start - start) / 1000;

    return (
      <Tooltip
        key={`channel-${left}-${event.ability.guid}`}
        content={`${formatDuration(fightDuration, 3)}: ${(event.duration / 1000).toFixed(2)}s channel by ${event.ability.name}`}
      >
        <div
          className="channel"
          style={{
            left,
            width: event.duration / 1000 * this.props.secondWidth,
          }}
        />
      </Tooltip>
    );
  }
  renderGlobalCooldown(event) {
    const start = this.props.start;
    const left = this.getOffsetLeft(event.timestamp);
    const fightDuration = (event.timestamp - start) / 1000;

    return (
      <Tooltip
        key={`gcd-${left}-${event.ability.guid}`}
        content={`${formatDuration(fightDuration, 3)}: ${(event.duration / 1000).toFixed(2)}s Global Cooldown by ${event.ability.name}`}
      >
        <div
          className="gcd"
          style={{
            left,
            width: event.duration / 1000 * this.props.secondWidth,
          }}
        />
      </Tooltip>
    );
  }
  render() {
    const { parser } = this.props;

    const content = parser.eventHistory.map(this.renderEvent);

    return (
      <div className="casts" style={{ '--levels': this._maxLevel + 1 }}>
        {content}
      </div>
    );
  }
}

export default Casts;
