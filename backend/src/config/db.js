const { PrismaClient } = require("@prisma/client");

// Instancia única de Prisma Client para toda la app.
// Solo los repositories importan este módulo — ninguna otra capa habla con Prisma directo.
const prisma = new PrismaClient();

module.exports = prisma;
