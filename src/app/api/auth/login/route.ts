import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    // Intentar buscar usuario directamente o mediante lista
    let user = await prisma.user.findFirst({
      where: {
        username: {
          equals: cleanUsername,
        },
      },
    });

    if (!user) {
      // Búsqueda alternativa case-insensitive
      const allUsers = await prisma.user.findMany();
      user = allUsers.find((u) => u.username.trim().toLowerCase() === cleanUsername) || null;
    }

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Usuario no encontrado o inactivo" },
        { status: 401 }
      );
    }

    // Validación de contraseña
    if (user.passwordHash !== cleanPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Registrar inicio de sesión en Auditoría
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN",
          entity: "User",
          entityId: user.id,
          details: `Inicio de sesión exitoso de ${user.name} (${user.role})`,
        },
      });
    } catch (auditErr) {
      console.warn("Audit log warning:", auditErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error detallado en login:", error);
    const errorMessage = error?.message || "Error al autenticar usuario";
    return NextResponse.json(
      { error: `Error de autenticación: ${errorMessage}` },
      { status: 500 }
    );
  }
}
