// Importa productos desde un JSON de prisma/data/ (ver catalog-*.json).
//   node prisma/scripts/import-catalog.js catalog-apparel.json            # crea los que falten
//   node prisma/scripts/import-catalog.js catalog-apparel.json --dry-run  # solo muestra qué haría
// Idempotente: un producto se omite si ya existe uno con el mismo slug o el mismo nombre.
// Las imágenes se guardan solo como URL (no se descargan ni se suben archivos).
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importProduct(product, { dryRun }) {
  const exists = await prisma.product.findFirst({
    where: { OR: [{ slug: product.slug }, { name: product.name }] },
  });
  if (exists) return console.log(`omitido (ya existe): ${product.name}`);

  const category = await prisma.category.findUnique({ where: { slug: product.category } });
  if (!category) throw new Error(`Falta la categoría "${product.category}" para ${product.name}`);

  if (dryRun) return console.log(`crearía: ${product.name} (${product.category}, $${product.basePrice})`);

  await prisma.product.create({
    data: {
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      categoryId: category.id,
      images: { create: product.images.map((url, position) => ({ url, position })) },
      variants: {
        create: product.variants.map((variant) => ({
          ...variant,
          sku: `${product.slug}-${variant.size}-${variant.color}`.toUpperCase(),
        })),
      },
    },
  });
  console.log(`creado: ${product.name}`);
}

async function main() {
  const [file, ...flags] = process.argv.slice(2);
  if (!file) throw new Error("Uso: node prisma/scripts/import-catalog.js <archivo.json> [--dry-run]");

  const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data", file), "utf8"));
  const dryRun = flags.includes("--dry-run");

  for (const product of products) await importProduct(product, { dryRun });
}

main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
