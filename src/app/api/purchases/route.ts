import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id") || "";

    const purchases = await prisma.purchase.findMany({
      where: tenantId ? { tenantId } : {},
      include: {
        supplier: true,
        user: true,
        items: {
          include: {
            product: true,
            batch: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Error al obtener compras" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supplierId, invoiceNumber, notes, items, activeUserId } = body;

    if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un proveedor y al menos un producto en la compra" },
        { status: 400 }
      );
    }

    let activeUser = null;
    if (activeUserId) {
      activeUser = await prisma.user.findUnique({ where: { id: activeUserId } });
    } else {
      activeUser = await prisma.user.findFirst();
    }

    if (!activeUser) {
      return NextResponse.json(
        { error: "No hay un usuario activo para registrar la compra" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.quantity * item.unitCost;
    }

    // Transacción de compra
    const purchase = await prisma.$transaction(async (tx) => {
      // 1. Crear registro de Compra
      const newPurchase = await tx.purchase.create({
        data: {
          tenantId: activeUser.tenantId || null,
          supplierId,
          invoiceNumber: invoiceNumber || null,
          totalAmount,
          status: "COMPLETADA",
          notes: notes || null,
          userId: activeUser.id,
        },
      });

      // 2. Procesar cada item
      for (const item of items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (prod) {
          let createdBatchId = null;

          // Si tiene número de lote o fecha de vencimiento, crear Lote
          if (item.batchNumber || item.expirationDate) {
            const batch = await tx.batch.create({
              data: {
                productId: prod.id,
                batchNumber: item.batchNumber || `LOTE-${Date.now().toString().slice(-6)}`,
                expirationDate: item.expirationDate ? new Date(item.expirationDate) : null,
                initialQuantity: item.quantity,
                currentQuantity: item.quantity,
                costPrice: item.unitCost,
                supplierId,
              },
            });
            createdBatchId = batch.id;
          }

          // Crear PurchaseItem
          await tx.purchaseItem.create({
            data: {
              purchaseId: newPurchase.id,
              productId: prod.id,
              batchId: createdBatchId,
              quantity: item.quantity,
              unitCost: item.unitCost,
              subtotal: item.quantity * item.unitCost,
            },
          });

          // Aumentar stock actual del producto e actualizar precio de costo si se especificó
          const previousStock = prod.currentStock;
          const newStock = previousStock + item.quantity;

          await tx.product.update({
            where: { id: prod.id },
            data: {
              currentStock: newStock,
              costPrice: item.unitCost > 0 ? item.unitCost : prod.costPrice,
            },
          });

          // Registrar Movimiento de Stock
          await tx.stockMovement.create({
            data: {
              productId: prod.id,
              batchId: createdBatchId,
              movementType: "COMPRA",
              quantity: item.quantity,
              previousStock,
              newStock,
              reason: `Ingreso por Compra Factura #${invoiceNumber || newPurchase.id.slice(0, 6)}`,
              userId: activeUser.id,
            },
          });
        }
      }

      return newPurchase;
    });

    return NextResponse.json({ success: true, purchase });
  } catch (error) {
    console.error("Error al registrar la compra:", error);
    return NextResponse.json(
      { error: "Error al procesar el ingreso de la compra" },
      { status: 500 }
    );
  }
}
