const jwt = require("jsonwebtoken");

const EXPIRES_IN = "1d";

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
}

function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { sign, verify };
