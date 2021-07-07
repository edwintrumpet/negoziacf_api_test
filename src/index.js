const express = require('express');
const debug = require('debug')('app:server');

const { port } = require('./config');
const routes = require('./routes');

// Initializations
const app = express();

// Routes
routes(app);

// Server
app.listen(port, (err) => {
  if (err) debug(err);
  else debug(`Listening on http://localhost:${port}`);
});
