const express = require('express');
const debug = require('debug')('app:server');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { logErrors, wrapErrors, errorHandler } = require('./middlewares/errorHandlers');
const { port } = require('./config');
const notFoundHandler = require('./middlewares/notFoundHandler');
const routes = require('./routes');

// Initializations
const app = express();
app.use(cors({
  origin: true,
  credentials: true,
}));

// Adapt request
app.use(cookieParser());
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
