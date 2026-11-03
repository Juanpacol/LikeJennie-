const variantRepo = require("../repositories/productVariant.repository");
const orderRepo = require("../repositories/order.repository");
const { NotFoundError, BadRequestError } = require("../utils/errors");

// Valida el carrito y fija el precio de cada línea al momento de la orden. Devuelve las líneas
// con su variante (para nombrar el producto en el pago) y el total.
async function buildOrderItems(items) {
  if (!items || items.length === 0) {
    throw new BadRequestError("CART_EMPTY");
  }

  const orderItems = [];
  let total = 0;

  for (const { variantId, quantity } of items) {
    const variant = await variantRepo.findById(variantId);
    if (!variant) throw new NotFoundError("CART_ITEM_GONE");
    if (variant.stock < quantity) {
      throw new BadRequestError("INSUFFICIENT_STOCK");
    }

    const unitPrice = variant.product.salePrice ?? variant.product.basePrice;
    orderItems.push({ variantId, quantity, unitPrice, variant });
    total += Number(unitPrice) * quantity;
  }

  return { orderItems, total };
}

// Compra con pasarela: crea la orden en PENDING y NO toca el inventario; el stock se descuenta
// cuando el pago se confirma (ver payment.service).
async function createPendingOrder({ customerName, customerEmail, items }) {
  const { orderItems, total } = await buildOrderItems(items);
  const order = await orderRepo.create({
    customerName,
    customerEmail,
    total,
    items: orderItems.map(({ variant, ...line }) => line),
  });
  return { order, orderItems };
}

function listOrders() {
  return orderRepo.findAll();
}

function getOrderById(id) {
  return orderRepo.findById(id);
}

module.exports = { createPendingOrder, listOrders, getOrderById };
