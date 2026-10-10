const prisma = require("../config/db");

function findById(id) {
  return prisma.productVariant.findUnique({ where: { id }, include: { product: true } });
}

function findLowStock(threshold) {
  return prisma.productVariant.findMany({
    where: { stock: { lte: threshold } },
    include: { product: true },
    orderBy: { stock: "asc" },
  });
}

function updateStock(id, stock) {
  return prisma.productVariant.update({ where: { id }, data: { stock } });
}

function decrementStock(id, quantity) {
  return prisma.productVariant.update({
    where: { id },
    data: { stock: { decrement: quantity } },
  });
}

module.exports = { findById, findLowStock, updateStock, decrementStock };
