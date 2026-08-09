import { prisma } from "./src/lib/prisma";

async function main() {
  console.log("=== VINCULANDO USUARIO admin_abril A EMPORIO DEL SABOR ===");

  const tenant = await prisma.tenant.findFirst({
    where: { name: { contains: "Emporio", mode: "insensitive" } },
  });

  if (!tenant) {
    console.error("No se encontró el comercio Emporio Del Sabor");
    return;
  }

  console.log("Comercio encontrado:", tenant.id, tenant.name);

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findFirst({
    where: { username: "admin_abril" },
  });

  if (existingUser) {
    console.log("El usuario admin_abril ya existía, actualizando su contraseña y tenantId...");
    const updated = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        tenantId: tenant.id,
        passwordHash: "admin123",
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log("Usuario actualizado:", updated);
  } else {
    console.log("Creando usuario admin_abril para Emporio Del Sabor...");
    const newUser = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: "Admin Abril",
        username: "admin_abril",
        passwordHash: "admin123",
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log("Usuario admin_abril creado exitosamente:", newUser);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
