import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id") || "";
    const userRole = searchParams.get("userRole") || request.headers.get("x-user-role") || "";

    const isSuperAdmin = userRole === "SUPERADMIN";

    const logs = await prisma.auditLog.findMany({
      where: isSuperAdmin
        ? {}
        : tenantId
        ? { user: { tenantId } }
        : {},
      include: {
        user: {
          select: { name: true, username: true, role: true, tenant: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Error al obtener registros de auditoría" },
      { status: 500 }
    );
  }
}
