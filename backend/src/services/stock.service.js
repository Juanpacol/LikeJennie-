const variantRepo = require("../repositories/productVariant.repository");
const { STOCK_MINIMO } = require("../constants/stock.constants");
const { BadRequestError, NotFoundError } = require("../utils/errors");

function isOutOfStock(stock) {
  return stock === 0;
}

function isLowStock(stock) {
  return stock > 0 && stock <= STOCK_MINIMO;
}

function getLowStockVariants() {
  return variantRepo.findLowStock(STOCK_MINIMO);
}

async function updateVariantStock(variantId, stock) {
  if (!Number.isInteger(stock) || stock < 0) {
    throw new BadRequestError("STOCK_INVALID");
  }
  const variant = await variantRepo.findById(variantId);
  if (!variant) throw new NotFoundError("VARIANT_NOT_FOUND");
  return variantRepo.updateStock(variantId, stock);
}

module.exports = { isOutOfStock, isLowStock, getLowStockVariants, updateVariantStock };
