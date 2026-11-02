const express = require("express");

const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const validate = require("../middlewares/validate.middleware");
const { checkoutSchema } = require("../validators/payment.validator");

router.post("/checkout", validate(checkoutSchema), paymentController.checkout);
// El webhook necesita el cuerpo sin parsear para verificar la firma de Stripe.
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.webhook);

module.exports = router;
