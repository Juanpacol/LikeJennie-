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

module.exports = { create, findById, findAll };
