import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true,
            passwordHash: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { role: "asc" },
        },
        products: {
          select: { id: true, name: true, salePrice: true, currentStock: true, isActive: true },
        },
        sales: {
          where: { status: "COMPLETADA" },
          select: { id: true, totalAmount: true, createdAt: true, paymentMethod: true },
          orderBy: { createdAt: "desc" },
        },
        cashShifts: {
          select: {
            id: true,
            status: true,
            openingDate: true,
            expectedAmount: true,
            user: { select: { name: true } },
          },
          orderBy: { openingDate: "desc" },
          take: 5,
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Comercio no encontrado" }, { status: 404 });
    }

    const totalRevenue = tenant.sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalTickets = tenant.sales.length;

    return NextResponse.json({
      tenant,
      metrics: {
        totalRevenue,
        totalTickets,
        totalProducts: tenant.products.length,
        totalUsers: tenant.users.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching tenant detail:", error);
    return NextResponse.json(
      { error: `Error al obtener detalle del comercio: ${error?.message || "Error interno"}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      taxId,
      phone,
      email,
      address,
      plan,
      monthlyFee,
      adminUserId,
      adminUsername,
      adminPassword,
      adminName,
    } = body;

    // 1. Actualizar datos del Comercio (Tenant)
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        taxId: taxId !== undefined ? (taxId ? taxId.trim() : null) : undefined,
        phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
        email: email !== undefined ? (email ? email.trim() : null) : undefined,
        address: address !== undefined ? (address ? address.trim() : null) : undefined,
        plan: plan || undefined,
        monthlyFee: monthlyFee !== undefined ? parseFloat(monthlyFee) : undefined,
      },
      include: {
        users: {
          select: { id: true, name: true, username: true, role: true, passwordHash: true },
        },
      },
    });

    // 2. Si se pasaron datos del Administrador del comercio, actualizar usuario Admin
    if (adminUserId || adminUsername) {
      let adminUser = null;
      if (adminUserId) {
        adminUser = await prisma.user.findUnique({ where: { id: adminUserId } });
      } else {
        adminUser = await prisma.user.findFirst({
          where: { tenantId: id, role: "ADMIN" },
        });
      }

      if (adminUser) {
        const cleanUsername = adminUsername ? adminUsername.trim().toLowerCase() : adminUser.username;

        // Verificar si el username ya está tomado por otro usuario
        if (cleanUsername !== adminUser.username) {
          const dup = await prisma.user.findUnique({ where: { username: cleanUsername } });
          if (dup) {
            return NextResponse.json(
              { error: `El usuario '${cleanUsername}' ya está siendo usado por otro usuario.` },
              { status: 400 }
            );
          }
        }

        const newPasswordHash = adminPassword
          ? (adminPassword.trim().startsWith("$2b$") || adminPassword.trim().startsWith("$2a$")
              ? adminPassword.trim()
              : await bcrypt.hash(adminPassword.trim(), 10))
          : adminUser.passwordHash;

        await prisma.user.update({
          where: { id: adminUser.id },
          data: {
            name: adminName ? adminName.trim() : adminUser.name,
            username: cleanUsername,
            passwordHash: newPasswordHash,
          },
        });
      }
    }

    return NextResponse.json({ success: true, tenant: updatedTenant });
  } catch (error: any) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { error: `Error al actualizar comercio: ${error?.message || "Error interno"}` },
      { status: 500 }
    );
  }
}
