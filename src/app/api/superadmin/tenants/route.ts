import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        users: {
          select: { id: true, name: true, username: true, role: true },
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
  } catch (error) {
    console.error("Error al obtener comercios:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los comercios." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    // Verificar si el slug o usuario ya existen
    const existingTenant = await prisma.tenant.findUnique({ where: { slug: cleanSlug } });
    if (existingTenant) {
      return NextResponse.json(
        { error: `El identificador '${cleanSlug}' ya existe para otro comercio.` },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { username: adminUsername.trim() } });
    if (existingUser) {
      return NextResponse.json(
        { error: `El usuario '${adminUsername}' ya está registrado en el sistema.` },
        { status: 400 }
      );
    }

    // Fecha límite inicial: 30 días a partir de hoy
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Crear el comercio y su primer usuario Administrador en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
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
      });

      const adminUser = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: adminName || `Admin ${name}`,
          username: adminUsername.trim(),
          passwordHash: adminPassword, // En producción se usa bcrypt
          role: "ADMIN",
          isActive: true,
        },
      });

      return { tenant, adminUser };
    });

    return NextResponse.json({
      success: true,
      tenant: result.tenant,
      adminUser: result.adminUser,
    });
  } catch (error) {
    console.error("Error al crear el comercio:", error);
    return NextResponse.json(
      { error: "Error interno al registrar el comercio." },
      { status: 500 }
    );
  }
}
