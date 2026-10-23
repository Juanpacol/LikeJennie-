const express = require("express");

const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/checkout", paymentController.checkout);
// El webhook necesita el cuerpo sin parsear para verificar la firma de Stripe.
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.webhook);

module.exports = router;
