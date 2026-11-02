const jwt = require("jsonwebtoken");

const EXPIRES_IN = "1d";
// Se fija el algoritmo al firmar y al verificar: así un token firmado con otro (o sin firma) se rechaza.
const ALGORITHM = "HS256";

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: ALGORITHM, expiresIn: EXPIRES_IN });
}

function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: [ALGORITHM] });
}

module.exports = { sign, verify };
