const jwtUtil = require("../utils/jwt.util");
const { AppError } = require("../utils/errors");

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("No autorizado", 401));
  }

  try {
    const token = header.split(" ")[1];
    req.admin = jwtUtil.verify(token);
    next();
  } catch (err) {
    next(new AppError("Token inválido o expirado", 401));
  }
}

module.exports = authMiddleware;
