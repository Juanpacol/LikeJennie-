const Stripe = require("stripe");

// Cliente de Stripe. La clave secreta (sk_test_... en modo de prueba) solo vive en el servidor.
const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.warn("STRIPE_SECRET_KEY no está definida: los pagos con Stripe no funcionarán.");
}

module.exports = secretKey ? new Stripe(secretKey) : null;
