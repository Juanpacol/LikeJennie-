const prisma = require("../config/db");

function findAll() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

function findBySlug(slug) {
  return prisma.category.findUnique({ where: { slug } });
}

module.exports = { findAll, findBySlug };
