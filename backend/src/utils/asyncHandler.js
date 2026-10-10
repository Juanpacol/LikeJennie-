// Evita repetir try/catch en cada controller: envuelve el handler async
// y reenvía cualquier error al error.middleware vía next().
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
