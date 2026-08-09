import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30days"; // "today", "week", "month", "30days"
    const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id") || "";

    const now = new Date();
    let startDate = new Date();

    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      const day = now.getDay() || 7;
      startDate.setDate(now.getDate() - day + 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // 30 días
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    }

    const tenantFilter = tenantId ? { tenantId } : {};

    // 1. Obtener Ventas en el rango de fechas
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: { gte: startDate },
        status: "COMPLETADA",
        ...tenantFilter,
      },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Calcular Totales de Ventas & Ticket Promedio
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const ticketsCount = sales.length;
    const avgTicket = ticketsCount > 0 ? totalRevenue / ticketsCount : 0;

    // 3. Desglose preciso por Método de Pago
    const cash = sales
      .filter((s) => s.paymentMethod === "EFECTIVO")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const cardDebito = sales
      .filter((s) => s.paymentMethod === "TARJETA_DEBITO")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const cardCredito = sales
      .filter((s) => s.paymentMethod === "TARJETA_CREDITO")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const cardGeneric = sales
      .filter((s) => s.paymentMethod === "TARJETA")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const transfer = sales
      .filter((s) => s.paymentMethod === "TRANSFERENCIA" || s.paymentMethod === "MERCADOPAGO")
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const paymentBreakdown = {
      cash,
      cardDebito,
      cardCredito,
      card: cardDebito + cardCredito + cardGeneric,
      transfer,
    };

    // 4. Ganancia Bruta Estimada & Ranking de Productos
    const productStatsMap: {
      [key: string]: {
        name: string;
        category: string;
        quantity: number;
        revenue: number;
        profit: number;
        isWeighted: boolean;
      };
    } = {};
    let totalCost = 0;

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const prodName = item.product?.name || "Producto sin nombre";
        const catName = item.product?.category?.name || "General";
        const isWeighted = item.product?.isWeighted || false;
        const cost = (item.product?.costPrice || 0) * item.quantity;
        const revenue = item.subtotal;
        const profit = revenue - cost;

        totalCost += cost;

        if (!productStatsMap[item.productId]) {
          productStatsMap[item.productId] = {
            name: prodName,
            category: catName,
            quantity: 0,
            revenue: 0,
            profit: 0,
            isWeighted,
          };
        }

        productStatsMap[item.productId].quantity += item.quantity;
        productStatsMap[item.productId].revenue += revenue;
        productStatsMap[item.productId].profit += profit;
      });
    });

    const grossProfit = totalRevenue - totalCost;
    const profitMarginPercentage = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const topProducts = Object.values(productStatsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // 5. Mermas y Pérdidas por Vencimiento
    const shrinkageMovements = await prisma.stockMovement.findMany({
      where: {
        createdAt: { gte: startDate },
        movementType: "MERMA",
        ...(tenantId ? { product: { tenantId } } : {}),
      },
      include: {
        product: true,
      },
    });

    const totalShrinkageLoss = shrinkageMovements.reduce((acc, m) => {
      const cost = m.product?.costPrice || 0;
      return acc + Math.abs(m.quantity) * cost;
    }, 0);

    return NextResponse.json({
      period,
      summary: {
        totalRevenue,
        ticketsCount,
        avgTicket,
        totalCost,
        grossProfit,
        profitMarginPercentage,
        totalShrinkageLoss,
      },
      paymentBreakdown,
      topProducts,
      recentSalesCount: sales.length,
      shrinkageCount: shrinkageMovements.length,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Error al calcular reportes y métricas" },
      { status: 500 }
    );
  }
}
