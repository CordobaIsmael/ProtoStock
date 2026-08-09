import { prisma } from "./src/lib/prisma";

async function main() {
  console.log("=== CHECKING ALL USERS IN DB ===");
  const users = await prisma.user.findMany({
    include: { tenant: true },
  });
  console.log("Total users in DB:", users.length);
  console.log("Users:", JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
