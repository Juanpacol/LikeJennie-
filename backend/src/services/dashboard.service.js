const productRepo = require("../repositories/product.repository");
const orderRepo = require("../repositories/order.repository");
const stockService = require("./stock.service");

// Resumen estadístico para la pantalla de bienvenida del panel admin.
async function getSummary() {
  const [activeProducts, lowStockVariants, orders] = await Promise.all([
    productRepo.findMany({ onlyActive: true }),
    stockService.getLowStockVariants(),
    orderRepo.findAll(),
  ]);

  return {
    activeProductsCount: activeProducts.length,
    lowStockCount: lowStockVariants.length,
    ordersCount: orders.length,
    lowStockVariants,
    recentOrders: orders.slice(0, 5),
  };
}

module.exports = { getSummary };
