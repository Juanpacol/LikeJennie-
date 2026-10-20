// Oculta de la tienda los productos de relleno del seed original (imagen de picsum.photos).
//   node prisma/scripts/deactivate-placeholder-products.js --dry-run   # solo lista
//   node prisma/scripts/deactivate-placeholder-products.js             # aplica
// Solo marca `isActive = false` (reversible desde el admin); no borra filas, porque las
// variantes con órdenes están protegidas por order_items.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const PLACEHOLDER_HOST = "picsum.photos";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const where = { isActive: true, images: { some: { url: { contains: PLACEHOLDER_HOST } } } };

  const products = await prisma.product.findMany({ where, select: { id: true, name: true } });
  for (const product of products) {
    console.log(`${dryRun ? "ocultaría" : "oculto"}: ${product.name}`);
  }

  if (!dryRun) await prisma.product.updateMany({ where, data: { isActive: false } });
  console.log(`${products.length} producto(s) de relleno.`);
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
