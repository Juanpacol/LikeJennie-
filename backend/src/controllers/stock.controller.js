const stockService = require("../services/stock.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const getLowStock = asyncHandler(async (req, res) => {
  const variants = await stockService.getLowStockVariants();
  ok(res, variants);
});

const updateStock = asyncHandler(async (req, res) => {
  const variant = await stockService.updateVariantStock(req.params.variantId, Number(req.body.stock));
  ok(res, variant);
});

module.exports = { getLowStock, updateStock };
