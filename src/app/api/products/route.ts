import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const onlyActive = searchParams.get("onlyActive") === "true";

    const products = await prisma.product.findMany({
      where: {
        AND: [
          onlyActive ? { isActive: true } : {}, // Si se especifica onlyActive=true (ej. POS), filtrar sólo activos. De lo contrario, traer todos para poder administrarlos.
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { code: { contains: search } },
                ],
              }
            : {},
          categoryId ? { categoryId } : {},
        ],
      },
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
