const { BadRequestError } = require("../utils/errors");

// Valida req.body con un esquema de zod. Si es válido, lo reemplaza por la versión limpia (solo los
// campos permitidos); si no, responde 400 con el primer problema, sin repetir lo que envió el cliente.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new BadRequestError(result.error.issues[0].message));
    }
    req.body = result.data;
    next();
  };
}

module.exports = validate;
