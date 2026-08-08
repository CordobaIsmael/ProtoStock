import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = params.id;
    const { status } = await request.json();

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return NextResponse.json(
        { error: "Comercio no encontrado" },
        { status: 404 }
      );
    }

    const newStatus = status || (tenant.status === "ACTIVO" ? "SUSPENDIDO_POR_PAGO" : "ACTIVO");

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, tenant: updated });
  } catch (error) {
    console.error("Error al cambiar estado del comercio:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar el comercio." },
      { status: 500 }
    );
  }
}
