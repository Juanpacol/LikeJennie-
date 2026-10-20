const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@likejennie.com";
const ADMIN_PASSWORD = "Admin123.";

const CATEGORIES = [
  { name: "Ropa", slug: "ropa" },
  { name: "Abrigos", slug: "abrigos" },
  { name: "Accesorios", slug: "accesorios" },
  { name: "Música", slug: "musica" },
];

const PRODUCTS = [
  {
    name: "Oversized Tee Noir",
    slug: "oversized-tee-noir",
    description: "Camiseta oversized de algodón pesado, corte streetwear.",
    basePrice: 89000,
    salePrice: null,
    category: "ropa",
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
    category: "ropa",
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
    category: "abrigos",
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
    category: "abrigos",
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
    category: "ropa",
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
    category: "ropa",
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
    category: "ropa",
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
    category: "abrigos",
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
  {
    name: "Camiseta Estampado Fotográfico Jennie",
    slug: "camiseta-estampado-fotografico-jennie",
    description: "Camiseta con cuello redondo y manga corta, estampado JENNIE en delantero y espalda.",
    basePrice: 89000,
    salePrice: null,
    category: "ropa",
    image:
      "https://static.zara.net/assets/public/e978/0822/67524def8d69/85691c52ea78/04479702807-p/04479702807-p.jpg",
    variants: [
      { size: "S", color: "Gris antracita", stock: 8 },
      { size: "M", color: "Gris antracita", stock: 5 },
      { size: "L", color: "Gris antracita", stock: 3 },
    ],
  },
  {
    name: "Gorra Efecto Lavado Bordado Jennie",
    slug: "gorra-efecto-lavado-bordado-jennie",
    description: "Gorra efecto lavado con bordado JENNIE.",
    basePrice: 59000,
    salePrice: null,
    category: "accesorios",
    image:
      "https://static.zara.net/assets/public/8976/bb9a/afd747f0803c/f0331f1b5114/04479749811-e1/04479749811-e1.jpg",
    variants: [{ size: "Única", color: "Gris claro", stock: 10 }],
  },
  {
    name: "Oversized Printed T-shirt Jennie",
    slug: "oversized-printed-tshirt-jennie-hm",
    description: "Camiseta oversized con estampado JENNIE, cuello redondo, manga corta.",
    basePrice: 129000,
    salePrice: null,
    category: "ropa",
    image: "https://image.hm.com/assets/hm/85/f9/85f9005dfd29ac03ba82f16e4e1fadbcc32d4d7f.jpg",
    variants: [
      { size: "S", color: "Negro", stock: 6 },
      { size: "M", color: "Negro", stock: 4 },
      { size: "L", color: "Negro", stock: 2 },
    ],
  },
  {
    name: "Hoodie Jennie",
    slug: "hoodie-jennie",
    description: "Hoodie con capucha y manga larga, acabados en rib, estampado JENNIE en pechera y espalda.",
    basePrice: 229000,
    salePrice: null,
    category: "abrigos",
    image:
      "https://static.zara.net/assets/public/36a2/4c87/47e74c59bdff/22fc77471e0b/04479703812-e1/04479703812-e1.jpg",
    variants: [
      { size: "S", color: "Gris vigoré", stock: 5 },
      { size: "M", color: "Gris vigoré", stock: 3 },
      { size: "L", color: "Gris vigoré", stock: 1 },
    ],
  },
  {
    name: "Camiseta Estampado Fotografía Jennie",
    slug: "camiseta-estampado-fotografia-jennie",
    description: "Camiseta con cuello redondo y manga corta, estampado fotografía JENNIE.",
    basePrice: 79000,
    salePrice: null,
    category: "ropa",
    image:
      "https://static.zara.net/assets/public/2a5b/b51d/adf54965aa19/a76beca09771/04479705250-p/04479705250-p.jpg",
    variants: [
      { size: "S", color: "Blanco", stock: 7 },
      { size: "M", color: "Blanco", stock: 5 },
      { size: "L", color: "Blanco", stock: 0 },
    ],
  },
  {
    name: "Bandana Estampado Rayas",
    slug: "bandana-estampado-rayas",
    description: "Bandana fina con estampado de rayas.",
    basePrice: 29000,
    salePrice: null,
    category: "accesorios",
    image:
      "https://static.zara.net/assets/public/5736/b231/941642e4b8e8/3c85d55411b9/04758748630-e1/04758748630-e1.jpg",
    variants: [{ size: "Única", color: "Fucsia", stock: 14 }],
  },
  {
    name: "Bolsa Estampado Rayas",
    slug: "bolsa-estampado-rayas",
    description: "Bolsa de mano con asas cortas, estampado de rayas.",
    basePrice: 39000,
    salePrice: null,
    category: "accesorios",
    image:
      "https://static.zara.net/assets/public/2a3d/985f/132748a39c0b/7d78848ae8c3/05431749600-e1/05431749600-e1.jpg",
    variants: [{ size: "Única", color: "Rojo", stock: 11 }],
  },
  {
    name: "Fallen Angel Lavender Zip Hoodie",
    slug: "fallen-angel-lavender-zip-hoodie",
    description: "Hoodie con cierre, línea Fallen Angel.",
    basePrice: 249000,
    salePrice: null,
    category: "abrigos",
    image: "https://shopuk.jenn.ie/cdn/shop/files/FADED-ZIP-HOODIE-2-LAV.png?v=1787830779",
    variants: [
      { size: "S", color: "Lavanda", stock: 6 },
      { size: "M", color: "Lavanda", stock: 4 },
      { size: "L", color: "Lavanda", stock: 2 },
    ],
  },
  {
    name: "Fallen Angel White Zip Hoodie",
    slug: "fallen-angel-white-zip-hoodie",
    description: "Hoodie con cierre, línea Fallen Angel.",
    basePrice: 249000,
    salePrice: null,
    category: "abrigos",
    image: "https://shopuk.jenn.ie/cdn/shop/files/FADED-ZIP-HOODIE-1-WHT.png?v=1787830779",
    variants: [
      { size: "S", color: "Blanco", stock: 6 },
      { size: "M", color: "Blanco", stock: 4 },
      { size: "L", color: "Blanco", stock: 2 },
    ],
  },
  {
    name: "Fallen Angel Keychain",
    slug: "fallen-angel-keychain",
    description: "Llavero colección Fallen Angel.",
    basePrice: 35000,
    salePrice: null,
    category: "accesorios",
    image: "https://shopuk.jenn.ie/cdn/shop/files/fallen-angel-plastic-cherub-keychain.png?v=1789086330",
    variants: [{ size: "Única", color: "Blanco", stock: 20 }],
  },
  {
    name: "Fallen Angel Ice Cube Squishy",
    slug: "fallen-angel-ice-cube-squishy",
    description: "Squishy pisapapeles colección Fallen Angel.",
    basePrice: 45000,
    salePrice: null,
    category: "accesorios",
    image: "https://shopuk.jenn.ie/cdn/shop/files/jennie-cube-paperweight1-front.png?v=1787830783",
    variants: [{ size: "Única", color: "Transparente", stock: 15 }],
  },
  {
    name: "Fallen Angel Crewneck Sweatshirt",
    slug: "fallen-angel-crewneck-sweatshirt",
    description: "Sweatshirt crewneck, línea Fallen Angel.",
    basePrice: 199000,
    salePrice: null,
    category: "abrigos",
    image: "https://shopuk.jenn.ie/cdn/shop/files/JENNIE-CREWNECK-WHITE-FRONT.png?v=1787830780",
    variants: [
      { size: "S", color: "Blanco", stock: 7 },
      { size: "M", color: "Blanco", stock: 5 },
      { size: "L", color: "Blanco", stock: 3 },
    ],
  },
  {
    name: "Fallen Angel Fabric Poster",
    slug: "fallen-angel-fabric-poster",
    description: "Poster de tela colección Fallen Angel.",
    basePrice: 45000,
    salePrice: null,
    category: "accesorios",
    image: "https://shopuk.jenn.ie/cdn/shop/files/jennie-fabric-poster1-clr-front.png?v=1787830787",
    variants: [{ size: "Única", color: "Multicolor", stock: 10 }],
  },
  {
    name: "Fallen Angel Black Tee",
    slug: "fallen-angel-black-tee",
    description: "Camiseta colección Fallen Angel.",
    basePrice: 69000,
    salePrice: null,
    category: "ropa",
    image: "https://shopuk.jenn.ie/cdn/shop/files/JENNIE-TEE-BLACK-FRONT.png?v=1787830788",
    variants: [
      { size: "S", color: "Negro", stock: 8 },
      { size: "M", color: "Negro", stock: 6 },
      { size: "L", color: "Negro", stock: 4 },
    ],
  },
  {
    name: "Fallen Angel White Tee",
    slug: "fallen-angel-white-tee",
    description: "Camiseta colección Fallen Angel.",
    basePrice: 69000,
    salePrice: null,
    category: "ropa",
    image: "https://shopuk.jenn.ie/cdn/shop/files/JENNIE-TEE-WHITE-FRONT.png?v=1787830788",
    variants: [
      { size: "S", color: "Blanco", stock: 8 },
      { size: "M", color: "Blanco", stock: 6 },
      { size: "L", color: "Blanco", stock: 4 },
    ],
  },
  {
    name: "Fallen Angel House Candle",
    slug: "fallen-angel-house-candle",
    description: "Vela aromática colección Fallen Angel.",
    basePrice: 69000,
    salePrice: null,
    category: "accesorios",
    image: "https://shopuk.jenn.ie/cdn/shop/files/jennie-candle2-white-front.png?v=1787830784",
    variants: [{ size: "Única", color: "Blanco", stock: 12 }],
  },
  {
    name: "Fallen Angel Notebook",
    slug: "fallen-angel-notebook",
    description: "Libreta colección Fallen Angel.",
    basePrice: 69000,
    salePrice: null,
    category: "accesorios",
    image: "https://shopuk.jenn.ie/cdn/shop/files/jennie-notebook3-offwhite-inside3.png?v=1787830785",
    variants: [{ size: "Única", color: "Blanco roto", stock: 12 }],
  },
  {
    name: "Fallen Angel Lighter Case",
    slug: "fallen-angel-lighter-case",
    description: "Funda para encendedor colección Fallen Angel.",
    basePrice: 25000,
    salePrice: null,
    category: "accesorios",
    image: "https://shopuk.jenn.ie/cdn/shop/files/jennie-lighter-case1-clr-back.png?v=1787830786",
    variants: [{ size: "Única", color: "Multicolor", stock: 18 }],
  },
  {
    name: "Ruby Photo Tank Top",
    slug: "ruby-photo-tank-top",
    description: "Top tirantes con collage fotográfico JENNIE.",
    basePrice: 69000,
    salePrice: null,
    category: "ropa",
    image: "https://shopuk.jenn.ie/cdn/shop/files/JENNIEBTSTANK.png?v=1757498289",
    variants: [
      { size: "S", color: "Rojo", stock: 6 },
      { size: "M", color: "Rojo", stock: 4 },
      { size: "L", color: "Rojo", stock: 2 },
    ],
  },
  {
    name: "Ruby Flower T-Shirt",
    slug: "ruby-red-t-shirt",
    description: "Camiseta unisex roja con estampado flor JENNIE.",
    basePrice: 69000,
    salePrice: null,
    category: "ropa",
    image: "https://shopuk.jenn.ie/cdn/shop/files/JENNIE-FLOWER-TEE-FRONT.png",
    variants: [
      { size: "S", color: "Rojo", stock: 6 },
      { size: "M", color: "Rojo", stock: 4 },
      { size: "L", color: "Rojo", stock: 2 },
    ],
  },
  {
    name: "Ruby Photo T-Shirt",
    slug: "ruby-white-t-shirt",
    description: "Camiseta con foto flor Ruby impresa al frente.",
    basePrice: 69000,
    salePrice: null,
    category: "ropa",
    image:
      "https://shopuk.jenn.ie/cdn/shop/files/JENNIERUBY-T-SHIRT-OFFWHITEBIRTH_PREVIEW_fe2abb3d-140e-467a-8304-d8cc84d9eace.png",
    variants: [
      { size: "S", color: "Blanco roto", stock: 6 },
      { size: "M", color: "Blanco roto", stock: 4 },
      { size: "L", color: "Blanco roto", stock: 2 },
    ],
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
