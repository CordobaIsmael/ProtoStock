import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verify2FAToken } from "@/lib/twoFactor";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { username = "superadmin", code } = await request.json();

    if (!code || code.trim().length !== 6) {
      return NextResponse.json(
        { error: "Ingresa un código válido de 6 dígitos" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { role: "SUPERADMIN" }],
      },
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "No se ha configurado el secreto de 2FA en esta cuenta" },
        { status: 400 }
      );
    }

    const isValid = verify2FAToken(code, user.twoFactorSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Código de verificación incorrecto o expirado. Revisa la hora de tu dispositivo." },
        { status: 400 }
      );
    }

    // Activar 2FA en la cuenta del SuperAdmin
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    return NextResponse.json({
      success: true,
      message: "🔒 ¡Autenticación de 2 Factores (2FA) activada con éxito!",
    });
  } catch (error: any) {
    console.error("Error al verificar 2FA:", error);
    return NextResponse.json(
      { error: `Error al validar 2FA: ${error?.message || "Servicio no disponible"}` },
      { status: 500 }
    );
  }
}
