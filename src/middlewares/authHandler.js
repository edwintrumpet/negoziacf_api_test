const Boom = require('@hapi/boom');
const jwt = require('jwt-simple');
const { secretToken } = require('../config');

const verifyToken = (req, res, next) => {
  const { cookies } = req;

  if (!cookies || !cookies.token) {
    throw Boom.unauthorized('Access token does not exist');
  }

  let payload;
  try {
    payload = jwt.decode(cookies.token, secretToken);
  } catch (err) {
    throw Boom.unauthorized(err);
  }

  req.payload = {
    sub: payload.sub,
    role: payload.role,
  };

  next();
};

module.exports = { verifyToken };
