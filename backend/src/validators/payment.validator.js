const { z } = require("zod");

const MAX_ITEMS = 50;
const MAX_QUANTITY = 20;

const checkoutSchema = z.object({
  customerName: z.string({ error: "CUSTOMER_NAME_REQUIRED" }).trim().min(1, "CUSTOMER_NAME_REQUIRED").max(100, "CUSTOMER_NAME_TOO_LONG"),
  customerEmail: z.email("EMAIL_INVALID").max(254, "EMAIL_TOO_LONG"),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1).max(64),
        quantity: z
          .number({ error: "QUANTITY_INVALID" })
          .int("QUANTITY_INVALID")
          .min(1, "QUANTITY_INVALID")
          .max(MAX_QUANTITY, "QUANTITY_TOO_HIGH"),
      }),
      { error: "CART_INVALID" },
    )
    .min(1, "CART_EMPTY")
    .max(MAX_ITEMS, "CART_TOO_LARGE")
    .refine((items) => new Set(items.map((item) => item.variantId)).size === items.length, "CART_DUPLICATES"),
});

module.exports = { checkoutSchema };
