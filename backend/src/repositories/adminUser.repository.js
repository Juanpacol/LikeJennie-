const prisma = require("../config/db");

function findByEmail(email) {
  return prisma.adminUser.findUnique({ where: { email } });
}

module.exports = { findByEmail };
