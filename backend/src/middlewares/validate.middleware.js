const { BadRequestError, MESSAGES } = require("../utils/errors");

// Valida req.body con un esquema de zod. Si es válido, lo reemplaza por la versión limpia (solo los
// campos permitidos); si no, responde 400 con el código del primer problema, sin repetir lo que envió el cliente.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // El mensaje de cada regla es un código de MESSAGES; si es uno de zod por defecto, se usa uno genérico.
      const message = result.error.issues[0].message;
      return next(new BadRequestError(message in MESSAGES ? message : "VALIDATION_ERROR"));
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;
