const router = require("express").Router();
const paymentController = require("../controllers/payment.controller");

router.post("/checkout", paymentController.checkout);

module.exports = router;
