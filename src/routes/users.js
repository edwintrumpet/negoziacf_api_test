const express = require('express');

const UsersService = require('../services/UsersService');
const validationHandler = require('../middlewares/validationHandler');
const { createUserSchema } = require('../schemas/usersSchemas');

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
};

module.exports = usersRoutes;

/**
 * User
 * email
 * password
 * name
 * role
 */

/**
 * create
 * list
 * get
 * update
 * delete
 */
