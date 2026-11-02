// Cambia la contraseña de un admin existente: `npm run admin:set-password -- correo@ejemplo.com`.
// La contraseña se pide por terminal sin mostrarla, así no queda en el historial ni en el repo.
require("dotenv").config();
const readline = require("readline");
const bcrypt = require("bcryptjs");
const prisma = require("../src/config/db");

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 12;

// Pregunta sin repetir en pantalla lo que se escribe.
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(question);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("Uso: npm run admin:set-password -- correo@ejemplo.com");
  if (!process.stdin.isTTY) throw new Error("Ejecútalo en una terminal interactiva: la contraseña no se acepta por tubería.");

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) throw new Error(`No existe un admin con el correo ${email}.`);

  const password = await askHidden("Nueva contraseña: ");
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  if (password !== (await askHidden("Repítela: "))) throw new Error("Las contraseñas no coinciden.");

  await prisma.adminUser.update({
    where: { email },
    data: { passwordHash: await bcrypt.hash(password, SALT_ROUNDS) },
  });
  console.log(`Contraseña actualizada para ${email}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
