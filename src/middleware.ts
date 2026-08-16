import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "protostock_sec_jwt_key_2026_superadmin_multitenant";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "protostock_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".");

  // Obtener la Cookie HTTP-Only de Sesión
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  let sessionPayload: any = null;

  if (sessionCookie?.value) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, SECRET_KEY);
      sessionPayload = payload;
    } catch (e) {
      // Token inválido o expirado
      sessionPayload = null;
    }
  }

  // 1. Si intenta entrar a una ruta protegida sin sesión válida -> Redirigir a /login
  if (!isPublicRoute && !sessionPayload) {
    // Si es una petición API, devolver error 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Sesión no iniciada o token expirado" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si ya está autenticado e intenta ir a /login -> Redirigir a su panel según su Rol
  if (pathname === "/login" && sessionPayload) {
    if (sessionPayload.role === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/superadmin", request.url));
    }
    return NextResponse.redirect(new URL("/pos", request.url));
  }

  // 3. Protección estricta de la ruta /superadmin (Solo accesible para el rol SUPERADMIN)
  if (pathname.startsWith("/superadmin")) {
    if (!sessionPayload || sessionPayload.role !== "SUPERADMIN") {
      const posUrl = new URL("/pos", request.url);
      return NextResponse.redirect(posUrl);
    }
  }

  // 4. Inyectar x-tenant-id y x-user-role en los Headers de las peticiones API para seguridad en el backend
  const response = NextResponse.next();
  if (sessionPayload) {
    if (sessionPayload.tenantId) {
      response.headers.set("x-tenant-id", sessionPayload.tenantId);
    }
    response.headers.set("x-user-role", sessionPayload.role);
    response.headers.set("x-user-id", sessionPayload.id);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto recursos estáticos
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
