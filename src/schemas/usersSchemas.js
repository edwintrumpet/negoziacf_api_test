const Joi = require('joi');

const id = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string().pattern(/^(admin)|(user)$/);

const createUserSchema = {
  email: email.required(),
  password: password.required(),
  name: Joi.string().required(),
  role: role.required(),
};

const queryFilterSchema = {
  name: Joi.string(),
  email: Joi.string(),
  sortby: Joi.string().pattern(/^(createdAt)|(upsatedAt)|(name)$/),
  sort: Joi.string().pattern(/^(asc)|(desc)$/),
  role,
};

const loginSchema = {
  email: email.required(),
  password: password.required(),
};

module.exports = {
  createUserSchema, loginSchema, id, queryFilterSchema,
};
