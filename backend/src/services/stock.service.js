const variantRepo = require("../repositories/productVariant.repository");
const { STOCK_MINIMO } = require("../constants/stock.constants");

function isOutOfStock(stock) {
  return stock === 0;
}

function isLowStock(stock) {
  return stock > 0 && stock <= STOCK_MINIMO;
}

function getLowStockVariants() {
  return variantRepo.findLowStock(STOCK_MINIMO);
}

module.exports = { isOutOfStock, isLowStock, getLowStockVariants };
