import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { products, activeUserRole } = await request.json();

    if (activeUserRole === "CAJERO") {
      return NextResponse.json(
        { error: "Acceso denegado: Los cajeros no pueden importar productos." },
        { status: 403 }
      );
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron productos válidos para importar." },
        { status: 400 }
      );
    }

    // 1. Obtener o crear categorías necesarias
    const categoryMap: { [key: string]: string } = {};
    const existingCategories = await prisma.category.findMany();
    existingCategories.forEach((c) => {
      categoryMap[c.name.trim().toLowerCase()] = c.id;
    });

    const adminUser = await prisma.user.findFirst();
    let importedCount = 0;
    let updatedCount = 0;

    for (const item of products) {
      if (!item.name) continue;

      const catNameRaw = (item.category || "General").trim();
      const catKey = catNameRaw.toLowerCase();

      // Crear categoría si no existe
      if (!categoryMap[catKey]) {
        const newCat = await prisma.category.create({
          data: { name: catNameRaw },
        });
        categoryMap[catKey] = newCat.id;
      }

      const categoryId = categoryMap[catKey];
      const code = item.code ? String(item.code).trim() : null;
      const isWeighted =
        String(item.unitType).toUpperCase() === "KG" ||
        item.isWeighted === true ||
        String(item.unitType).toUpperCase() === "GRAMO";
      const unitType = isWeighted ? "KG" : "UNIDAD";

      const costPrice = parseFloat(item.costPrice) || 0;
      const salePrice = parseFloat(item.salePrice) || 0;
      const currentStock = parseFloat(item.currentStock) || 0;
      const minStock = parseFloat(item.minStock) || 5;

      // Buscar si el producto ya existe por código o por nombre
      let existingProd = null;
      if (code) {
        existingProd = await prisma.product.findUnique({ where: { code } });
      }
      if (!existingProd) {
        existingProd = await prisma.product.findFirst({
          where: { name: { equals: item.name.trim(), mode: "insensitive" } },
        });
      }

      if (existingProd) {
        // Actualizar
        await prisma.product.update({
          where: { id: existingProd.id },
          data: {
            name: item.name.trim(),
            categoryId,
            costPrice,
            salePrice,
            currentStock,
            minStock,
            unitType,
            isWeighted,
            isActive: true,
          },
        });
        updatedCount++;
      } else {
        // Crear
        await prisma.product.create({
          data: {
            code,
            name: item.name.trim(),
            categoryId,
            costPrice,
            salePrice,
            currentStock,
            minStock,
            unitType,
            isWeighted,
            isActive: true,
          },
        });
        importedCount++;
      }
    }

    // Auditoría
    await prisma.auditLog.create({
      data: {
        userId: adminUser?.id || null,
        action: "IMPORTAR_PRODUCTOS_EXCEL",
        entity: "Product",
        details: `Importación masiva completada: ${importedCount} creados, ${updatedCount} actualizados.`,
      },
    });

    return NextResponse.json({
      success: true,
      importedCount,
      updatedCount,
      totalProcessed: importedCount + updatedCount,
    });
  } catch (error) {
    console.error("Error al importar productos:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el archivo de importación." },
      { status: 500 }
    );
  }
}
