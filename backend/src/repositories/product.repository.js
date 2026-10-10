const prisma = require("../config/db");

const CATALOG_INCLUDE = {
  category: true,
  images: { orderBy: { position: "asc" } },
  variants: true,
};

function findMany({ categorySlug, onlyActive = true } = {}) {
  return prisma.product.findMany({
    where: {
      ...(onlyActive && { isActive: true }),
      ...(categorySlug && { category: { slug: categorySlug } }),
    },
    include: CATALOG_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

function findBySlug(slug) {
  return prisma.product.findUnique({
    where: { slug },
    include: CATALOG_INCLUDE,
  });
}

function findById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: CATALOG_INCLUDE,
  });
}

function create({ images = [], variants = [], ...productData }) {
  return prisma.product.create({
    data: {
      ...productData,
      images: { create: images },
      variants: { create: variants },
    },
    include: CATALOG_INCLUDE,
  });
}

function update(id, productData) {
  return prisma.product.update({
    where: { id },
    data: productData,
    include: CATALOG_INCLUDE,
  });
}

function remove(id) {
  return prisma.product.delete({ where: { id } });
}

module.exports = { findMany, findBySlug, findById, create, update, remove };
