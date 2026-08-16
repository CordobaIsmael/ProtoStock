import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generate2FASecret, generateQRCodeDataURL } from "@/lib/twoFactor";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { username = "superadmin" } = await request.json();

    // 1. Buscar usuario SuperAdmin
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { role: "SUPERADMIN" }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 2. Si ya tiene un secreto guardado, usarlo o generar uno nuevo
    let secret = user.twoFactorSecret;
    if (!secret) {
      const generated = generate2FASecret(user.username);
      secret = generated.secret;

      // Guardar secreto en DB
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorSecret: secret },
      });
    }

    const otpauth = `otpauth://totp/ProtoStock:${user.username}?secret=${secret}&issuer=ProtoStock%20SaaS`;
    const qrCodeDataUrl = await generateQRCodeDataURL(otpauth);

    return NextResponse.json({
      success: true,
      secret,
      qrCodeDataUrl,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error: any) {
    console.error("Error al configurar 2FA:", error);
    return NextResponse.json(
      { error: `Error al generar 2FA: ${error?.message || "Servicio no disponible"}` },
      { status: 500 }
    );
  }
}
