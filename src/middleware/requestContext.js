const { randomUUID } = require('crypto');

function requestContext(req, _res, next) {
  req.requestId = randomUUID();
  next();
}

module.exports = { requestContext };
