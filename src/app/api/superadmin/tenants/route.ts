import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

async function ensureTenantTableExists() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Tenant" (
        "id" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "taxId" TEXT,
        "phone" TEXT,
        "email" TEXT,
        "address" TEXT,
        "plan" TEXT NOT NULL DEFAULT 'PRO',
        "status" TEXT NOT NULL DEFAULT 'ACTIVO',
        "dueDate" TIMESTAMP(3),
        "monthlyFee" DOUBLE PRECISION NOT NULL DEFAULT 25000.0,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_slug_key" ON "Tenant"("slug");
    `);
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tenantId" TEXT;
    `);
  } catch (err) {
    console.warn("Auto-migration notice:", err);
  }
}

export async function GET() {
  try {
    await ensureTenantTableExists();

    const tenants = await prisma.tenant.findMany({
      include: {
        users: {
          select: { id: true, name: true, username: true, role: true, passwordHash: true },
        },
        sales: {
          where: { status: "COMPLETADA" },
          select: { totalAmount: true },
        },
        _count: {
          select: {
            users: true,
            products: true,
            sales: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tenants);
  } catch (error: any) {
    console.error("Error al obtener comercios:", error);
    return NextResponse.json(
      { error: `Error al obtener comercios: ${error?.message || "Error de servidor"}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureTenantTableExists();

    const body = await request.json();
    const {
      name,
      slug,
      taxId,
      phone,
      email,
      address,
      plan = "PRO",
      monthlyFee = 25000,
      adminName,
      adminUsername,
      adminPassword,
    } = body;

    if (!name || !adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios: Nombre del comercio, usuario y contraseña." },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const cleanUsername = adminUsername.trim().toLowerCase();

    // Verificar usuario único globalmente
    const existingUser = await prisma.user.findFirst({
      where: { username: cleanUsername },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: `El usuario '${cleanUsername}' ya está registrado en el sistema.` },
        { status: 400 }
      );
    }

    // Verificar si el slug ya existe
    let tenant = await prisma.tenant.findUnique({
      where: { slug: cleanSlug },
      include: { users: true },
    });

    if (tenant) {
      // Si el comercio existe pero no tiene usuarios asociados, reutilizarlo
      if (tenant.users.length > 0) {
        return NextResponse.json(
          { error: `El identificador '${cleanSlug}' ya pertenece a un comercio con administradores.` },
          { status: 400 }
        );
      }
    } else {
      // Crear nuevo comercio si no existía
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);

      tenant = await prisma.tenant.create({
        data: {
          name: name.trim(),
          slug: cleanSlug,
          taxId: taxId || null,
          phone: phone || null,
          email: email || null,
          address: address || null,
          plan,
          status: "ACTIVO",
          dueDate,
          monthlyFee: parseFloat(monthlyFee) || 25000,
        },
        include: { users: true },
      });
    }

    // Crear el Usuario Administrador del Comercio
    let adminUser;
    try {
      const hashedPassword = await bcrypt.hash(adminPassword.trim(), 10);
      adminUser = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          name: adminName || `Admin ${name.trim()}`,
          username: cleanUsername,
          passwordHash: hashedPassword,
          role: "ADMIN",
          isActive: true,
        },
      });
    } catch (userCreateErr: any) {
      // Si falló la creación del usuario y el comercio era totalmente nuevo (sin usuarios previa), hacer rollback
      if (tenant.users.length === 0) {
        await prisma.tenant.delete({ where: { id: tenant.id } }).catch(() => {});
      }
      throw userCreateErr;
    }

    return NextResponse.json({
      success: true,
      tenant,
      adminUser,
    });
  } catch (error: any) {
    console.error("Error al crear el comercio:", error);
    return NextResponse.json(
      { error: `Error al registrar el comercio: ${error?.message || "Servidor no disponible"}` },
      { status: 500 }
    );
  }
}
