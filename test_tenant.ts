import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.xndfxvivhbhwwnlkzkdv:EmporioDelSabor@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true",
    },
  },
});

async function run() {
  console.log("Probando consulta de Tenant en Supabase...");
  const tenants = await prisma.tenant.findMany();
  console.log("TENANTS EN SUPABASE:", tenants);

  const newTenant = await prisma.tenant.create({
    data: {
      name: "Test Comercio",
      slug: "test-comercio",
      monthlyFee: 25000,
    },
  });
  console.log("TENANT CREADO:", newTenant);
}

run()
  .catch((e) => console.error("ERROR TENANT:", e.message))
  .finally(() => prisma.$disconnect());
