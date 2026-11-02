const { z } = require("zod");

const MAX_ITEMS = 50;
const MAX_QUANTITY = 20;

const checkoutSchema = z.object({
  customerName: z.string({ error: "El nombre es obligatorio" }).trim().min(1, "El nombre es obligatorio").max(100, "El nombre es demasiado largo"),
  customerEmail: z.email("El correo no es válido").max(254, "El correo es demasiado largo"),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1).max(64),
        quantity: z
          .number({ error: "La cantidad no es válida" })
          .int("La cantidad no es válida")
          .min(1, "La cantidad no es válida")
          .max(MAX_QUANTITY, `Máximo ${MAX_QUANTITY} unidades por prenda`),
      }),
      { error: "El carrito no es válido" },
    )
    .min(1, "El carrito está vacío")
    .max(MAX_ITEMS, "El carrito es demasiado grande")
    .refine((items) => new Set(items.map((item) => item.variantId)).size === items.length, "El carrito tiene prendas repetidas"),
});

module.exports = { checkoutSchema };
