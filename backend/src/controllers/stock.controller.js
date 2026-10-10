const stockService = require("../services/stock.service");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response.util");

const getLowStock = asyncHandler(async (req, res) => {
  const variants = await stockService.getLowStockVariants();
  ok(res, variants);
});

module.exports = { getLowStock };
