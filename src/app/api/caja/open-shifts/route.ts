import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const openShifts = await prisma.cashShift.findMany({
      where: { status: "ABIERTA" },
      include: {
        user: {
          select: { id: true, name: true, username: true, role: true },
        },
        cashMovements: {
          orderBy: { createdAt: "desc" },
        },
        sales: {
          where: { status: "COMPLETADA" },
          select: {
            id: true,
            saleNumber: true,
            totalAmount: true,
            paymentMethod: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { openingDate: "desc" },
    });

    return NextResponse.json(openShifts);
  } catch (error) {
    console.error("Error al obtener cajas abiertas:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de cajas abiertas." },
      { status: 500 }
    );
  }
}
