import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = params.id;

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      return NextResponse.json(
        { error: "Comercio no encontrado" },
        { status: 404 }
      );
    }

    // Calcular nueva fecha de vencimiento: si ya venció, 30 días a partir de hoy. Si no venció, sumar 30 días a la fecha actual de vencimiento.
    const now = new Date();
    const currentDueDate = tenant.dueDate ? new Date(tenant.dueDate) : now;
    const baseDate = currentDueDate > now ? currentDueDate : now;

    const newDueDate = new Date(baseDate);
    newDueDate.setDate(newDueDate.getDate() + 30);

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        dueDate: newDueDate,
        status: "ACTIVO", // Reactiva automáticamente si estaba suspendido
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cuota mensual renovada exitosamente por 30 días.",
      tenant: updated,
    });
  } catch (error) {
    console.error("Error al renovar cuota:", error);
    return NextResponse.json(
      { error: "Error interno al renovar la cuota del comercio." },
      { status: 500 }
    );
  }
}
