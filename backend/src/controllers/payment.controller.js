const paymentService = require("../services/payment.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const checkout = asyncHandler(async (req, res) => {
  const session = await paymentService.createCheckoutSession(req.body);
  ok(res, session, 201);
});

// Recibe el cuerpo crudo (Buffer) que Stripe firmó; por eso la ruta usa express.raw.
const webhook = asyncHandler(async (req, res) => {
  const result = await paymentService.handleWebhook(req.body, req.headers["stripe-signature"]);
  ok(res, result);
});

module.exports = { checkout, webhook };
