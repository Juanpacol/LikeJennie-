const router = require("express").Router();
const categoryController = require("../controllers/category.controller");

router.get("/", categoryController.list);

module.exports = router;
