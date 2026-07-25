import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { actualAmount, notes } = await request.json();

    const activeShift = await prisma.cashShift.findFirst({
      where: { status: "ABIERTA" },
    });

    if (!activeShift) {
      return NextResponse.json(
        { error: "No hay una caja abierta para cerrar" },
        { status: 400 }
      );
    }

    const difference = actualAmount - activeShift.expectedAmount;

    const closedShift = await prisma.cashShift.update({
      where: { id: activeShift.id },
      data: {
        actualAmount,
        difference,
        closingDate: new Date(),
        status: "CERRADA",
        notes,
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
