"use client";

import { useEffect, useState, useRef } from "react";
import {
  Truck,
  Plus,
  Calendar,
  PackageCheck,
  FileText,
  User,
  X,
  PlusCircle,
  Trash2,
  AlertCircle,
  Clock,
  Building2,
  Phone,
  Mail,
  MapPin,
  PackagePlus,
  Barcode,
  Search,
  CheckCircle,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  taxId?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Product {
  id: string;
  name: string;
  code: string | null;
  unitType: string;
  isWeighted: boolean;
  costPrice: number;
}

interface PurchaseItemInput {
  productId: string;
  quantity: number;
  unitCost: number;
  batchNumber: string;
  expirationDate: string;
}

export default function PurchasesPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("CAJERO");

  // Modal de registro de compra / lote
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PurchaseItemInput[]>([]);

  // Escáner de código de barras
  const [scannedCode, setScannedCode] = useState("");
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Modal de nuevo proveedor
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierFormData, setSupplierFormData] = useState({
    name: "",
    taxId: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserRole(u.role || "CAJERO");
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSuppliers, resProducts, resPurchases] = await Promise.all([
        fetch("/api/suppliers"),
        fetch("/api/products"),
        fetch("/api/purchases"),
      ]);

      if (resSuppliers.ok) setSuppliers(await resSuppliers.json());
      if (resProducts.ok) setProducts(await resProducts.json());
      if (resPurchases.ok) setPurchases(await resPurchases.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPurchaseForSupplier = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    if (items.length === 0) handleAddItemRow();
    setIsModalOpen(true);
    setTimeout(() => scanInputRef.current?.focus(), 150);
  };

  const handleScanBarcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode.trim()) return;

    const term = scannedCode.trim().toLowerCase();
    const foundProduct = products.find(
      (p) =>
        (p.code && p.code.toLowerCase() === term) ||
        p.name.toLowerCase().includes(term)
    );

    if (foundProduct) {
      // Agregar nuevo renglón con este producto detectado
      setItems((prev) => [
        ...prev,
        {
          productId: foundProduct.id,
          quantity: foundProduct.isWeighted ? 5.0 : 10,
          unitCost: foundProduct.costPrice || 1000,
          batchNumber: `LOT-${Date.now().toString().slice(-4)}`,
          expirationDate: "",
        },
      ]);
      setScanMessage(`¡Producto escaneado exitosamente: ${foundProduct.name}!`);
      setScannedCode("");
      setTimeout(() => setScanMessage(null), 3000);
    } else {
      setScanMessage(`Código "${scannedCode}" no encontrado en el catálogo.`);
      setTimeout(() => setScanMessage(null), 3000);
    }
  };

  const handleAddItemRow = (productToAdd?: Product) => {
    const prod = productToAdd || (products.length > 0 ? products[0] : null);
    if (!prod) return;

    setItems((prev) => [
      ...prev,
      {
        productId: prod.id,
        quantity: prod.isWeighted ? 5.0 : 10,
        unitCost: prod.costPrice || 1000,
        batchNumber: `LOT-${Date.now().toString().slice(-4)}`,
        expirationDate: "",
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof PurchaseItemInput, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };

      if (field === "productId") {
        const prod = products.find((p) => p.id === value);
        if (prod) {
          copy[index].unitCost = prod.costPrice || 0;
          copy[index].quantity = prod.isWeighted ? 5.0 : 10;
        }
      }
      return copy;
    });
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierFormData.name) return alert("Ingresa el nombre del proveedor");

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...supplierFormData, activeUserRole: userRole }),
      });

      if (res.ok) {
        setIsSupplierModalOpen(false);
        setSupplierFormData({
          name: "",
          taxId: "",
          phone: "",
          email: "",
          address: "",
          notes: "",
        });
        fetchData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Error al crear el proveedor");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId || items.length === 0) {
      return alert("Selecciona un proveedor y agrega al menos un producto");
    }

    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: selectedSupplierId,
          invoiceNumber,
          notes,
          items,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        setSelectedSupplierId("");
        setInvoiceNumber("");
        setNotes("");
        setItems([]);
        fetchData();
      } else {
        alert(data.error || "Error al registrar la compra");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPurchaseAmount = items.reduce((acc, i) => acc + i.quantity * i.unitCost, 0);

  if (userRole === "CAJERO") {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in select-none">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
          <Truck className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Acceso Restringido</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-md">
            La sección de Compras y Control de Lotes a proveedores solo está habilitada para Encargados y Administradores.
          </p>
        </div>
        <a
          href="/pos"
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/50"
        >
          IR A PUNTO DE VENTA (POS)
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Compras, Proveedores & Control de Lotes
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestión de proveedores frecuentes, escáner de código de barras e ingreso rápido de lotes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSupplierModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>+ Nuevo Proveedor</span>
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true);
              if (items.length === 0) handleAddItemRow();
              setTimeout(() => scanInputRef.current?.focus(), 150);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Compra / Lote</span>
          </button>
        </div>
      </div>

      {/* Grid de Proveedores Frecuentes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-rose-400" />
            <span>Proveedores Frecuentes ({suppliers.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-400" />
                    <span>{s.name}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Frecuente
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400">
                  {s.taxId && (
                    <p className="font-mono text-slate-500">CUIT: {s.taxId}</p>
                  )}
                  {s.phone && (
                    <p className="flex items-center gap-1.5 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> {s.phone}
                    </p>
                  )}
                  {s.email && (
                    <p className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500" /> {s.email}
                    </p>
                  )}
                  {s.address && (
                    <p className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {s.address}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleOpenPurchaseForSupplier(s.id)}
                className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-rose-300 hover:text-white font-semibold text-xs border border-slate-800 hover:border-rose-500/40 flex items-center justify-center gap-2 transition"
              >
                <PackagePlus className="w-4 h-4 text-rose-400" />
                <span>+ Cargar Lote de {s.name.split(" ")[0]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Historial de Compras Registradas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <PackageCheck className="w-5 h-5 text-emerald-400" />
          <span>Historial de Compras & Recepción de Lotes</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Proveedor</th>
                <th className="py-3 px-4">N° Factura</th>
                <th className="py-3 px-4">Items & Lotes con Vencimiento</th>
                <th className="py-3 px-4 text-right">Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Cargando historial de compras...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No hay compras ni lotes ingresados aún.
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {p.supplier?.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {p.invoiceNumber || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {p.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 py-0.5">
                          <span className="font-semibold text-slate-200">
                            {item.product?.name}
                          </span>
                          <span>
                            ({item.quantity} {item.product?.unitType})
                          </span>
                          {item.batch?.batchNumber && (
                            <span className="font-mono text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              Lote: {item.batch.batchNumber}
                            </span>
                          )}
                          {item.batch?.expirationDate && (
                            <span className="text-rose-400 font-mono">
                              Vence: {new Date(item.batch.expirationDate).toLocaleDateString("es-AR")}
                            </span>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      ${p.totalAmount.toLocaleString("es-AR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear Proveedor */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSaveSupplier}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-xl text-white">Nuevo Proveedor Frecuente</h3>
              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nombre / Frigorífico / Distribuidora: *
              </label>
              <input
                type="text"
                required
                value={supplierFormData.name}
                onChange={(e) =>
                  setSupplierFormData({ ...supplierFormData, name: e.target.value })
                }
                placeholder="Ej: Frigorífico Cagnoli"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  CUIT / CUIL:
                </label>
                <input
                  type="text"
                  value={supplierFormData.taxId}
                  onChange={(e) =>
                    setSupplierFormData({ ...supplierFormData, taxId: e.target.value })
                  }
                  placeholder="30-70899888-2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Teléfono:
                </label>
                <input
                  type="text"
                  value={supplierFormData.phone}
                  onChange={(e) =>
                    setSupplierFormData({ ...supplierFormData, phone: e.target.value })
                  }
                  placeholder="+54 9 11..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Email de Pedidos:
              </label>
              <input
                type="email"
                value={supplierFormData.email}
                onChange={(e) =>
                  setSupplierFormData({ ...supplierFormData, email: e.target.value })
                }
                placeholder="pedidos@cagnoli.com.ar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Dirección / Depósito:
              </label>
              <input
                type="text"
                value={supplierFormData.address}
                onChange={(e) =>
                  setSupplierFormData({ ...supplierFormData, address: e.target.value })
                }
                placeholder="Av. Juan B. Justo 1200..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/40"
              >
                Guardar Proveedor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para Registrar Compra e Ingresar Lotes */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSavePurchase}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-6 h-6 text-rose-400" />
                <h3 className="font-bold text-xl text-white">Ingreso de Compra & Lotes</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Proveedor: *
                </label>
                <select
                  required
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="">Seleccionar Proveedor...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Número de Factura / Remito:
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Ej: FC-A-0001-00045892"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* SECCIÓN DE ESCÁNER DE CÓDIGO DE BARRAS / SKU */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Barcode className="w-4 h-4" /> Escanear Código de Barras / SKU de Producto:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="w-5 h-5 absolute left-3.5 top-2.5 text-slate-400" />
                  <input
                    ref={scanInputRef}
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleScanBarcode(e);
                      }
                    }}
                    placeholder="Pasa el lector o escribe el código (ej: F001, Q001)..."
                    className="w-full pl-11 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleScanBarcode}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Search className="w-4 h-4" /> Buscar / Agregar
                </button>
              </div>

              {scanMessage && (
                <div
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    scanMessage.includes("exitosamente")
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{scanMessage}</span>
                </div>
              )}
            </div>

            {/* Sección de Renglones de Productos y Lotes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Detalle de Productos Recibidos & Lotes ({items.length})
                </label>
                <button
                  type="button"
                  onClick={() => handleAddItemRow()}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Agregar Manualmente
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const prod = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-3 relative group"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Producto Seleccionado:
                          </label>
                          <select
                            value={item.productId}
                            onChange={(e) =>
                              handleItemChange(idx, "productId", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                          >
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.code ? `[${p.code}] ` : ""}
                                {p.name} ({p.isWeighted ? "KG" : "Unidad"})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Cantidad Recibida ({prod?.isWeighted ? "KG" : "Unidades"}):
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(idx, "quantity", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Costo Unitario ($):
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitCost}
                            onChange={(e) =>
                              handleItemChange(idx, "unitCost", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            N° de Lote:
                          </label>
                          <input
                            type="text"
                            value={item.batchNumber}
                            onChange={(e) =>
                              handleItemChange(idx, "batchNumber", e.target.value)
                            }
                            placeholder="LOT-2026-08"
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-rose-400 mb-1 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Fecha Vencimiento:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="date"
                              value={item.expirationDate}
                              onChange={(e) =>
                                handleItemChange(idx, "expirationDate", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                            />
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItemRow(idx)}
                                className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total final de compra */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-bold text-sm">Total de la Compra:</span>
              <span className="font-mono text-2xl font-extrabold text-emerald-400">
                ${totalPurchaseAmount.toLocaleString("es-AR")}
              </span>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/40"
              >
                Guardar Compra & Actualizar Stock
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
