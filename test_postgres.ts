import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.xndfxvivhbhwwnlkzkdv:EmporioDelSabor@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

async function run() {
  console.log("Probando conexión a Supabase Pooler (6543)...");
  const users = await prisma.user.findMany();
  console.log("RESULTADO USUARIOS EN SUPABASE:", users);
}

run()
  .catch((e) => console.error("ERROR EN SUPABASE:", e.message))
  .finally(() => prisma.$disconnect());
