const { logger } = require('../lib/logger');

function notFound(_req, res) {
  res.status(404).send('<h1>404</h1>');
}

function errorHandler(err, req, res, _next) {
  logger.error({ message: err.message, requestId: req.requestId, stack: err.stack });
  res.status(err.status || 500).json({ ok: false, error: 'Внутренняя ошибка сервера', requestId: req.requestId });
}

module.exports = { notFound, errorHandler };
