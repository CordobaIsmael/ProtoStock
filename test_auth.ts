import { prisma } from "./src/lib/prisma";

async function testLogin(un: string, pass: string) {
  console.log(`\nProbando login para usuario: '${un}' y clave: '${pass}'`);

  const cleanUsername = un.trim().toLowerCase();
  const cleanPassword = pass.trim();

  const allUsers = await prisma.user.findMany({ where: { isActive: true } });
  const user = allUsers.find((u) => u.username.trim().toLowerCase() === cleanUsername);

  if (!user) {
    console.error("❌ ERROR: Usuario no encontrado");
    return;
  }

  if (user.passwordHash !== cleanPassword) {
    console.error("❌ ERROR: Contraseña incorrecta");
    return;
  }

  console.log("✅ ¡LOGIN EXITOSO!", {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  });
}

async function main() {
  await testLogin("superadmin", "superadmin123");
  await testLogin("admin", "admin123");
  await testLogin("encargado", "encargado123");
  await testLogin("cajero", "cajero123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
