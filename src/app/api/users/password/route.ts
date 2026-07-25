import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { targetUserId, newPassword, activeUserRole } = await request.json();

    if (activeUserRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado: Solo el Administrador puede cambiar contraseñas." },
        { status: 403 }
      );
    }

    if (!targetUserId || !newPassword) {
      return NextResponse.json(
        { error: "ID de usuario y nueva contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { passwordHash: newPassword.trim() },
    });

    // Auditoría
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    await prisma.auditLog.create({
      data: {
        userId: adminUser?.id || null,
        action: "CAMBIAR_CONTRASEÑA",
        entity: "User",
        entityId: updatedUser.id,
        details: `Contraseña modificada para el usuario @${updatedUser.username} (${updatedUser.name})`,
      },
    });

    return NextResponse.json({ success: true, message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    return NextResponse.json(
      { error: "Error al actualizar la contraseña" },
      { status: 500 }
    );
  }
}
