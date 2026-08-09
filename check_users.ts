import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany();
  console.log("=== USUARIOS EN LA BASE DE DATOS ===");
  console.log(users);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
