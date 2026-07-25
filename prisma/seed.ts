import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando y sembrando usuarios de la base de datos...");

  // Eliminar datos antiguos para asegurar solo los 3 usuarios requeridos
  await prisma.auditLog.deleteMany({});
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.purchaseItem.deleteMany({});
  await prisma.purchase.deleteMany({});
  await prisma.cashMovement.deleteMany({});
  await prisma.cashShift.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Exactamente 3 Usuarios con sus contraseñas requeridas
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      name: "Administrador General",
      email: "admin@localkioskito.com",
      passwordHash: "admin123",
      role: "ADMIN",
    },
  });

  const encargadoUser = await prisma.user.create({
    data: {
      username: "encargado",
      name: "Carlos Encargado",
      email: "encargado@localkioskito.com",
      passwordHash: "encargado123",
      role: "ENCARGADO",
    },
  });

  const cajeroUser = await prisma.user.create({
    data: {
      username: "cajero",
      name: "Juan Cajero",
      email: "cajero@localkioskito.com",
      passwordHash: "cajero123",
      role: "CAJERO",
    },
  });

  // 2. Categorías y Subcategorías
  const catFiambres = await prisma.category.upsert({
    where: { name: "Fiambres y Embutidos" },
    update: {},
    create: {
      name: "Fiambres y Embutidos",
      description: "Fiambres, salames, jamones y embutidos de calidad",
      subcategories: {
        create: [
          { name: "Jamones Cocidos" },
          { name: "Jamones Crudos" },
          { name: "Salames y Salchichones" },
          { name: "Mortadela y Paleta" },
        ],
      },
    },
    include: { subcategories: true },
  });

  const catQuesos = await prisma.category.upsert({
    where: { name: "Quesos" },
    update: {},
    create: {
      name: "Quesos",
      description: "Quesos duros, semiduros, blandos y untables",
      subcategories: {
        create: [
          { name: "Quesos Semiduros (Tybo, Barra, Gouda)" },
          { name: "Quesos Cremosos y Port Salut" },
          { name: "Quesos Duros (Sardo, Reggianito)" },
        ],
      },
    },
    include: { subcategories: true },
  });

  const catAlmacen = await prisma.category.upsert({
    where: { name: "Almacén y Panificados" },
    update: {},
    create: {
      name: "Almacén y Panificados",
      description: "Productos secos, panadería, conservas",
      subcategories: {
        create: [
          { name: "Panes de Miga y Lactal" },
          { name: "Aderezos y Salsas" },
          { name: "Encurtidos y Aceitunas" },
        ],
      },
    },
    include: { subcategories: true },
  });

  const catBebidas = await prisma.category.upsert({
    where: { name: "Bebidas" },
    update: {},
    create: {
      name: "Bebidas",
      description: "Gaseosas, aguas, jugos y aperitivos",
      subcategories: {
        create: [
          { name: "Gaseosas" },
          { name: "Aguas y Aguas Saborizadas" },
          { name: "Cervezas y Aperitivos" },
        ],
      },
    },
    include: { subcategories: true },
  });

  // 3. Proveedores
  const provPaladini = await prisma.supplier.upsert({
    where: { id: "prov-1" },
    update: {},
    create: {
      id: "prov-1",
      name: "Frigorífico Paladini S.A.",
      taxId: "30-50012345-9",
      phone: "+54 9 341 4567890",
      email: "ventas@paladini.com.ar",
      address: "Av. Ovidio Lagos 4500, Rosario",
    },
  });

  const provLaSerenisima = await prisma.supplier.upsert({
    where: { id: "prov-2" },
    update: {},
    create: {
      id: "prov-2",
      name: "Distribuidora La Serenísima",
      taxId: "30-50888999-1",
      phone: "+54 9 11 43219876",
      email: "pedidos@laserenisima.com.ar",
      address: "Ruta 5 Km 65, Luján",
    },
  });

  // 4. Productos Iniciales (por peso y por unidad)
  const p1 = await prisma.product.upsert({
    where: { code: "F001" },
    update: {},
    create: {
      code: "F001",
      name: "Jamón Cocido Especial Paladini",
      description: "Jamón cocido de primera calidad por kg",
      categoryId: catFiambres.id,
      subcategoryId: catFiambres.subcategories[0]?.id,
      unitType: "KG",
      isWeighted: true,
      costPrice: 7500.0,
      salePrice: 12500.0,
      minStock: 5.0,
      currentStock: 18.5,
      requiresExpiration: true,
    },
  });

  const p2 = await prisma.product.upsert({
    where: { code: "Q001" },
    update: {},
    create: {
      code: "Q001",
      name: "Queso Tybo Barra La Serenísima",
      description: "Queso tybo para feteado por kg",
      categoryId: catQuesos.id,
      subcategoryId: catQuesos.subcategories[0]?.id,
      unitType: "KG",
      isWeighted: true,
      costPrice: 6800.0,
      salePrice: 11200.0,
      minStock: 8.0,
      currentStock: 22.0,
      requiresExpiration: true,
    },
  });

  const p3 = await prisma.product.upsert({
    where: { code: "A001" },
    update: {},
    create: {
      code: "A001",
      name: "Pan de Miga Blanco (Paquete 1kg)",
      description: "Paquete de pan de miga para sándwiches",
      categoryId: catAlmacen.id,
      subcategoryId: catAlmacen.subcategories[0]?.id,
      unitType: "UNIDAD",
      isWeighted: false,
      costPrice: 3200.0,
      salePrice: 4800.0,
      minStock: 10.0,
      currentStock: 15.0,
      requiresExpiration: true,
    },
  });

  const p4 = await prisma.product.upsert({
    where: { code: "B001" },
    update: {},
    create: {
      code: "B001",
      name: "Coca-Cola Original 2.25L",
      description: "Gaseosa Coca Cola 2.25 Litros",
      categoryId: catBebidas.id,
      subcategoryId: catBebidas.subcategories[0]?.id,
      unitType: "UNIDAD",
      isWeighted: false,
      costPrice: 2100.0,
      salePrice: 3100.0,
      minStock: 24.0,
      currentStock: 48.0,
      requiresExpiration: false,
    },
  });

  // 5. Lotes iniciales
  await prisma.batch.create({
    data: {
      productId: p1.id,
      batchNumber: "LOT-PAL-2026-07",
      expirationDate: new Date("2026-08-20"),
      initialQuantity: 20.0,
      currentQuantity: 18.5,
      costPrice: 7500.0,
      supplierId: provPaladini.id,
    },
  });

  console.log("Re-seeding de usuarios exactos completado exitosamente!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
