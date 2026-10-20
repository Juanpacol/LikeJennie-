// Alinea las categorías con las colecciones de la tienda de referencia:
//   Camisetas -> Ropa (apparel), Hoodies -> Abrigos (outerwear), Accesorios (igual), Música (nueva).
// Idempotente: se puede correr varias veces. Los productos conservan su categoría porque se
// renombra la fila existente (mismo id) en vez de borrarla.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const RENAMES = [
  { from: "camisetas", name: "Ropa", slug: "ropa" },
  { from: "hoodies", name: "Abrigos", slug: "abrigos" },
];
const NEW_CATEGORIES = [{ name: "Música", slug: "musica" }];

// Renombra la categoría `from` a `slug`. Si `slug` ya existe, mueve sus productos allí y borra la vieja.
async function renameCategory({ from, name, slug }) {
  const old = await prisma.category.findUnique({ where: { slug: from } });
  if (!old) return console.log(`${from}: ya no existe, nada que hacer`);

  const target = await prisma.category.findUnique({ where: { slug } });
  if (!target) {
    await prisma.category.update({ where: { id: old.id }, data: { name, slug } });
    return console.log(`${from} -> ${slug}: renombrada`);
  }

  const moved = await prisma.product.updateMany({
    where: { categoryId: old.id },
    data: { categoryId: target.id },
  });
  await prisma.category.delete({ where: { id: old.id } });
  console.log(`${from} -> ${slug}: ${moved.count} producto(s) movidos, categoría vieja borrada`);
}

async function main() {
  for (const rename of RENAMES) await renameCategory(rename);

  for (const category of NEW_CATEGORIES) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
    console.log(`categoría lista: ${category.slug}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
