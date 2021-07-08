const jwt = require('jwt-simple');
const config = require('../config');

function createToken({ id, role }) {
  const now = Date.now();
  const exp = now + (24 * 60 * 60 * 1000);

  const payload = {
    sub: id,
    iat: now,
    role,
    exp,
  };

  return jwt.encode(payload, config.secretToken);
}

module.exports = { createToken };
