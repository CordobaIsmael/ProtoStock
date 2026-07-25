import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity, reason, activeUserRole } = body;

    if (activeUserRole === "CAJERO") {
      return NextResponse.json(
        { error: "Acceso denegado: Los cajeros no pueden dar de baja stock por merma." },
        { status: 403 }
      );
    }

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Producto y cantidad válida son requeridos" },
        { status: 400 }
      );
    }

    const prod = await prisma.product.findUnique({ where: { id: productId } });
    if (!prod) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const activeUser = await prisma.user.findFirst();
    const previousStock = prod.currentStock;
    const newStock = Math.max(0, previousStock - quantity);

    // Transacción de Merma / Devolución
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar stock del producto
      await tx.product.update({
        where: { id: prod.id },
        data: { currentStock: newStock },
      });

      // 2. Registrar Movimiento de Stock
      await tx.stockMovement.create({
        data: {
          productId: prod.id,
          movementType: "MERMA",
          quantity: -quantity,
          previousStock,
          newStock,
          reason: reason || "Baja por Vencimiento / Pérdida",
          userId: activeUser?.id || null,
        },
      });

      // 3. Auditoría
      await tx.auditLog.create({
        data: {
          userId: activeUser?.id || null,
          action: "BAJA_STOCK_MERMA",
          entity: "Product",
          entityId: prod.id,
          details: `Baja de stock por merma/vencimiento: -${quantity} ${prod.unitType} de ${prod.name}. Motivo: ${reason}`,
        },
      });
    });

    return NextResponse.json({ success: true, newStock });
  } catch (error) {
    console.error("Error al dar de baja stock:", error);
    return NextResponse.json(
      { error: "Error al procesar la baja de stock" },
      { status: 500 }
    );
  }
}
