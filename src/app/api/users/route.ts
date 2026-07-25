import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, email, password, role = "CAJERO", activeUserRole } = body;

    // Solo ADMIN puede crear usuarios
    if (activeUserRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado: El Encargado y Cajero no tienen permiso para agregar nuevos usuarios." },
        { status: 403 }
      );
    }

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Nombre, usuario y contraseña son campos obligatorios" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El nombre de usuario ya está registrado" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        username: username.trim().toLowerCase(),
        email: email || null,
        passwordHash: password.trim(),
        role,
        isActive: true,
      },
    });

    // Registrar en auditoría
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    await prisma.auditLog.create({
      data: {
        userId: adminUser?.id || null,
        action: "CREAR_USUARIO",
        entity: "User",
        entityId: newUser.id,
        details: `Nuevo usuario creado: @${newUser.username} (${newUser.name}) con rol ${newUser.role}`,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
