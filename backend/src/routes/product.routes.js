const router = require("express").Router();
const productController = require("../controllers/product.controller");

router.get("/", productController.getCatalog);
router.get("/:slug", productController.getDetail);

module.exports = router;
