import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { initialAmount = 0, userId, username } = await request.json();

    let targetUser = null;
    if (userId) {
      targetUser = await prisma.user.findUnique({ where: { id: userId } });
    } else if (username) {
      targetUser = await prisma.user.findUnique({ where: { username } });
    } else {
      targetUser = await prisma.user.findFirst();
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "No se encontró el usuario para abrir la caja." },
        { status: 400 }
      );
    }

    // Verificar si ESTE usuario ya tiene un turno abierto
    const existingShift = await prisma.cashShift.findFirst({
      where: {
        userId: targetUser.id,
        status: "ABIERTA",
      },
    });

    if (existingShift) {
      return NextResponse.json(
        { error: `El usuario ${targetUser.name} ya tiene un turno de caja abierto.` },
        { status: 400 }
      );
    }

    const newShift = await prisma.cashShift.create({
      data: {
        tenantId: targetUser.tenantId || null,
        userId: targetUser.id,
        initialAmount: parseFloat(initialAmount) || 0,
        expectedAmount: parseFloat(initialAmount) || 0,
        status: "ABIERTA",
      },
      include: {
        user: { select: { id: true, name: true, username: true, role: true } },
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
