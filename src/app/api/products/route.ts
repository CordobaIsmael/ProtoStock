import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Función utilitaria para remover tildes y diacríticos (ej: "Jamón" -> "jamon")
function normalizeStr(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSearch = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const onlyActive = searchParams.get("onlyActive") === "true";
    const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id") || "";

    const searchTokens = rawSearch
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    // 1. Traer productos filtrados por Tenant, Categoría y Estado
    let products = await prisma.product.findMany({
      where: {
        AND: [
          tenantId ? { tenantId } : {},
          onlyActive ? { isActive: true } : {},
          categoryId ? { categoryId } : {},
        ],
      },
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: { name: "asc" },
    });

    // 2. Buscador ultra flexible (Ignora Mayúsculas/Minúsculas, Tildes y permite múltiples palabras en cualquier orden)
    if (searchTokens.length > 0) {
      const normalizedTokens = searchTokens.map(normalizeStr);

      products = products.filter((p) => {
        const normName = normalizeStr(p.name);
        const normCode = normalizeStr(p.code || "");
        const normCategory = normalizeStr(p.category?.name || "");

        // Cada término buscado debe estar presente en el Nombre, Código o Categoría
        return normalizedTokens.every(
          (token) =>
            normName.includes(token) ||
            normCode.includes(token) ||
            normCategory.includes(token)
        );
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
