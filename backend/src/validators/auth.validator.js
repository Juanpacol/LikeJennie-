const { z } = require("zod");

const loginSchema = z.object({
  email: z.string({ error: "EMAIL_REQUIRED" }).trim().min(1, "EMAIL_REQUIRED").max(254),
  password: z.string({ error: "PASSWORD_REQUIRED" }).min(1, "PASSWORD_REQUIRED").max(200),
});

module.exports = { loginSchema };
