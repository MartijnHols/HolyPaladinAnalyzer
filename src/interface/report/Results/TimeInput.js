import React from 'react';
import PropTypes from 'prop-types';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

class TimeInput extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
  };

  constructor(...args) {
    super(...args);
    this.phaseRef = React.createRef();
    this.handleChangeM = this.handleChangeM.bind(this);
    this.handleChangeS = this.handleChangeS.bind(this);
    this.handleChangeMs = this.handleChangeMs.bind(this);
    this.submitChange = this.submitChange.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.state = this.convertTime(this.props.time);
    this.mRef = React.createRef();
    this.sRef = React.createRef();
    this.msRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.time !== prevProps.time) {
      this.setState(this.convertTime(this.props.time));
    }
  }

  convertTime(time) {
    return {
      milliseconds: this.toMillisecond(time),
      seconds: this.toSecond(time),
      minutes: this.toMinute(time),
    };
  }

  toMinute(ms) {
    return parseInt(ms / MINUTE);
  }

  toSecond(ms) {
    return parseInt((ms % MINUTE) / SECOND);
  }

  toMillisecond(ms) {
    return parseInt(ms % SECOND);
  }

  changeTime(time) {
    if (time > this.props.max || time < this.props.min) {
      this.forceUpdate();
      return;
    }
    this.setState(this.convertTime(time));
    this.submitChange(time);

  }

  handleChangeM(e) {
    const val = parseInt(e.target.value, 10);
    if (val > 99) {
      this.forceUpdate();
      return;
    }
    this.changeTime(MINUTE * val + SECOND * this.state.seconds + this.state.milliseconds);
  }

  handleChangeS(e) {
    const val = parseInt(e.target.value, 10);
    if (val > 99) {
      this.forceUpdate();
      return;
    }
    this.changeTime(MINUTE * this.state.minutes + SECOND * val + this.state.milliseconds);
  }

  handleChangeMs(e) {
    const val = parseInt(e.target.value, 10);
    if (val > 999) {
      this.forceUpdate();
      return;
    }
    this.changeTime(MINUTE * this.state.minutes + SECOND * this.state.seconds + val);
  }

  submitChange(time) {
    this.props.onChange(time);
  }

  pad(number, digits) {
    return number.toString().padStart(digits, '0');
  }

  render() {
    const { name, style } = this.props;
    return (
      <div style={{ ...style }} className={`time-input ${name}`}>
        <input ref={this.mRef} className={`form-control ${name}-minute`} type="number" min="0" max="99" value={this.pad(this.state.minutes, 2)} onChange={this.handleChangeM} />:
        <input ref={this.sRef} className={`form-control ${name}-second`} type="number" min="0" max="99" value={this.pad(this.state.seconds, 2)} onChange={this.handleChangeS} />.
        <input ref={this.msRef} className={`form-control ${name}-millisecond`} type="number" min="0" max="999" value={this.pad(this.state.milliseconds, 3)} onChange={this.handleChangeMs} />
      </div>
    );
  }
}

export default TimeInput;
