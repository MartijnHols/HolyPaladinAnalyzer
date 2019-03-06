import React from 'react';

import CORE_CHANGELOG from 'CHANGELOG';
import AVAILABLE_CONFIGS from 'parser/AVAILABLE_CONFIGS';
import Changelog from './index';

class ChangelogPanel extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      expanded: false,
      changelogType: 0,
    };
  }

  render() {
    const limit = this.state.expanded ? null : 10;

    return (
      <div className="panel">
        <div className="panel-heading">
          <h1>Changelog</h1>
        </div>
        <div className="panel-body pad">
          <select
            className="form-control"
            value={this.state.changelogType}
            onChange={e => this.setState({ changelogType: Number(e.target.value) })}
          >
            <option value={0}>Core</option>
            {AVAILABLE_CONFIGS.map(config => (
              <option value={config.spec.id} key={config.spec.id}>{config.spec.specName} {config.spec.className}</option>
            ))}
          </select>

          <div style={{ margin: '30px -30px 0 -30px' }}>
            <Changelog
              changelog={this.state.changelogType ? AVAILABLE_CONFIGS.find(config => config.spec.id === this.state.changelogType).changelog : CORE_CHANGELOG}
              limit={limit}
              includeCore={false}
            />
          </div>
          {limit !== null && (
            <button className="btn btn-link" onClick={() => this.setState({ expanded: true })} style={{ padding: 0 }}>More</button> // eslint-disable-line jsx-a11y/anchor-is-valid
          )}
        </div>
      </div>
    );
  }
}

export default ChangelogPanel;
