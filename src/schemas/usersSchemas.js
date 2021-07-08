const Joi = require('joi');

const email = Joi.string().email().required();
const password = Joi.string().min(8).required();

const createUserSchema = {
  email,
  password,
  name: Joi.string().required(),
  role: Joi.string().pattern(/^(admin)|(user)$/).required(),
};

const loginSchema = {
  email,
  password,
};

module.exports = { createUserSchema, loginSchema };
