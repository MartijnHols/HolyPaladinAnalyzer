import compression from 'compression';
import express from 'express';
import path from 'path';
import fs from 'fs';

import api from './api';
import status from './status';

const app = express();
app.use(compression());
// Any files that exist can be accessed directly.
// If the server has been compiled, the path will be different.
const buildFolder = path.basename(__dirname) === 'build' ? path.join(__dirname, '..', '..', 'build') : path.join(__dirname, '..', 'build');
app.use(express.static(buildFolder));

// Load the index file into memory so we don't have to access it all the time
const index = fs.readFileSync(path.join(buildFolder, 'index.html'), 'utf8');

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(buildFolder, 'index.html'));
});
app.get('/report/:reportCode([A-Za-z0-9]+)/:fightId([0-9]+)?:fightName(-[^/]+)?/:playerName([^/]{2,})?/:tab([A-Za-z0-9-]+)?', (req, res) => {
  let response = index;
  if (req.params.fightName) {
    const fightName = decodeURI(req.params.fightName.substr(1).replace(/\+/g, ' '));
    const playerName = req.params.playerName && decodeURI(req.params.playerName);

    let title = '';
    if (playerName) {
      title = `${fightName} by ${playerName}`;
    } else {
      title = fightName;
    }

    // This is a bit hacky, better solution welcome
    response = response
      .replace('property="og:title" content="WoW Analyzer"', `property="og:title" content="WoW Analyzer: ${escapeHtml(title)}"`)
      .replace('<title>WoW Analyzer</title>', `<title>WoW Analyzer: ${escapeHtml(title)}</title>`);
  }

  res.send(response);
});
app.get('/api/v1/*', api);
app.get('/api/status', status);

app.listen(3000);
console.log('Listening to port 3000');
