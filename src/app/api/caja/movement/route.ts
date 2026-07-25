import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { type, amount, concept } = await request.json();

    const activeShift = await prisma.cashShift.findFirst({
      where: { status: "ABIERTA" },
    });

    if (!activeShift) {
      return NextResponse.json(
        { error: "No hay una caja abierta para registrar movimientos" },
        { status: 400 }
      );
    }

    const activeUser = await prisma.user.findFirst();
    if (!activeUser) {
      return NextResponse.json(
        { error: "No hay usuario disponible" },
        { status: 400 }
      );
    }

    const netAmount = type === "EGRESO" ? -amount : amount;

    const movement = await prisma.$transaction(async (tx) => {
      const mov = await tx.cashMovement.create({
        data: {
          cashShiftId: activeShift.id,
          type,
          amount,
          concept,
          userId: activeUser.id,
        },
      });

      await tx.cashShift.update({
        where: { id: activeShift.id },
        data: {
          expectedAmount: activeShift.expectedAmount + netAmount,
        },
      });

      return mov;
    });

    return NextResponse.json(movement);
  } catch (error) {
    console.error("Error adding cash movement:", error);
    return NextResponse.json(
      { error: "Error al registrar movimiento" },
      { status: 500 }
    );
  }
}
