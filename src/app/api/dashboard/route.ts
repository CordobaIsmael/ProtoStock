import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 1. Ventas de hoy
    const salesToday = await prisma.sale.findMany({
      where: {
        createdAt: { gte: startOfToday },
        status: "COMPLETADA",
      },
    });

    const totalSalesToday = salesToday.reduce((acc, s) => acc + s.totalAmount, 0);
    const ticketsCountToday = salesToday.length;
    const avgTicket = ticketsCountToday > 0 ? totalSalesToday / ticketsCountToday : 0;

    // 2. Productos con Stock Bajo / Crítico (SOLO PRODUCTOS ACTIVOS)
    const activeProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
    });
    const realLowStock = activeProducts.filter((p) => p.currentStock <= p.minStock);

    // 3. Lotes próximos a vencer (SOLO DE PRODUCTOS ACTIVOS)
    const expiringBatches = await prisma.batch.findMany({
      where: {
        currentQuantity: { gt: 0 },
        expirationDate: {
          not: null,
          lte: thirtyDaysFromNow,
        },
        product: {
          isActive: true, // Filtro estricto: El producto debe estar ACTIVO
        },
      },
      include: {
        product: {
          include: { category: true },
        },
        supplier: true,
      },
      orderBy: { expirationDate: "asc" },
    });

    // 4. Caja activa
    const activeShift = await prisma.cashShift.findFirst({
      where: { status: "ABIERTA" },
      include: {
        sales: true,
        cashMovements: true,
      },
      orderBy: { openingDate: "desc" },
    });

    let cashSalesTotal = 0;
    let cardSalesTotal = 0;
    if (activeShift) {
      const shiftSales = await prisma.sale.findMany({
        where: { cashShiftId: activeShift.id, status: "COMPLETADA" },
      });
      cashSalesTotal = shiftSales
        .filter((s) => s.paymentMethod === "EFECTIVO")
        .reduce((acc, s) => acc + s.totalAmount, 0);
      cardSalesTotal = shiftSales
        .filter((s) => s.paymentMethod !== "EFECTIVO")
        .reduce((acc, s) => acc + s.totalAmount, 0);
    }

    return NextResponse.json({
      metrics: {
        totalSalesToday,
        ticketsCountToday,
        avgTicket,
        lowStockCount: realLowStock.length,
        expiringBatchesCount: expiringBatches.length,
      },
      lowStockProducts: realLowStock,
      expiringBatches,
      activeShift: activeShift
        ? {
            ...activeShift,
            cashSalesTotal,
            cardSalesTotal,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Error al obtener métricas del dashboard" },
      { status: 500 }
    );
  }
}
