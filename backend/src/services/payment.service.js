const stripe = require("../config/stripe");
const orderService = require("./order.service");
const orderRepo = require("../repositories/order.repository");
const { BadRequestError } = require("../utils/errors");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const CURRENCY = "cop";

// Crea la orden en PENDING y una sesión de Stripe Checkout (página de pago alojada por Stripe).
// Devuelve la URL a la que el frontend redirige al cliente. Stripe espera el monto en la unidad
// mínima de la moneda (centavos), por eso el precio se multiplica por 100.
async function createCheckoutSession({ customerName, customerEmail, items }) {
  if (!stripe) throw new BadRequestError("La pasarela de pagos no está configurada");

  const { order, orderItems } = await orderService.createPendingOrder({
    customerName,
    customerEmail,
    items,
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail,
    line_items: orderItems.map(({ quantity, unitPrice, variant }) => ({
      quantity,
      price_data: {
        currency: CURRENCY,
        unit_amount: Math.round(Number(unitPrice) * 100),
        product_data: {
          name: `${variant.product.name} (${variant.size} / ${variant.color})`,
        },
      },
    })),
    // El id de la orden viaja con la sesión para saber qué pedido se pagó.
    metadata: { orderId: order.id },
    success_url: `${FRONTEND_URL}/pago/exito?orden=${order.id}`,
    cancel_url: `${FRONTEND_URL}/pago/cancelado?orden=${order.id}`,
  });

  return { url: session.url, orderId: order.id };
}

// Verifica la firma del webhook (Stripe firma cada evento con STRIPE_WEBHOOK_SECRET) y actúa:
// pago completado -> orden COMPLETED y stock descontado; sesión caducada -> orden CANCELLED.
async function handleWebhook(rawBody, signature) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) throw new BadRequestError("Webhook no configurado");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    throw new BadRequestError("Firma del webhook inválida");
  }

  const session = event.data.object;
  const orderId = session.metadata?.orderId;

  if (event.type === "checkout.session.completed" && session.payment_status === "paid" && orderId) {
    await orderRepo.completeWithStock(orderId);
  } else if (event.type === "checkout.session.expired" && orderId) {
    await orderRepo.cancelIfPending(orderId);
  }

  return { received: true };
}

module.exports = { createCheckoutSession, handleWebhook };
