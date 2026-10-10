const variantRepo = require("../repositories/productVariant.repository");
const orderRepo = require("../repositories/order.repository");
const { NotFoundError, BadRequestError } = require("../utils/errors");

// Simulacro de compra: valida stock, fija el precio al momento de la orden
// y descuenta el inventario de cada variante comprada.
async function createOrder({ customerName, customerEmail, items }) {
  if (!items || items.length === 0) {
    throw new BadRequestError("El carrito está vacío");
  }

  const orderItems = [];
  let total = 0;

  for (const { variantId, quantity } of items) {
    const variant = await variantRepo.findById(variantId);
    if (!variant) throw new NotFoundError(`Variante ${variantId} no encontrada`);
    if (variant.stock < quantity) {
      throw new BadRequestError(`Stock insuficiente para ${variant.sku}`);
    }

    const unitPrice = variant.product.salePrice ?? variant.product.basePrice;
    orderItems.push({ variantId, quantity, unitPrice });
    total += Number(unitPrice) * quantity;
  }

  for (const { variantId, quantity } of items) {
    await variantRepo.decrementStock(variantId, quantity);
  }

  return orderRepo.create({ customerName, customerEmail, total, items: orderItems });
}

function listOrders() {
  return orderRepo.findAll();
}

function getOrderById(id) {
  return orderRepo.findById(id);
}

module.exports = { createOrder, listOrders, getOrderById };
