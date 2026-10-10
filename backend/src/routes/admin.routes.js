const router = require("express").Router();
const adminProductController = require("../controllers/adminProduct.controller");
const stockController = require("../controllers/stock.controller");
const orderController = require("../controllers/order.controller");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/dashboard", dashboardController.summary);

router.get("/products", adminProductController.list);
router.post("/products", adminProductController.create);
router.put("/products/:id", adminProductController.update);
router.delete("/products/:id", adminProductController.remove);

router.get("/stock/low", stockController.getLowStock);
router.get("/orders", orderController.adminList);

module.exports = router;
