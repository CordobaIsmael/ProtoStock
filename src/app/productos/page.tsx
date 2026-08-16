"use client";

import { useEffect, useState, useRef } from "react";
import {
  Package,
  Plus,
  Search,
  Scale,
  Edit2,
  AlertTriangle,
  Check,
  X,
  Filter,
  RefreshCw,
  Lock,
  ShieldAlert,
  Power,
  Trash2,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  Download,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  code: string | null;
  name: string;
  unitType: string;
  isWeighted: boolean;
  costPrice: number;
  salePrice: number;
  currentStock: number;
  minStock: number;
  isActive: boolean;
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("CAJERO");
  const [showInactive, setShowInactive] = useState(false);

  // Estado de Paginación (10 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal para agregar nuevo producto
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    code: "",
    name: "",
    categoryId: "",
    unitType: "KG",
    isWeighted: true,
    costPrice: 0,
    salePrice: 0,
    minStock: 5,
    currentStock: 10,
  });

  // Modal para editar producto
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Modal para dar de baja por vencimiento / merma
  const [isShrinkageModalOpen, setIsShrinkageModalOpen] = useState(false);
  const [selectedProductForShrinkage, setSelectedProductForShrinkage] = useState<Product | null>(null);
  const [shrinkageQuantity, setShrinkageQuantity] = useState("1");
  const [shrinkageReason, setShrinkageReason] = useState("Mercadería Vencida");

  // Modal de Importación Masiva (Excel / CSV)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const [tenantId, setTenantId] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    let activeTenantId = "";
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserRole(u.role || "CAJERO");
        activeTenantId = u.tenantId || "";
        setTenantId(activeTenantId);
      } catch (e) {
        console.error(e);
      }
    }
    fetchProducts(activeTenantId);
    fetchCategories(activeTenantId);
  }, [search, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, showInactive]);

  const fetchProducts = async (currentTenantId?: string) => {
    setIsLoading(true);
    const tid = currentTenantId !== undefined ? currentTenantId : tenantId;
    try {
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(search)}&categoryId=${encodeURIComponent(
          selectedCategory
        )}&tenantId=${encodeURIComponent(tid)}`
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async (currentTenantId?: string) => {
    const tid = currentTenantId !== undefined ? currentTenantId : tenantId;
    try {
      const res = await fetch(`/api/categories?tenantId=${encodeURIComponent(tid)}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === "CAJERO") return;

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...createFormData, activeUserRole: userRole, tenantId }),
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setCreateFormData({
          code: "",
          name: "",
          categoryId: "",
          unitType: "KG",
          isWeighted: true,
          costPrice: 0,
          salePrice: 0,
          minStock: 5,
          currentStock: 10,
        });
        fetchProducts();
      } else {
        const errData = await res.json();
        alert(errData.error || "Error al crear el producto");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      id: product.id,
      code: product.code || "",
      name: product.name,
      categoryId: product.category?.id || categories[0]?.id || "",
      unitType: product.unitType,
      isWeighted: product.isWeighted,
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      minStock: product.minStock,
      currentStock: product.currentStock,
      isActive: product.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === "CAJERO") return;

    try {
      const res = await fetch("/api/products/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, activeUserRole: userRole }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || "Error al editar el producto");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    if (userRole === "CAJERO") return;

    try {
      const res = await fetch("/api/products/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          categoryId: product.category?.id || "",
          isActive: !product.isActive,
          activeUserRole: userRole,
        }),
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveShrinkage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForShrinkage || !shrinkageQuantity) return;

    try {
      const res = await fetch("/api/inventory/shrinkage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductForShrinkage.id,
          quantity: parseFloat(shrinkageQuantity),
          reason: shrinkageReason,
          activeUserRole: userRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsShrinkageModalOpen(false);
        setSelectedProductForShrinkage(null);
        setShrinkageQuantity("1");
        fetchProducts();
      } else {
        alert(data.error || "Error al dar de baja el stock");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Leer archivo Excel/CSV seleccionado por el usuario
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setCsvRawText(content);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  function cleanMojibake(str: string): string {
    if (!str) return str;
    let s = str.trim();
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

  // Exportar catálogo completo a Excel/CSV con sep=; para celdas independientes (Columna A, B, C, D...)
  const handleExportCSV = () => {
    if (products.length === 0) return alert("No hay productos para exportar");

    const headers = ["codigo", "nombre", "categoria", "tipoVenta", "precioCosto", "precioVenta", "stockActual", "stockMinimo"];
    const rows = products.map((p) => [
      p.code || "",
      `"${cleanMojibake(p.name).replace(/"/g, '""')}"`,
      `"${cleanMojibake(p.category?.name || "General").replace(/"/g, '""')}"`,
      p.unitType,
      p.costPrice,
      p.salePrice,
      p.currentStock,
      p.minStock,
    ]);

    // \uFEFF fuerza codificación UTF-8 pura en Excel para acentos (é, á, í, ó, ú, ñ)
    // sep=;\n le indica a Excel que separe cada dato en su propia celda/columna (A, B, C, D, E, F, G, H)
    const csvData = "\uFEFFsep=;\n" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `catalogo_precios_protostock_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar plantilla CSV de ejemplo
  const handleDownloadSampleCSV = () => {
    const sampleText =
      "sep=;\n" +
      "codigo;nombre;categoria;tipoVenta;precioCosto;precioVenta;stockActual;stockMinimo\n" +
      "F001;Jamón Cocido Paladini;Fiambrería;KG;4500;7800;12.5;3\n" +
      "F002;Queso Tybo Barra;Fiambrería;KG;3800;6900;15;3\n" +
      "A001;Pan de Miga 1kg;Almacén;UNIDAD;1200;2200;20;5\n" +
      "B001;Coca Cola 2.25L;Bebidas;UNIDAD;1800;3000;30;10\n" +
      "B002;Sprite 2.25L;Bebidas;UNIDAD;1800;3000;25;10\n" +
      "B003;Fanta 2.25L;Bebidas;UNIDAD;1800;3000;20;10";

    const blob = new Blob(["\uFEFF" + sampleText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_actualizacion_precios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Procesar actualización e importación masiva desde CSV/Excel
  const handleProcessImport = async () => {
    if (!csvRawText.trim()) return alert("Por favor selecciona un archivo o pega el contenido en formato CSV/Excel.");

    try {
      setIsImporting(true);
      const rawLines = csvRawText.trim().split("\n");
      const lines = rawLines.filter((l) => !l.toLowerCase().startsWith("sep="));
      const parsedProducts = [];

      let startIndex = 0;
      if (lines.length > 0 && (lines[0].toLowerCase().includes("nombre") || lines[0].toLowerCase().includes("codigo") || lines[0].toLowerCase().includes("categoria"))) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.toLowerCase().startsWith("sep=")) continue;

        // Auto-detectar delimitador de Excel (punto y coma ;, tabulacion \t o coma ,)
        const delimiter = line.includes(";") ? ";" : line.includes("\t") ? "\t" : ",";
        const cols = line.split(delimiter).map((c) => c.replace(/^"|"$/g, "").trim());

        if (cols.length >= 2) {
          parsedProducts.push({
            code: cols[0] || null,
            name: cols[1] || "",
            category: cols[2] || "General",
            unitType: cols[3] || "UNIDAD",
            costPrice: parseFloat(cols[4]?.replace(",", ".")) || 0,
            salePrice: parseFloat(cols[5]?.replace(",", ".")) || 0,
            currentStock: parseFloat(cols[6]?.replace(",", ".")) || 0,
            minStock: parseFloat(cols[7]?.replace(",", ".")) || 5,
          });
        }
      }

      if (parsedProducts.length === 0) {
        setIsImporting(false);
        return alert("No se detectaron filas válidas para procesar.");
      }

      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: parsedProducts,
          activeUserRole: userRole,
          tenantId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(
          `🎉 ¡Actualización Masiva Completada con Éxito!\n\n• Precios/Productos actualizados: ${data.updatedCount}\n• Productos nuevos creados: ${data.importedCount}`
        );
        setIsImportModalOpen(false);
        setCsvRawText("");
        fetchProducts();
        fetchCategories();
      } else {
        alert(data.error || "Error durante la actualización de precios.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al procesar el archivo.");
    } finally {
      setIsImporting(false);
    }
  };

  const isCashier = userRole === "CAJERO";
  const displayedProducts = products.filter((p) => showInactive || p.isActive);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / itemsPerPage));
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Gestión de Productos & Stock
            </h1>
            {isCashier && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Modo Lectura (Cajero)
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Catálogo general, cambio de precios, mermas e importación masiva desde Excel.
          </p>
        </div>

        {!isCashier ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-sm font-semibold transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Importar Excel</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Producto</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-amber-400 font-medium flex items-center gap-2 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
            <ShieldAlert className="w-4 h-4" />
            <span>Edición de stock reservada para Encargados y Admins.</span>
          </div>
        )}
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, SKU o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs border transition flex items-center gap-2 ${
              showInactive
                ? "bg-rose-600/20 border-rose-500 text-rose-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{showInactive ? "Mostrando Inactivos" : "Ver Inactivos"}</span>
          </button>

          <button
            onClick={() => fetchProducts()}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Recargar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabla de Productos con Paginación de 10 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Código / SKU</th>
                <th className="py-3.5 px-4">Producto</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4 text-center">Tipo Venta</th>
                {!isCashier && <th className="py-3.5 px-4 text-right">Costo</th>}
                <th className="py-3.5 px-4 text-right">Precio Venta</th>
                <th className="py-3.5 px-4 text-right">Stock Actual</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                {!isCashier && <th className="py-3.5 px-4 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={isCashier ? 7 : 9} className="py-8 text-center text-slate-500">
                    Cargando catálogo...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={isCashier ? 7 : 9} className="py-8 text-center text-slate-500">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => {
                  const isLowStock = prod.currentStock <= prod.minStock;
                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        !prod.isActive ? "opacity-50 bg-slate-950/40" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-xs">
                        {prod.code || "-"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-100">{prod.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {prod.category?.name || "Sin categoría"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {prod.isWeighted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Scale className="w-3 h-3" /> Por Kilo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            Unidad
                          </span>
                        )}
                      </td>
                      {!isCashier && (
                        <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                          ${prod.costPrice.toLocaleString("es-AR")}
                        </td>
                      )}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        ${prod.salePrice.toLocaleString("es-AR")}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span
                          className={
                            isLowStock
                              ? "text-rose-400 font-extrabold flex items-center justify-end gap-1"
                              : "text-slate-200"
                          }
                        >
                          {isLowStock && <AlertTriangle className="w-3.5 h-3.5" />}
                          {prod.currentStock.toFixed(prod.isWeighted ? 2 : 0)} {prod.unitType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          disabled={isCashier}
                          onClick={() => handleToggleStatus(prod)}
                          title="Hacer clic para activar/desactivar"
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase transition ${
                            prod.isActive
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300"
                              : "bg-slate-800 text-slate-500 border-slate-700 hover:bg-emerald-500/20 hover:text-emerald-400"
                          }`}
                        >
                          {prod.isActive ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      {!isCashier && (
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                              title="Editar Precio y Detalles"
                            >
                              <Edit2 className="w-4 h-4 text-rose-400" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedProductForShrinkage(prod);
                                setShrinkageQuantity("1");
                                setIsShrinkageModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition"
                              title="Dar de baja como Pérdida / Vencido / Devolución"
                            >
                              <TrendingDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Barra de Paginación */}
        {displayedProducts.length > 0 && (
          <div className="p-4 bg-slate-850 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Mostrando <span className="font-bold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
              <span className="font-bold text-white">
                {Math.min(currentPage * itemsPerPage, displayedProducts.length)}
              </span>{" "}
              de <span className="font-bold text-white">{displayedProducts.length}</span> productos
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono font-bold text-slate-200">
                Página {currentPage} de {totalPages}
              </span>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition flex items-center gap-1 font-semibold"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Importación Masiva (Excel/CSV) */}
      {isImportModalOpen && !isCashier && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-xl text-white">Importar Catálogo desde Excel / CSV</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-bold text-amber-300">💡 Formato del archivo CSV o texto pegado:</p>
              <p className="font-mono text-slate-400">
                codigo, nombre, categoria, tipoVenta (KG/UNIDAD), precioCosto, precioVenta, stockActual, stockMinimo
              </p>
              <div className="pt-1">
                <button
                  onClick={handleDownloadSampleCSV}
                  className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar Plantilla de Ejemplo (.csv)
                </button>
              </div>
            </div>

            {/* Selector de Archivo Excel / CSV */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl bg-slate-850 hover:bg-slate-800 transition cursor-pointer group"
            >
              <FileSpreadsheet className="w-8 h-8 text-amber-400 group-hover:scale-110 transition mb-1" />
              <p className="text-xs font-bold text-white">Haz clic aquí para seleccionar tu archivo Excel / CSV</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Formatos compatibles: .csv, .xlsx, .txt (Delimitado por comas, punto y coma o tabulaciones)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv, .txt, .tsv, .xlsx, .xls"
                className="hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-400">
                  O pega directamente el contenido copiado desde Excel:
                </label>
                {csvRawText.trim() && (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ✓ {csvRawText.trim().split("\n").length} filas listas para procesar
                  </span>
                )}
              </div>
              <textarea
                rows={6}
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                placeholder="codigo,nombre,categoria,tipoVenta,precioCosto,precioVenta,stockActual,stockMinimo&#10;B001,Coca Cola 2.25L,Bebidas,UNIDAD,1800,3000,30,10&#10;B002,Sprite 2.25L,Bebidas,UNIDAD,1800,3000,25,10"
                className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessImport}
                disabled={isImporting}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-extrabold shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{isImporting ? "Procesando..." : "Procesar & Cargar Productos"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Producto */}
      {isCreateModalOpen && !isCashier && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateProduct}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-xl text-white">Nuevo Producto</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Código de Barras / SKU:
                </label>
                <input
                  type="text"
                  value={createFormData.code}
                  onChange={(e) => setCreateFormData({ ...createFormData, code: e.target.value })}
                  placeholder="Ej: F003..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nombre del Producto: *
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  placeholder="Ej: Queso Gouda Barra"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Categoría: *
                </label>
                <select
                  required
                  value={createFormData.categoryId}
                  onChange={(e) =>
                    setCreateFormData({ ...createFormData, categoryId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="">Seleccionar Categoría...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tipo de Venta:
                </label>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCreateFormData({ ...createFormData, isWeighted: true, unitType: "KG" })
                    }
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      createFormData.isWeighted
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    Por Kilo (KG)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCreateFormData({ ...createFormData, isWeighted: false, unitType: "UNIDAD" })
                    }
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      !createFormData.isWeighted
                        ? "bg-blue-500/20 border-blue-500 text-blue-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    Unidad
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Precio de Costo ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={createFormData.costPrice}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      costPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Precio de Venta ($): *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={createFormData.salePrice}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      salePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Stock Inicial:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={createFormData.currentStock}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      currentStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Stock Mínimo (Alerta):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={createFormData.minStock}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      minStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/40"
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para Editar Producto */}
      {isEditModalOpen && !isCashier && editingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSaveEditProduct}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-xl text-white">Editar Producto</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Código de Barras / SKU:
                </label>
                <input
                  type="text"
                  value={editFormData.code}
                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nombre del Producto: *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Categoría: *
                </label>
                <select
                  required
                  value={editFormData.categoryId}
                  onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tipo de Venta:
                </label>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setEditFormData({ ...editFormData, isWeighted: true, unitType: "KG" })
                    }
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      editFormData.isWeighted
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    Por Kilo (KG)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditFormData({ ...editFormData, isWeighted: false, unitType: "UNIDAD" })
                    }
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition ${
                      !editFormData.isWeighted
                        ? "bg-blue-500/20 border-blue-500 text-blue-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    Unidad
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Precio de Costo ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.costPrice}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      costPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Precio de Venta ($): *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editFormData.salePrice}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      salePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Stock Actual:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.currentStock}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      currentStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Stock Mínimo:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editFormData.minStock}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      minStock: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/40"
              >
                Actualizar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Baja por Merma / Vencimiento */}
      {isShrinkageModalOpen && !isCashier && selectedProductForShrinkage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSaveShrinkage}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400">
                <TrendingDown className="w-5 h-5" />
                <h3 className="font-bold text-lg text-white">Baja de Stock por Merma</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShrinkageModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-semibold">
              Producto: <span className="text-white font-bold">{selectedProductForShrinkage.name}</span>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Cantidad a Descontar ({selectedProductForShrinkage.unitType}):
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={shrinkageQuantity}
                onChange={(e) => setShrinkageQuantity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Motivo:</label>
              <select
                value={shrinkageReason}
                onChange={(e) => setShrinkageReason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Mercadería Vencida">Mercadería Vencida</option>
                <option value="Devolución a Proveedor">Devolución a Proveedor</option>
                <option value="Rotura / Falla de Frío">Rotura / Falla de Frío</option>
                <option value="Consumo Interno">Consumo Interno</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsShrinkageModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-950/40"
              >
                Confirmar Baja
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
