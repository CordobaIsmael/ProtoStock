import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json(
      { error: "Error al obtener proveedores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, taxId, phone, email, address, notes, activeUserRole } = body;

    if (activeUserRole === "CAJERO") {
      return NextResponse.json(
        { error: "Acceso denegado: El rol Cajero no puede agregar proveedores." },
        { status: 403 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "El nombre del proveedor es obligatorio" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        taxId: taxId || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        notes: notes || null,
        isActive: true,
      },
    });

    // Auditoría
    const adminUser = await prisma.user.findFirst();
    await prisma.auditLog.create({
      data: {
        userId: adminUser?.id || null,
        action: "CREAR_PROVEEDOR",
        entity: "Supplier",
        entityId: supplier.id,
        details: `Nuevo proveedor creado: ${supplier.name} (${taxId || "Sin CUIT"})`,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { error: "Error al guardar proveedor" },
      { status: 500 }
    );
  }
}
