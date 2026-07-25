import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: cleanUsername,
        },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Usuario no encontrado o inactivo" },
        { status: 401 }
      );
    }

    // Validación estricta de contraseña
    if (user.passwordHash !== cleanPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Registrar inicio de sesión en Auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        details: `Inicio de sesión exitoso de ${user.name} (${user.role})`,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error al autenticar usuario" },
      { status: 500 }
    );
  }
}
