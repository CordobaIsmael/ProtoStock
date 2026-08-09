import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cleanMojibake(str: string): string {
  if (!str) return str;
  let s = str.trim();

  // Intento de reparación de codificación UTF-8 / Latin1
  try {
    const bytes = Buffer.from(s, "latin1");
    const utf8Decoded = bytes.toString("utf8");
    if (!utf8Decoded.includes("") && utf8Decoded !== s) {
      s = utf8Decoded;
    }
  } catch (e) {
    // Ignorar si falla la conversión de Buffer
  }

  // Mapeo explícito de corrección de acentos y caracteres distorsionados (mojibake)
  return s
    .replace(/AlmacÃ©n|AlmacÃ£\u00a9n|AlmacÃ\u00a9n/gi, "Almacén")
    .replace(/FiambrerÃa|FiambrerÃ\u00ada/gi, "Fiambrería")
    .replace(/LÃ¡cteos|LÃ\u00a1cteos/gi, "Lácteos")
    .replace(/PanaderÃa|PanaderÃ\u00ada/gi, "Panadería")
    .replace(/Ã©/g, "é")
    .replace(/Ã¡/g, "á")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã‰/g, "É")
    .replace(/Ã/g, "Á")
    .replace(/Ã/g, "Í")
    .replace(/Ã/g, "Ó")
    .replace(/ÃÚ/g, "Ú")
    .replace(/Ã'/g, "Ñ");
}

export async function POST(request: Request) {
  try {
    const { products, activeUserRole, tenantId } = await request.json();

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

    // 1. Limpiar categorías corruptas en la base de datos previa
    const allCategories = await prisma.category.findMany({
      where: tenantId ? { OR: [{ tenantId }, { tenantId: null }] } : {},
    });
    for (const cat of allCategories) {
      const cleaned = cleanMojibake(cat.name);
      if (cleaned !== cat.name) {
        await prisma.category.update({
          where: { id: cat.id },
          data: { name: cleaned },
        });
      }
    }

    // 2. Obtener mapa actualizado de categorías
    const categoryMap: { [key: string]: string } = {};
    const existingCategories = await prisma.category.findMany({
      where: tenantId ? { OR: [{ tenantId }, { tenantId: null }] } : {},
    });
    existingCategories.forEach((c) => {
      categoryMap[c.name.trim().toLowerCase()] = c.id;
    });

    const adminUser = await prisma.user.findFirst();
    let importedCount = 0;
    let updatedCount = 0;

    for (const item of products) {
      if (!item.name) continue;

      const cleanedProductName = cleanMojibake(item.name);
      const catNameRaw = cleanMojibake(item.category || "General");
      const catKey = catNameRaw.toLowerCase();

      // Crear categoría limpia si no existe
      if (!categoryMap[catKey]) {
        const newCat = await prisma.category.create({
          data: {
            name: catNameRaw,
            tenantId: tenantId || null,
          },
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

      // Buscar si el producto ya existe por código o por nombre dentro del comercio
      let existingProd = null;
      if (code) {
        existingProd = await prisma.product.findFirst({
          where: {
            code,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      }
      if (!existingProd) {
        existingProd = await prisma.product.findFirst({
          where: {
            name: cleanedProductName,
            ...(tenantId ? { tenantId } : {}),
          },
        });
      }

      if (existingProd) {
        // Actualizar
        await prisma.product.update({
          where: { id: existingProd.id },
          data: {
            name: cleanedProductName,
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
            tenantId: tenantId || null,
            code,
            name: cleanedProductName,
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
