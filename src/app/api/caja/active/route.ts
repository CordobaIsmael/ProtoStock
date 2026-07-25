import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activeShift = await prisma.cashShift.findFirst({
      where: { status: "ABIERTA" },
      include: {
        user: true,
        cashMovements: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { openingDate: "desc" },
    });

    return NextResponse.json(activeShift);
  } catch (error) {
    console.error("Error fetching active shift:", error);
    return NextResponse.json(
      { error: "Error al obtener la caja activa" },
      { status: 500 }
    );
  }
}
