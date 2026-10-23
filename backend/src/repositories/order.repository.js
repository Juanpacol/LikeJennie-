const prisma = require("../config/db");

function create({ items, ...orderData }) {
  return prisma.order.create({
    data: {
      ...orderData,
      items: { create: items },
    },
    include: { items: { include: { variant: true } } },
  });
}

function findById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { variant: true } } },
  });
}

function findAll() {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

// Marca la orden como pagada y descuenta el stock de cada línea, todo en una transacción. Solo actúa
// si la orden sigue en PENDING: así un evento repetido de Stripe no descuenta dos veces.
function completeWithStock(id) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!order || order.status !== "PENDING") return null;

    for (const { variantId, quantity } of order.items) {
      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: { decrement: quantity } },
      });
    }
    return tx.order.update({ where: { id }, data: { status: "COMPLETED" } });
  });
}

// Cancela la orden si aún está pendiente (pago caducado o abandonado).
function cancelIfPending(id) {
  return prisma.order.updateMany({
    where: { id, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

module.exports = { create, findById, findAll, completeWithStock, cancelIfPending };
