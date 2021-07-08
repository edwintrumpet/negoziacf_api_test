const Joi = require('joi');

const createUserSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required(),
  role: Joi.string().pattern(/^(admin)|(user)$/).required(),
};

module.exports = { createUserSchema };
