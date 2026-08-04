import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { shiftId, actualAmount, notes, activeUserRole, userId } = await request.json();

    let activeShift = null;

    if (shiftId) {
      activeShift = await prisma.cashShift.findUnique({ where: { id: shiftId } });
    } else if (userId) {
      activeShift = await prisma.cashShift.findFirst({
        where: { userId, status: "ABIERTA" },
      });
    } else {
      activeShift = await prisma.cashShift.findFirst({
        where: { status: "ABIERTA" },
        orderBy: { openingDate: "desc" },
      });
    }

    if (!activeShift) {
      return NextResponse.json(
        { error: "No se encontró el turno de caja abierto a cerrar" },
        { status: 400 }
      );
    }

    const counted = parseFloat(actualAmount) || 0;
    const difference = counted - activeShift.expectedAmount;

    const closedShift = await prisma.cashShift.update({
      where: { id: activeShift.id },
      data: {
        actualAmount: counted,
        difference,
        closingDate: new Date(),
        status: "CERRADA",
        notes: notes || (activeUserRole === "ADMIN" ? "Cierre forzoso por Administrador" : null),
      },
    });

    return NextResponse.json(closedShift);
  } catch (error) {
    console.error("Error closing shift:", error);
    return NextResponse.json(
      { error: "Error al cerrar la caja" },
      { status: 500 }
    );
  }
}
