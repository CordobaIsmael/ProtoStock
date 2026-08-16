import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify2FAToken } from "@/lib/twoFactor";
import { setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: "Usuario y código de 6 dígitos son requeridos" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user && userId === "superadmin-sys") {
      user = await prisma.user.findFirst({
        where: { role: "SUPERADMIN" },
      });
    }

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "Configuración de 2FA no encontrada" },
        { status: 404 }
      );
    }

    const isValid = verify2FAToken(code, user.twoFactorSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Código de 6 dígitos incorrecto o expirado" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      tenantId: user.tenantId || null,
    };

    // Emitir la cookie HTTP-Only de sesión
    await setSessionCookie(sessionUser);

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (error: any) {
    console.error("Error en validación 2FA de login:", error);
    return NextResponse.json(
      { error: "Error al verificar código 2FA" },
      { status: 500 }
    );
  }
}
