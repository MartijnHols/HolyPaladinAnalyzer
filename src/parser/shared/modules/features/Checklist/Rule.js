import React from 'react';
import PropTypes from 'prop-types';

import DropdownIcon from 'interface/icons/Dropdown';
import InformationIcon from 'interface/icons/Information';
import Expandable from 'interface/common/Expandable';
import colorForPerformance from 'common/colorForPerformance';

import calculateMedian from './helpers/calculateMedian';
import average from './helpers/average';
import harmonic from './helpers/harmonic';

export const RuleContext = React.createContext();

export const PERFORMANCE_METHOD = {
  DEFAULT: 'DEFAULT',
  MEDIAN: 'MEDIAN',
  AVERAGE: 'AVERAGE',
  LOWEST: 'LOWEST',
  FIRST: 'FIRST',
  HARMONIC: 'HARMONIC',
};

class Rule extends React.PureComponent {
  static propTypes = {
    name: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    description: PropTypes.node,
    performanceMethod: PropTypes.oneOf(Object.values(PERFORMANCE_METHOD)),
  };

  expandable = null;
  constructor() {
    super();
    this.state = {
      requirementPerformances: [],
    };
    this.expandable = React.createRef();
    this.setRequirementPerformance = this.setRequirementPerformance.bind(this);
  }

  static calculateRulePerformance(values, style = PERFORMANCE_METHOD.DEFAULT) {
    // Lowest would generally be too punishing for small mistakes, if you want to have a single value tank the rule consider making it its own rule.
    // Average would mark things as OK when one thing was OK and 3 things were "average", I think this is wrong and it should mark the rule as average. Median achieves this.
    // Actual Median could mark a rule as 100% ok when there are still some things being neglected, so instead I opted for the best of both worlds and using the lowest of the median or average by default.

    switch (style) {
      case PERFORMANCE_METHOD.DEFAULT:
        return Math.min(calculateMedian(values), average(values));
      case PERFORMANCE_METHOD.MEDIAN:
        return calculateMedian(values);
      case PERFORMANCE_METHOD.AVERAGE:
        return average(values);
      case PERFORMANCE_METHOD.LOWEST:
        return Math.min(...values);
      case PERFORMANCE_METHOD.FIRST:
        return values[0];
      case PERFORMANCE_METHOD.HARMONIC:
        return harmonic(values);
      default:
        throw new Error(`Unknown style: ${style}`);
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (prevState.requirementPerformances !== this.state.requirementPerformances) {
      if (!this.passed) {
        this.expandable.current && this.expandable.current.expand();
      }
    }
  }

  checkEmptyRule(child) {
    if (child.props) {
      return true;
    } else {
      return false;
    }
  }

  setRequirementPerformance(performance) {
    // We don't have to worry about adding the same Requirement's performance multiple times here because it's only called in the Requirement's constructor, which is only called once.
    this.setState(state => ({
      requirementPerformances: [
        ...state.requirementPerformances,
        performance,
      ],
    }));
  }

  get performance() {
    const performanceMethod = this.props.performanceMethod;
    const requirementPerformances = this.state.requirementPerformances;
    return requirementPerformances.length > 0 ? this.constructor.calculateRulePerformance(requirementPerformances, performanceMethod) : 1;
  }
  get passed() {
    return this.performance > 0.666;
  }

  render() {
    const { name, children, description } = this.props;

    const performance = this.performance;
    const passed = this.passed;
    const requirements = this.props.children;

    if (!requirements || (Array.isArray(requirements) && !requirements.some(this.checkEmptyRule))) {
      return null;
    }

    return (
      <RuleContext.Provider value={this.setRequirementPerformance}>
        <Expandable
          element="li"
          className={passed ? 'passed' : 'failed'}
          header={(
            <div className="flex wrapable">
              <div className="flex-main name">
                {name}
              </div>
              <div className="flex-sub perf">
                <div className="perf-container">
                  <div
                    className="perf-bar"
                    style={{
                      width: `${performance * 100}%`,
                      backgroundColor: colorForPerformance(performance),
                    }}
                  />
                </div>
              </div>
              <div className="flex-sub chevron">
                <div>
                  <DropdownIcon />
                </div>
              </div>
            </div>
          )}
          ref={this.expandable}
        >
          {description && (
            <div className="row text-muted description">
              <InformationIcon />
              <div className="col-md-12">
                {description}
              </div>
            </div>
          )}
          <div className="row">
            {children}
          </div>
        </Expandable>
      </RuleContext.Provider>
    );
  }
}

export default Rule;
