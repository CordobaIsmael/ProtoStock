import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id") || "";
    const userRole = searchParams.get("userRole") || request.headers.get("x-user-role") || "";

    const isSuperAdmin = userRole === "SUPERADMIN";

    const users = await prisma.user.findMany({
      where: isSuperAdmin
        ? {} // SuperAdmin ve todos los usuarios del sistema
        : {
            tenantId: tenantId || "__NO_TENANT_MATCH__", // Solo los usuarios de su comercio
            role: { not: "SUPERADMIN" }, // No ve el rol SUPERADMIN
          },
      select: {
        id: true,
        tenantId: true,
        name: true,
        username: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { tenantId: "asc" },
        { role: "asc" },
        { name: "asc" },
      ],
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
    const { name, username, email, password, role = "CAJERO", activeUserRole, tenantId } = body;

    // Solo ADMIN o SUPERADMIN puede crear usuarios
    if (activeUserRole !== "ADMIN" && activeUserRole !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado: El Encargado y Cajero no tienen permiso para agregar nuevos usuarios." },
        { status: 403 }
      );
    }

    // El ADMIN de un comercio NO puede crear usuarios SUPERADMIN
    if (activeUserRole === "ADMIN" && role === "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado: No tienes permisos para crear usuarios con nivel SuperAdmin." },
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
        { error: "El nombre de usuario ya está registrado en el sistema" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        tenantId: tenantId || null,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email ? email.trim().toLowerCase() : null,
        passwordHash: password.trim(),
        role,
        isActive: true,
      },
      include: {
        tenant: {
          select: { id: true, name: true, slug: true },
        },
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
        details: `Nuevo usuario creado: @${newUser.username} (${newUser.name}) con rol ${newUser.role} en ${newUser.tenant?.name || "Sin Local"}`,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: `Error al crear usuario: ${error?.message || "Servicio no disponible"}` },
      { status: 500 }
    );
  }
}
