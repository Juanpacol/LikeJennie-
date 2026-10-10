// Formato de respuesta JSON estándar para toda la API.
function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

module.exports = { ok };
