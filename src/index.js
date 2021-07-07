const express = require('express');
const debug = require('debug')('app:server');

const { port } = require('./config');
const routes = require('./routes');
const { logErrors, wrapErrors, errorHandler } = require('./middlewares/errorHandlers');
const notFoundHandler = require('./middlewares/notFoundHandler');

// Initializations
const app = express();
app.use(express.json());

// Routes
routes(app);

// Catch 404
app.use(notFoundHandler);

// Handle errors
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

// Server
app.listen(port, (err) => {
  if (err) debug(err);
  else debug(`Listening on http://localhost:${port}`);
});
