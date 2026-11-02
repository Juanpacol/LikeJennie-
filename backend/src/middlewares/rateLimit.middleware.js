const rateLimit = require("express-rate-limit");

const WINDOW_MS = 15 * 60 * 1000;

function limiter({ max, message, ...options }) {
  return rateLimit({
    windowMs: WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: message },
    ...options,
  });
}

// Login: 10 intentos fallidos por IP cada 15 minutos (los correctos no cuentan). Frena la fuerza bruta.
const loginLimiter = limiter({
  max: 10,
  skipSuccessfulRequests: true,
  message: "Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.",
});

// Checkout: cada petición crea una orden y una sesión de Stripe, así que se limita más.
const checkoutLimiter = limiter({
  max: 20,
  message: "Demasiados pedidos seguidos. Espera unos minutos e inténtalo de nuevo.",
});

// Tope general para toda la API (el catálogo hace varias peticiones por página).
const apiLimiter = limiter({
  max: 600,
  message: "Demasiadas peticiones. Espera unos minutos e inténtalo de nuevo.",
});

module.exports = { loginLimiter, checkoutLimiter, apiLimiter };
