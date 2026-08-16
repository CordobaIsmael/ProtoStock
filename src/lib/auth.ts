import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "protostock_sec_jwt_key_2026_superadmin_multitenant";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
export const COOKIE_NAME = "protostock_session";

export interface SessionPayload {
  id: string;
  name: string;
  username: string;
  role: string;
  tenantId: string | null;
}

// Firmar JWT con validez de 7 días
export async function signToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

// Verificar la firma del JWT
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Establecer la Cookie HTTP-Only en la respuesta de Next.js
export async function setSessionCookie(payload: SessionPayload) {
  const token = await signToken(payload);
  const cookieStore = cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, // No accesible desde JavaScript del cliente (previene robos XSS)
    secure: process.env.NODE_ENV === "production", // HTTPS en producción
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // Duración de 7 días
    path: "/",
  });
}

// Obtener sesión activa de la Cookie HTTP-Only
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return await verifyToken(cookie.value);
}

// Destruir Cookie HTTP-Only al cerrar sesión
export async function removeSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
