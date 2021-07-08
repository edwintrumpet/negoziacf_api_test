const Joi = require('joi');

const id = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
const email = Joi.string().email();
const password = Joi.string().min(8);

const createUserSchema = {
  email: email.required(),
  password: password.required(),
  name: Joi.string().required(),
  role: Joi.string().pattern(/^(admin)|(user)$/).required(),
};

const loginSchema = {
  email: email.required(),
  password: password.required(),
};

module.exports = { createUserSchema, loginSchema, id };
