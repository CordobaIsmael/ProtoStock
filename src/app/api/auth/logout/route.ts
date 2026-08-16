import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await removeSessionCookie();
    return NextResponse.json({ success: true, message: "Sesión cerrada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 });
  }
}
