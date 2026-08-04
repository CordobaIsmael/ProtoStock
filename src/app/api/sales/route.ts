import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      paymentMethod,
      discount = 0,
      customerName = "Consumidor Final",
      activeUserId,
      activeUsername,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "La venta debe contener al menos un producto" },
        { status: 400 }
      );
    }

    // Obtener usuario activo
    let activeUser = null;
    if (activeUserId) {
      activeUser = await prisma.user.findUnique({ where: { id: activeUserId } });
    } else if (activeUsername) {
      activeUser = await prisma.user.findUnique({ where: { username: activeUsername } });
    } else {
      activeUser = await prisma.user.findFirst();
    }

    if (!activeUser) {
      return NextResponse.json(
        { error: "No se encontró el usuario que registra la venta." },
        { status: 400 }
      );
    }

    // Buscar la caja abierta Específica de ESTE usuario
    let activeShift = await prisma.cashShift.findFirst({
      where: {
        userId: activeUser.id,
        status: "ABIERTA",
      },
      orderBy: { openingDate: "desc" },
    });

    // Fallback: si no tiene caja propia abierta pero hay alguna caja abierta, vincularla
    if (!activeShift) {
      activeShift = await prisma.cashShift.findFirst({
        where: { status: "ABIERTA" },
        orderBy: { openingDate: "desc" },
      });
    }

    // Calcular totales
    let subtotal = 0;
    const itemsToCreate: {
      productId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      unitType: string;
    }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ID ${item.productId}` },
          { status: 404 }
        );
      }

      const itemSubtotal = product.salePrice * item.quantity;
      subtotal += itemSubtotal;

      itemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.salePrice,
        subtotal: itemSubtotal,
        unitType: product.unitType,
      });
    }

    const totalAmount = Math.max(0, subtotal - discount);

    // Obtener siguiente número de ticket/venta
    const lastSale = await prisma.sale.findFirst({
      orderBy: { saleNumber: "desc" },
    });
    const nextSaleNumber = (lastSale?.saleNumber || 0) + 1;

    // Transacción de venta
    const newSale = await prisma.$transaction(async (tx) => {
      // 1. Crear registro de Venta
      const sale = await tx.sale.create({
        data: {
          saleNumber: nextSaleNumber,
          userId: activeUser.id,
          cashShiftId: activeShift?.id || null,
          customerName,
          totalAmount,
          discount,
          paymentMethod,
          status: "COMPLETADA",
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // 2. Descontar Stock y Registrar Movimiento
      for (const item of items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (prod) {
          const previousStock = prod.currentStock;
          const newStock = Math.max(0, previousStock - item.quantity);

          await tx.product.update({
            where: { id: prod.id },
            data: { currentStock: newStock },
          });

          await tx.stockMovement.create({
            data: {
              productId: prod.id,
              movementType: "VENTA",
              quantity: -item.quantity,
              previousStock,
              newStock,
              reason: `Venta Ticket #${nextSaleNumber}`,
              userId: activeUser.id,
            },
          });
        }
      }

      // 3. Si la caja del usuario está abierta y se paga en efectivo, sumar al esperado de SU caja
      if (activeShift) {
        await tx.cashShift.update({
          where: { id: activeShift.id },
          data: {
            expectedAmount: activeShift.expectedAmount + (paymentMethod === "EFECTIVO" ? totalAmount : 0),
          },
        });

        await tx.cashMovement.create({
          data: {
            cashShiftId: activeShift.id,
            type: "VENTA",
            amount: totalAmount,
            concept: `Venta Ticket #${nextSaleNumber} (${paymentMethod})`,
            userId: activeUser.id,
          },
        });
      }

      return sale;
    });

    return NextResponse.json({ success: true, sale: newSale });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la venta" },
      { status: 500 }
    );
  }
}
