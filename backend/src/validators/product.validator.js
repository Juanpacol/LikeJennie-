const { z } = require("zod");

// Lista blanca de campos: lo que no está aquí se rechaza (`strict`), así un admin no puede escribir
// campos internos como id o createdAt por la API.
const price = z.number({ error: "PRICE_INVALID" }).min(0, "PRICE_INVALID").max(99999999, "PRICE_INVALID");

const productFields = {
  name: z.string().trim().min(1, "NAME_REQUIRED").max(200),
  slug: z.string().trim().min(1, "SLUG_REQUIRED").max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "SLUG_INVALID"),
  description: z.string().min(1, "DESCRIPTION_REQUIRED").max(5000),
  basePrice: price,
  salePrice: price.nullable(),
  isActive: z.boolean(),
  categoryId: z.string().min(1).max(64),
};

const imageSchema = z.object({ url: z.url("IMAGE_URL_INVALID").max(2000), position: z.number().int().min(0).max(100) }).strict();

const variantSchema = z
  .object({
    size: z.string().trim().min(1).max(30),
    color: z.string().trim().min(1).max(50),
    stock: z.number().int().min(0).max(100000),
    sku: z.string().trim().min(1).max(200),
  })
  .strict();

const createProductSchema = z
  .object({
    ...productFields,
    salePrice: productFields.salePrice.optional(),
    isActive: productFields.isActive.optional(),
    images: z.array(imageSchema).max(20).optional(),
    variants: z.array(variantSchema).max(100).optional(),
  })
  .strict();

const updateProductSchema = z.object(productFields).partial().strict();

module.exports = { createProductSchema, updateProductSchema };
