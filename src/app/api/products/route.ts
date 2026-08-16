import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function cleanMojibake(str: string): string {
  if (!str) return str;
  let s = str.trim();

  try {
    if (s.includes("Ã")) {
      const bytes = Buffer.from(s, "latin1");
      const utf8Decoded = bytes.toString("utf8");
      if (!utf8Decoded.includes("") && utf8Decoded !== s) {
        s = utf8Decoded;
      }
    }
  } catch (e) {}

  return s
    .replace(/AlmacÃ©n|AlmacÃ£\u00a9n|AlmacÃ\u00a9n/gi, "Almacén")
    .replace(/FiambrerÃa|FiambrerÃ\u00ada/gi, "Fiambrería")
    .replace(/LÃ¡cteos|LÃ\u00a1cteos/gi, "Lácteos")
    .replace(/PanaderÃa|PanaderÃ\u00ada/gi, "Panadería")
    .replace(/CLÃ¡sica|CLÃ\u00a1sica/gi, "Clásica")
    .replace(/LimÃ³n|LimÃ\u00b3n/gi, "Limón")
    .replace(/JabÃ³n|JabÃ\u00b3n/gi, "Jabón")
    .replace(/AcciÃ³n|AcciÃ\u00b3n/gi, "Acción")
    .replace(/TallarÃn|TallarÃ\u00adn/gi, "Tallarín")
    .replace(/SerenÃsima|SerenÃ\u00adsima/gi, "Serenísima")
    .replace(/CaÃ±uelense|CaÃ\u00b1uelense/gi, "Cañuelense")
    .replace(/Ã©/g, "é")
    .replace(/Ã¡/g, "á")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã‰/g, "É")
    .replace(/Ã/g, "Á")
    .replace(/Ã/g, "Í")
    .replace(/Ã/g, "Ó")
    .replace(/ÃÚ/g, "Ú")
    .replace(/Ã'/g, "Ñ");
}

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

    // 2. Auto-reparar caracteres mojibake en el catálogo y categorías
    products = await Promise.all(
      products.map(async (p) => {
        const cleanedName = cleanMojibake(p.name);
        let cleanedCatName = p.category ? cleanMojibake(p.category.name) : undefined;

        if (cleanedName !== p.name) {
          prisma.product.update({ where: { id: p.id }, data: { name: cleanedName } }).catch(() => {});
          p.name = cleanedName;
        }

        if (p.category && cleanedCatName && cleanedCatName !== p.category.name) {
          prisma.category.update({ where: { id: p.category.id }, data: { name: cleanedCatName } }).catch(() => {});
          p.category.name = cleanedCatName;
        }

        return p;
      })
    );

    // 3. Buscador ultra flexible
    if (searchTokens.length > 0) {
      const normalizedTokens = searchTokens.map(normalizeStr);

      products = products.filter((p) => {
        const normName = normalizeStr(p.name);
        const normCode = normalizeStr(p.code || "");
        const normCategory = normalizeStr(p.category?.name || "");

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
