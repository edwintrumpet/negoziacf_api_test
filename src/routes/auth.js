const express = require('express');

const AuthService = require('../services/AuthService');
const validationHandler = require('../middlewares/validationHandler');
const { loginSchema } = require('../schemas/usersSchemas');
const { isDev } = require('../config');
const { nextYear } = require('../utils/dates');

const authRoutes = (app) => {
  const router = express.Router();
  app.use('/', router);

  const authService = new AuthService();

  router.post(
    '/login',
    validationHandler(loginSchema),
    async (req, res, next) => {
      const { body: credentials } = req;
      try {
        const {
          token, role, name, id,
        } = await authService.login(credentials);
        res
          .status(200)
          .cookie('token', token, {
            httpOnly: !isDev,
            secure: !isDev,
            expires: nextYear(),
          })
          .json({ message: 'success login', data: { id, name, role } });
      } catch (err) {
        next(err);
      }
    },
  );
};

module.exports = authRoutes;
