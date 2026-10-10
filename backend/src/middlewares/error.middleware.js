const { AppError } = require("../utils/errors");

function errorMiddleware(err, req, res, next) {
  const status = err instanceof AppError ? err.status : 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    success: false,
    error: status === 500 ? "Error interno del servidor" : err.message,
  });
}

module.exports = errorMiddleware;
