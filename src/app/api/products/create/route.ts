import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      name,
      categoryId,
      subcategoryId,
      unitType = "KG",
      isWeighted = true,
      costPrice = 0,
      salePrice = 0,
      minStock = 0,
      currentStock = 0,
      activeUserRole = "CAJERO",
    } = body;

    // Protección RBAC: Los cajeros NO pueden crear productos ni alterar stock manualmente
    if (activeUserRole === "CAJERO") {
      return NextResponse.json(
        { error: "Acceso denegado: El rol de Cajero no tiene permisos para crear o modificar stock de productos." },
        { status: 403 }
      );
    }

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Nombre y Categoría son campos obligatorios" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        code: code || null,
        name,
        categoryId,
        subcategoryId: subcategoryId || null,
        unitType,
        isWeighted,
        costPrice,
        salePrice,
        minStock,
        currentStock,
        isActive: true,
      },
    });

    // Registrar en auditoría
    const adminUser = await prisma.user.findFirst();
    await prisma.auditLog.create({
      data: {
        userId: adminUser?.id || null,
        action: "CREAR_PRODUCTO",
        entity: "Product",
        entityId: product.id,
        details: `Producto creado: ${product.name} (Stock: ${currentStock}, Precio: $${salePrice})`,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error al guardar el producto en la base de datos" },
      { status: 500 }
    );
  }
}
