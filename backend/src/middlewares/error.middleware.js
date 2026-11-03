const { AppError, MESSAGES } = require("../utils/errors");

function errorMiddleware(err, req, res, next) {
  const status = err instanceof AppError ? err.status : 500;
  if (status === 500) console.error(err);

  const code = status === 500 ? "INTERNAL" : err.code;
  res.status(status).json({ success: false, code, error: MESSAGES[code] ?? err.message });
}

module.exports = errorMiddleware;
