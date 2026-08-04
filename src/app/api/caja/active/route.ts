import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");

    let userObj = null;

    if (userId) {
      userObj = await prisma.user.findUnique({ where: { id: userId } });
    } else if (username) {
      userObj = await prisma.user.findUnique({ where: { username } });
    } else {
      userObj = await prisma.user.findFirst();
    }

    if (!userObj) {
      return NextResponse.json(null);
    }

    const activeShift = await prisma.cashShift.findFirst({
      where: {
        userId: userObj.id,
        status: "ABIERTA",
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, role: true },
        },
        cashMovements: {
          orderBy: { createdAt: "desc" },
        },
        sales: {
          where: { status: "COMPLETADA" },
          include: {
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { openingDate: "desc" },
    });

    return NextResponse.json(activeShift);
  } catch (error) {
    console.error("Error fetching active shift:", error);
    return NextResponse.json(
      { error: "Error al obtener la caja activa del usuario" },
      { status: 500 }
    );
  }
}
