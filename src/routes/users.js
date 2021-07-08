const express = require('express');

const UsersService = require('../services/UsersService');
const validationHandler = require('../middlewares/validationHandler');
const { createUserSchema, id: userIdSchema } = require('../schemas/usersSchemas');
const { verifyToken } = require('../middlewares/authHandler');

const usersRoutes = (app) => {
  const router = express.Router();
  app.use('/users', router);

  const usersService = new UsersService();

  router.post(
    '/',
    validationHandler(createUserSchema),
    async (req, res, next) => {
      const { body: user } = req;
      try {
        const createdUserID = await usersService.createUser(user);
        res.status(201).json({ message: 'user created', data: createdUserID });
      } catch (err) {
        next(err);
      }
    },
  );

  router.get(
    '/:userId',
    validationHandler({ userId: userIdSchema }, 'params'),
    verifyToken,
    async (req, res, next) => {
      const { payload, params: { userId } } = req;
      try {
        const user = await usersService.getUser(payload, userId);
        res.status(200).json({ message: 'user found', data: user });
      } catch (err) {
        next(err);
      }
    },
  );
};

module.exports = usersRoutes;
