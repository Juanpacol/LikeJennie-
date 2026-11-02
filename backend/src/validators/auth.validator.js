const { z } = require("zod");

const loginSchema = z.object({
  email: z.string({ error: "El correo es obligatorio" }).trim().min(1, "El correo es obligatorio").max(254),
  password: z.string({ error: "La contraseña es obligatoria" }).min(1, "La contraseña es obligatoria").max(200),
});

module.exports = { loginSchema };
