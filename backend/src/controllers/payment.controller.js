const paymentService = require("../services/payment.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const checkout = asyncHandler(async (req, res) => {
  const session = await paymentService.createCheckoutSession(req.body);
  ok(res, session, 201);
});

module.exports = { checkout };
