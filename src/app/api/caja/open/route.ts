import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { initialAmount = 0 } = await request.json();

    const existingShift = await prisma.cashShift.findFirst({
      where: { status: "ABIERTA" },
    });

    if (existingShift) {
      return NextResponse.json(
        { error: "Ya existe un turno de caja abierto" },
        { status: 400 }
      );
    }

    const activeUser = await prisma.user.findFirst();
    if (!activeUser) {
      return NextResponse.json(
        { error: "No hay un usuario disponible" },
        { status: 400 }
      );
    }

    const newShift = await prisma.cashShift.create({
      data: {
        userId: activeUser.id,
        initialAmount,
        expectedAmount: initialAmount,
        status: "ABIERTA",
      },
    });

    return NextResponse.json(newShift);
  } catch (error) {
    console.error("Error opening shift:", error);
    return NextResponse.json(
      { error: "Error al abrir la caja" },
      { status: 500 }
    );
  }
}
