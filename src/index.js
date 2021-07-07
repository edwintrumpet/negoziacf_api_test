const express = require('express');
const debug = require('debug')('app:server');

const { port } = require('./config');

const app = express();

app.get('/', (req, res) => {
  res.send('Express works!');
});

app.listen(port, (err) => {
  if (err) debug(err);
  else debug(`Listening on http://localhost:${port}`);
});
