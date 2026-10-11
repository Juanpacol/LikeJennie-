const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@likejennie.com";
const ADMIN_PASSWORD = "Admin123.";

const CATEGORIES = [
  { name: "Camisetas", slug: "camisetas" },
  { name: "Hoodies", slug: "hoodies" },
  { name: "Accesorios", slug: "accesorios" },
];

const PRODUCTS = [
  {
    name: "Oversized Tee Noir",
    slug: "oversized-tee-noir",
    description: "Camiseta oversized de algodón pesado, corte streetwear.",
    basePrice: 89000,
    salePrice: null,
    category: "camisetas",
    image: "https://picsum.photos/seed/oversized-tee-noir/600/800",
    variants: [
      { size: "S", color: "Negro", stock: 12 },
      { size: "M", color: "Negro", stock: 3 },
      { size: "L", color: "Negro", stock: 0 },
    ],
  },
  {
    name: "Graphic Tee Flow",
    slug: "graphic-tee-flow",
    description: "Camiseta estampada edición limitada.",
    basePrice: 95000,
    salePrice: 75000,
    category: "camisetas",
    image: "https://picsum.photos/seed/graphic-tee-flow/600/800",
    variants: [
      { size: "M", color: "Blanco", stock: 8 },
      { size: "L", color: "Blanco", stock: 4 },
    ],
  },
  {
    name: "Hoodie Mantra",
    slug: "hoodie-mantra",
    description: "Hoodie unisex con bordado minimalista al pecho.",
    basePrice: 169000,
    salePrice: null,
    category: "hoodies",
    image: "https://picsum.photos/seed/hoodie-mantra/600/800",
    variants: [
      { size: "S", color: "Gris", stock: 5 },
      { size: "M", color: "Gris", stock: 2 },
      { size: "L", color: "Negro", stock: 10 },
    ],
  },
  {
    name: "Zen Crewneck",
    slug: "zen-crewneck",
    description: "Buzo crewneck de algodón perchado, fit relajado.",
    basePrice: 145000,
    salePrice: 120000,
    category: "hoodies",
    image: "https://picsum.photos/seed/zen-crewneck/600/800",
    variants: [{ size: "M", color: "Beige", stock: 6 }],
  },
  {
    name: "Gorra Solo",
    slug: "gorra-solo",
    description: "Gorra de seis paneles con logo bordado.",
    basePrice: 59000,
    salePrice: null,
    category: "accesorios",
    image: "https://picsum.photos/seed/gorra-solo/600/800",
    variants: [{ size: "Única", color: "Negro", stock: 1 }],
  },
  {
    name: "Tote Bag Like.Flow",
    slug: "tote-bag-like-flow",
    description: "Tote bag de lona resistente, ideal para uso diario.",
    basePrice: 39000,
    salePrice: null,
    category: "accesorios",
    image: "https://picsum.photos/seed/tote-bag-like-flow/600/800",
    variants: [{ size: "Única", color: "Natural", stock: 20 }],
  },
  {
    name: "Ruby Noir Tee",
    slug: "ruby-noir-tee",
    description: "Camiseta negra oversized, corte limpio, base de la línea Ruby.",
    basePrice: 95000,
    salePrice: null,
    category: "camisetas",
    image: "https://picsum.photos/seed/ruby-noir-tee/600/800",
    variants: [
      { size: "S", color: "Negro", stock: 10 },
      { size: "M", color: "Negro", stock: 6 },
      { size: "L", color: "Negro", stock: 2 },
    ],
  },
  {
    name: "Ruby Heart Tee",
    slug: "ruby-heart-tee",
    description: "Camiseta blanca con gráfico de corazón, edición limitada.",
    basePrice: 85000,
    salePrice: 65000,
    category: "camisetas",
    image: "https://picsum.photos/seed/ruby-heart-tee/600/800",
    variants: [
      { size: "S", color: "Blanco", stock: 4 },
      { size: "M", color: "Blanco", stock: 0 },
    ],
  },
  {
    name: "Statement Tee Crimson",
    slug: "statement-tee-crimson",
    description: "Camiseta negra con tipografía statement a gran escala.",
    basePrice: 99000,
    salePrice: 79000,
    category: "camisetas",
    image: "https://picsum.photos/seed/statement-tee-crimson/600/800",
    variants: [
      { size: "M", color: "Negro", stock: 7 },
      { size: "L", color: "Negro", stock: 3 },
    ],
  },
  {
    name: "Ruby Midnight Hoodie",
    slug: "ruby-midnight-hoodie",
    description: "Hoodie oversized de algodón perchado, gráfico frontal.",
    basePrice: 175000,
    salePrice: null,
    category: "hoodies",
    image: "https://picsum.photos/seed/ruby-midnight-hoodie/600/800",
    variants: [
      { size: "S", color: "Negro", stock: 5 },
      { size: "M", color: "Negro", stock: 1 },
      { size: "L", color: "Negro", stock: 8 },
    ],
  },
  {
    name: "Ruby Canvas Tote",
    slug: "ruby-canvas-tote",
    description: "Tote de lona gruesa con detalle minimalista.",
    basePrice: 45000,
    salePrice: null,
    category: "accesorios",
    image: "https://picsum.photos/seed/ruby-canvas-tote/600/800",
    variants: [{ size: "Única", color: "Negro", stock: 15 }],
  },
  {
    name: "Ruby Gem Keychain",
    slug: "ruby-gem-keychain",
    description: "Llavero metálico con dije en forma de gema.",
    basePrice: 25000,
    salePrice: null,
    category: "accesorios",
    image: "https://picsum.photos/seed/ruby-gem-keychain/600/800",
    variants: [{ size: "Única", color: "Rojo", stock: 25 }],
  },
  {
    name: "Ruby Beanie",
    slug: "ruby-beanie",
    description: "Gorro tejido, calce ajustado, detalle bordado.",
    basePrice: 49000,
    salePrice: null,
    category: "accesorios",
    image: "https://picsum.photos/seed/ruby-beanie/600/800",
    variants: [{ size: "Única", color: "Negro", stock: 9 }],
  },
  {
    name: "Ruby Socks",
    slug: "ruby-socks",
    description: "Medias de algodón con detalle rojo en el borde.",
    basePrice: 22000,
    salePrice: null,
    category: "accesorios",
    image: "https://picsum.photos/seed/ruby-socks/600/800",
    variants: [{ size: "Única", color: "Negro", stock: 0 }],
  },
];

async function main() {
  const categoriesBySlug = {};

  for (const category of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    categoriesBySlug[category.slug] = created;
  }

  for (const product of PRODUCTS) {
    const { category, image, variants, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        categoryId: categoriesBySlug[category].id,
        images: { create: [{ url: image, position: 0 }] },
        variants: {
          create: variants.map((variant) => ({
            ...variant,
            sku: `${product.slug}-${variant.size}-${variant.color}`.toUpperCase(),
          })),
        },
      },
    });
  }

  await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      name: "Admin",
    },
  });

  console.log(`Seed completo: ${CATEGORIES.length} categorías, ${PRODUCTS.length} productos, 1 admin.`);
  console.log(`Credenciales admin de prueba -> email: ${ADMIN_EMAIL} / password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
