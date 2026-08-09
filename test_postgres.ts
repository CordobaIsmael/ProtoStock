import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  console.log("Probando conexión a la nueva base de datos Supabase ProtoStock...");
  const users = await prisma.user.findMany();
  console.log("USUARIOS REGISTRADOS EN NUEVA BD:", users);
}

run()
  .catch((e) => console.error("ERROR SUPABASE:", e.message))
  .finally(() => prisma.$disconnect());
