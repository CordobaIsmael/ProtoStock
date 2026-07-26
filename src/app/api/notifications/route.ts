import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get("role") || "CAJERO";

    const notifications: Array<{
      id: string;
      type: "STOCK" | "EXPIRATION" | "SHIFT" | "WITHDRAWAL" | "MILESTONE";
      title: string;
      message: string;
      timestamp: string;
      severity: "danger" | "warning" | "info" | "success" | "purple";
      link: string;
      roles: string[];
    }> = [];

    const now = new Date();

    // 1. Alertas de Stock Mínimo (Para ADMIN, ENCARGADO, CAJERO)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        currentStock: { lte: prisma.product.fields.minStock },
      },
      take: 5,
    });

    lowStockProducts.forEach((p) => {
      notifications.push({
        id: `stock-${p.id}`,
        type: "STOCK",
        title: "Stock Bajo Alerta",
        message: `${p.name} le quedan ${p.currentStock.toFixed(p.isWeighted ? 2 : 0)} ${p.unitType}.`,
        timestamp: "Ahora",
        severity: "danger",
        link: "/productos",
        roles: ["ADMIN", "ENCARGADO", "CAJERO"],
      });
    });

    // 2. Alertas de Lotes Próximos a Vencer (<30 días) (Para ADMIN, ENCARGADO, CAJERO)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringBatches = await prisma.batch.findMany({
      where: {
        currentQuantity: { gt: 0 },
        expirationDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
      },
      include: { product: true },
      take: 5,
    });

    expiringBatches.forEach((batch) => {
      const expDate = new Date(batch.expirationDate!).toLocaleDateString("es-AR");
      notifications.push({
        id: `exp-${batch.id}`,
        type: "EXPIRATION",
        title: "Lote Próximo a Vencer",
        message: `Lote de ${batch.product.name} vence el ${expDate} (quedan ${batch.currentQuantity} ${batch.product.unitType}).`,
        timestamp: "Próximo a vencer",
        severity: "warning",
        link: "/compras",
        roles: ["ADMIN", "ENCARGADO", "CAJERO"],
      });
    });

    // 3. Recordatorio de Cierre de Turno (Para ADMIN, ENCARGADO, CAJERO)
    const activeShift = await prisma.cashShift.findFirst({
      where: { status: "ABIERTA" },
      orderBy: { openingDate: "desc" },
    });

    if (activeShift) {
      const hoursOpen = (now.getTime() - new Date(activeShift.openingDate).getTime()) / (1000 * 60 * 60);
      if (hoursOpen >= 8) {
        notifications.push({
          id: `shift-${activeShift.id}`,
          type: "SHIFT",
          title: "Recordatorio de Arqueo",
          message: `La caja lleva abierta más de ${Math.floor(hoursOpen)} horas. Se sugiere realizar el cierre de turno.`,
          timestamp: "Turno en curso",
          severity: "info",
          link: "/caja",
          roles: ["ADMIN", "ENCARGADO", "CAJERO"],
        });
      }
    }

    // 4. Retiros / Egreso de Caja (SOLO PARA ADMINISTRADOR)
    if (userRole === "ADMIN") {
      const recentWithdrawals = await prisma.cashMovement.findMany({
        where: { type: "EGRESO" },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      recentWithdrawals.forEach((w) => {
        notifications.push({
          id: `withdraw-${w.id}`,
          type: "WITHDRAWAL",
          title: "Retiro / Egreso de Caja",
          message: `Egreso de $${w.amount.toLocaleString("es-AR")} por ${w.concept} (${w.user?.name || "Usuario"}).`,
          timestamp: new Date(w.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
          severity: "purple",
          link: "/caja",
          roles: ["ADMIN"],
        });
      });

      // 5. Hito de Facturación / Récord de Ventas (SOLO PARA ADMINISTRADOR)
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todaysSales = await prisma.sale.aggregate({
        where: {
          createdAt: { gte: startOfDay },
          status: "COMPLETADA",
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      });

      const todayTotal = todaysSales._sum.totalAmount || 0;
      if (todayTotal >= 10000) {
        notifications.push({
          id: `milestone-today`,
          type: "MILESTONE",
          title: "Hito de Facturación Diaria",
          message: `¡Ventas activas! Hoy se alcanzaron $${todayTotal.toLocaleString("es-AR")} (${todaysSales._count.id} ventas).`,
          timestamp: "Hoy",
          severity: "success",
          link: "/reportes",
          roles: ["ADMIN"],
        });
      }
    }

    // Filtrar notificaciones que correspondan al rol del usuario
    const filtered = notifications.filter((n) => n.roles.includes(userRole));

    return NextResponse.json({
      notifications: filtered,
      unreadCount: filtered.length,
    });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener notificaciones" },
      { status: 500 }
    );
  }
}
