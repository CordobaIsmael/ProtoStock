import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { type, amount, concept, userId, shiftId } = await request.json();

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

    if (!activeShift || activeShift.status !== "ABIERTA") {
      return NextResponse.json(
        { error: "No hay una caja abierta para registrar movimientos" },
        { status: 400 }
      );
    }

    let activeUser = null;
    if (userId) {
      activeUser = await prisma.user.findUnique({ where: { id: userId } });
    } else {
      activeUser = await prisma.user.findFirst();
    }

    const numericAmount = parseFloat(amount) || 0;
    const netAmount = type === "EGRESO" ? -numericAmount : numericAmount;

    const movement = await prisma.$transaction(async (tx) => {
      const mov = await tx.cashMovement.create({
        data: {
          cashShiftId: activeShift.id,
          type,
          amount: numericAmount,
          concept,
          userId: activeUser?.id || activeShift.userId,
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
