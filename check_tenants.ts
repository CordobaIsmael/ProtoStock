import { prisma } from "./src/lib/prisma";

async function main() {
  console.log("=== CHECKING TENANTS IN DB ===");
  const tenants = await prisma.tenant.findMany({
    include: { users: true },
  });
  console.log("Total tenants in DB:", tenants.length);
  console.log("Tenants:", JSON.stringify(tenants, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
