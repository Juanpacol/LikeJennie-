const bcrypt = require("bcryptjs");
const adminUserRepo = require("../repositories/adminUser.repository");
const jwtUtil = require("../utils/jwt.util");
const { BadRequestError } = require("../utils/errors");

const SALT_ROUNDS = 10;

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function login(email, password) {
  const user = await adminUserRepo.findByEmail(email);
  if (!user) throw new BadRequestError("Credenciales inválidas");

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) throw new BadRequestError("Credenciales inválidas");

  const token = jwtUtil.sign({ sub: user.id, email: user.email });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

module.exports = { hashPassword, login };
