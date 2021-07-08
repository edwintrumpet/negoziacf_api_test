const express = require('express');
const usersRoutes = require('./users');

const routes = (app) => {
  const router = express.Router();
  app.use('/', router);
  usersRoutes(app);

  router.get('/', async (req, res, next) => {
    try {
      res.status(200).json({ message: 'Negozia API works!' });
    } catch (err) {
      next(err);
    }
  });
};

module.exports = routes;
