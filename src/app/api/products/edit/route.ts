import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      code,
      name,
      categoryId,
      subcategoryId,
      unitType,
      isWeighted,
      costPrice,
      salePrice,
      minStock,
      currentStock,
      isActive,
      activeUserRole,
    } = body;

    if (activeUserRole === "CAJERO") {
      return NextResponse.json(
        { error: "Acceso denegado: Los cajeros no pueden editar productos." },
        { status: 403 }
      );
    }

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
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
        isActive: isActive !== undefined ? isActive : existingProduct.isActive,
      },
    });

    // Auditoría de cambios
    const adminUser = await prisma.user.findFirst();
    const priceChanged = existingProduct.salePrice !== salePrice;
    const actionName = priceChanged ? "MODIFICAR_PRECIO" : "EDITAR_PRODUCTO";

    await prisma.auditLog.create({
      data: {
        userId: adminUser?.id || null,
        action: actionName,
        entity: "Product",
        entityId: updatedProduct.id,
        details: `Producto @${updatedProduct.name} modificado. Precio anterior: $${existingProduct.salePrice} -> Nuevo: $${salePrice}. Estado: ${updatedProduct.isActive ? "Activo" : "Inactivo"}`,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error editing product:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const role = searchParams.get("role");

    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado: Solo el Administrador puede eliminar productos." },
        { status: 403 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID de producto requerido" },
        { status: 400 }
      );
    }

    // Baja lógica (desactivar) para preservar historial de ventas
    const deletedProd = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    await prisma.auditLog.create({
      data: {
        userId: adminUser?.id || null,
        action: "ELIMINAR_PRODUCTO",
        entity: "Product",
        entityId: id,
        details: `Producto marcado como inactivo/eliminado: ${deletedProd.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error al dar de baja el producto" },
      { status: 500 }
    );
  }
}
