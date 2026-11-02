import { apiRequest } from "./api";

// Pago con Stripe: crea el pedido pendiente y devuelve la URL de la página de pago de Stripe.
export function createCheckoutSession(payload) {
  return apiRequest("/payments/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
