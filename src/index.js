import React from 'react';
import { render } from 'react-dom';

import { install as installAnalytics } from 'common/analytics';
import 'interface/static/bootstrap/css/bootstrap.css';

import Root from './Root';

installAnalytics();

render(<Root />, document.getElementById('app-mount'));
