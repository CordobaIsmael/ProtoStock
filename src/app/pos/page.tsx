"use client";

import { useEffect, useState, useRef } from "react";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Banknote,
  CreditCard,
  QrCode,
  X,
  Printer,
  Scale,
  Barcode,
  RotateCcw,
  Receipt,
  FileText,
  Keyboard,
  Tablet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ThermalTicket from "@/components/pos/ThermalTicket";
import { printThermalTicketElement } from "@/utils/printTicket";

interface Product {
  id: string;
  code: string | null;
  name: string;
  unitType: string;
  isWeighted: boolean;
  costPrice: number;
  salePrice: number;
  currentStock: number;
  category?: { name: string };
}

interface CartItem {
  product: Product;
  quantity: number; // en Unidades o Kilos (ej. 0.250 para 250g)
  subtotal: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modal de peso/cantidad para fiambrería
  const [customWeightGrams, setCustomWeightGrams] = useState<string>("250");
  const [customQuantity, setCustomQuantity] = useState<string>("1");
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  // Modal de Pago
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("EFECTIVO");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [paperWidth, setPaperWidth] = useState<"58mm" | "80mm">("58mm");
  const [isFiscalTicket, setIsFiscalTicket] = useState<boolean>(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState<boolean>(false);
  const [disableVirtualKeyboard, setDisableVirtualKeyboard] = useState<boolean>(true);
  const [posPage, setPosPage] = useState<number>(1);
  const posItemsPerPage = 12;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [tenantId, setTenantId] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("tabletNoKeyboard");
    if (saved !== null) {
      setDisableVirtualKeyboard(saved === "true");
    }
    const stored = localStorage.getItem("activeUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.tenantId) setTenantId(u.tenantId);
      } catch (e) {}
    }
  }, []);

  const toggleTabletKeyboard = () => {
    const newVal = !disableVirtualKeyboard;
    setDisableVirtualKeyboard(newVal);
    localStorage.setItem("tabletNoKeyboard", String(newVal));
  };

  // Detección e interpretación automática de Código de Barras EAN-13 de Balanzas (Prefijo 20 o 28)
  const checkScaleBarcode = async (query: string) => {
    const cleanStr = query.trim();
    if (cleanStr.length === 13 && (cleanStr.startsWith("20") || cleanStr.startsWith("28")) && /^\d+$/.test(cleanStr)) {
      const plu = cleanStr.slice(2, 6); // Código del producto (dígitos 3 al 6)
      const valGramsOrAmount = parseInt(cleanStr.slice(6, 11), 10); // Dígitos 7 al 11

      try {
        const res = await fetch(`/api/products?onlyActive=true&search=${encodeURIComponent(plu)}&tenantId=${encodeURIComponent(tenantId)}`);
        if (res.ok) {
          const list: Product[] = await res.json();
          const matched = list.find((p) => p.code?.endsWith(plu) || p.code === plu) || list[0];

          if (matched) {
            let weightKg = valGramsOrAmount / 1000; // Si la balanza emite en Gramos (ej. 450g -> 0.450kg)
            if (matched.salePrice > 0 && valGramsOrAmount > 2000) {
              // Si la balanza está configurada para emitir importe ($)
              weightKg = valGramsOrAmount / matched.salePrice;
            }

            addToCart(matched, Math.max(0.001, weightKg));
            setSearch("");
            return true;
          }
        }
      } catch (err) {
        console.error("Error al procesar etiqueta de balanza:", err);
      }
    }
    return false;
  };

  // Cargar productos
  useEffect(() => {
    setPosPage(1);
    const clean = search.trim();
    if (clean.length === 13 && (clean.startsWith("20") || clean.startsWith("28"))) {
      checkScaleBarcode(clean);
    } else {
      fetchProducts();
    }
  }, [search, tenantId]);

  const posTotalPages = Math.max(1, Math.ceil(products.length / posItemsPerPage));
  const paginatedProducts = products.slice(
    (posPage - 1) * posItemsPerPage,
    posPage * posItemsPerPage
  );

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?onlyActive=true&search=${encodeURIComponent(search)}&tenantId=${encodeURIComponent(tenantId)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = (product: Product) => {
    setSelectedProduct(product);
    if (product.isWeighted || product.unitType === "KG") {
      setCustomWeightGrams("250"); // por defecto 250g de fiambrería
      setIsWeightModalOpen(true);
    } else {
      setCustomQuantity("1");
      addToCart(product, 1);
    }
  };

  const handleConfirmWeightedAdd = () => {
    if (!selectedProduct) return;
    const grams = parseFloat(customWeightGrams) || 0;
    const kg = grams / 1000;
    if (kg > 0) {
      addToCart(selectedProduct, kg);
    }
    setIsWeightModalOpen(false);
    setSelectedProduct(null);
  };

  const addToCart = (product: Product, quantityToAdd: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prev];
        const newQty = newCart[existingIndex].quantity + quantityToAdd;
        newCart[existingIndex] = {
          product,
          quantity: newQty,
          subtotal: newQty * product.salePrice,
        };
        return newCart;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: quantityToAdd,
            subtotal: quantityToAdd * product.salePrice,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.product.salePrice,
          };
        }
        return item;
      })
    );
  };

  const subtotalCart = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const totalCart = Math.max(0, subtotalCart - discount);

  const tenderedVal = parseFloat(cashTendered) || 0;
  const changeDue = tenderedVal - totalCart;

  const handleProcessSale = async () => {
    if (cart.length === 0) return;

    // Capturar de forma síncrona antes del fetch
    const enteredCashNum = parseFloat(cashTendered);
    const finalPaidCash =
      paymentMethod === "EFECTIVO" && !isNaN(enteredCashNum) && enteredCashNum > 0
        ? enteredCashNum
        : totalCart;
    const finalChange =
      paymentMethod === "EFECTIVO" ? Math.max(0, finalPaidCash - totalCart) : 0;

    setIsProcessing(true);
    try {
      let activeUserId = undefined;
      let activeUsername = undefined;
      const stored = localStorage.getItem("activeUser");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          activeUserId = u.id;
          activeUsername = u.username;
        } catch (e) {}
      }

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          paymentMethod,
          discount,
          activeUserId,
          activeUsername,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLastSale({
          ...data.sale,
          cashTenderedVal: finalPaidCash,
          changeDueVal: finalChange,
        });
        setCart([]);
        setIsPaymentModalOpen(false);
        setCashTendered("");
        setDiscount(0);
      } else {
        alert(data.error || "Error al procesar la venta");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al guardar la venta");
    } finally {
      setIsProcessing(false);
    }
  };

  const cartPanelContent = (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Carrito Header */}
      <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <ShoppingCart className="w-5 h-5 text-rose-400" />
          <h2 className="font-bold text-lg">Ticket de Venta</h2>
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Vaciar
            </button>
          )}
          <button
            onClick={() => setIsMobileCartOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lista de Items en Carrito */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-[50vh] lg:max-h-none">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center space-y-3 min-h-[160px]">
            <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-sm">No hay productos seleccionados.</p>
            <p className="text-xs text-slate-600">Haz clic en los productos para agregarlos.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product.id}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/50 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-200 leading-tight">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ${item.product.salePrice.toLocaleString("es-AR")} x{" "}
                    {item.product.isWeighted
                      ? `${(item.quantity * 1000).toFixed(0)}g (${item.quantity.toFixed(3)}kg)`
                      : `${item.quantity} u.`}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                {/* Controles de Cantidad */}
                <div className="flex items-center gap-1.5 bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity - (item.product.isWeighted ? 0.05 : 1)
                      )
                    }
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-white px-2">
                    {item.product.isWeighted
                      ? `${(item.quantity * 1000).toFixed(0)}g`
                      : item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity + (item.product.isWeighted ? 0.05 : 1)
                      )
                    }
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-extrabold text-emerald-400 text-sm">
                  ${item.subtotal.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resumen y Botón de Cobro */}
      <div className="p-4 bg-slate-850 border-t border-slate-800 space-y-3">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal:</span>
            <span className="font-mono text-slate-200">${subtotalCart.toLocaleString("es-AR")}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-rose-400">
              <span>Descuento:</span>
              <span className="font-mono">-${discount.toLocaleString("es-AR")}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-700/60 font-bold text-lg">
            <span className="text-white">Total a Cobrar:</span>
            <span className="font-extrabold text-2xl text-emerald-400 font-mono">
              ${totalCart.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        <button
          disabled={cart.length === 0}
          onClick={() => {
            setIsMobileCartOpen(false);
            setIsPaymentModalOpen(true);
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:hover:from-emerald-600 text-white font-extrabold text-base shadow-lg shadow-emerald-950/40 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Banknote className="w-5 h-5" />
          <span>COBRAR (${totalCart.toLocaleString("es-AR")})</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4 lg:gap-6 select-none animate-fade-in pb-16 lg:pb-0 relative">
      {/* Panel Izquierdo: Catálogo y Búsqueda */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl min-h-0">
        {/* Barra de Búsqueda y Filtros */}
        <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              inputMode={disableVirtualKeyboard ? "none" : "text"}
              placeholder="Buscar por nombre o código (F2)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 text-sm"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botón de Modo Tablet (Sin Teclado Virtual) */}
          <button
            type="button"
            onClick={toggleTabletKeyboard}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs border flex items-center gap-2 transition ${
              disableVirtualKeyboard
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 shadow-sm"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
            title="Activar/Desactivar ocultamiento del teclado virtual de la tablet"
          >
            <Tablet className="w-4 h-4 text-amber-400" />
            <span>
              {disableVirtualKeyboard ? "Modo Tablet (Sin Teclado)" : "Teclado OS Activo"}
            </span>
          </button>
        </div>

        {/* Lista de Productos con Paginación de 12 por página */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 content-start">
          {paginatedProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No hay productos coincidentes para mostrar.
            </div>
          ) : (
            paginatedProducts.map((prod) => (
              <button
                key={prod.id}
                onClick={() => openAddModal(prod)}
                className="group p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 flex flex-col justify-between text-left transition-all duration-150 relative overflow-hidden shadow-sm hover:shadow-md h-28 sm:h-32"
              >
                {prod.isWeighted && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Scale className="w-2.5 h-2.5" /> KG
                  </span>
                )}
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {prod.code || "SKU-" + prod.id.slice(0, 4)}
                  </span>
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-rose-400 transition-colors line-clamp-2 mt-0.5">
                    {prod.name}
                  </h3>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-800/60 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400">
                    Stk: {prod.currentStock.toFixed(prod.isWeighted ? 2 : 0)}
                  </span>
                  <span className="font-extrabold text-slate-100 text-sm sm:text-base text-rose-400">
                    ${prod.salePrice.toLocaleString("es-AR")}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Control de Paginación POS */}
        {products.length > 0 && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-slate-400 font-medium">
              Página <strong className="text-white">{posPage}</strong> de{" "}
              <strong className="text-white">{posTotalPages}</strong> ({products.length} ítems)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={posPage === 1}
                onClick={() => setPosPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                disabled={posPage >= posTotalPages}
                onClick={() => setPosPage((prev) => Math.min(prev + 1, posTotalPages))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition flex items-center gap-1 font-semibold"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel Derecho: Carrito en Escritorio */}
      <div className="hidden lg:flex w-[420px] shrink-0">
        {cartPanelContent}
      </div>

      {/* Botón Flotante para Carrito en Móvil y Tablet */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold shadow-2xl flex items-center justify-between border border-emerald-400/30 active:scale-95 transition"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              <span>Ver Ticket ({cart.length} ítems)</span>
            </div>
            <span className="text-xl font-mono">${totalCart.toLocaleString("es-AR")}</span>
          </button>
        </div>
      )}

      {/* Drawer Deslizable del Carrito en Móvil y Tablet */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsMobileCartOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-slate-900 rounded-t-3xl border-t border-slate-800 shadow-2xl overflow-hidden animate-fade-in p-2">
            {cartPanelContent}
          </div>
        </div>
      )}

      {/* Modal para ingresar peso en Fiambrería */}
      {isWeightModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-lg text-white">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setIsWeightModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                  Peso en Gramos:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode={disableVirtualKeyboard ? "none" : "decimal"}
                    value={customWeightGrams}
                    onChange={(e) => setCustomWeightGrams(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xl font-bold text-center focus:outline-none focus:border-amber-500"
                    placeholder="250"
                    autoFocus
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 font-bold text-sm">
                    Gramos
                  </span>
                </div>
              </div>

              {/* Accesos Rápidos de Gramos (Fiambrería) */}
              <div className="grid grid-cols-4 gap-2">
                {["100", "150", "200", "250", "300", "500", "750", "1000"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setCustomWeightGrams(g)}
                    className={`py-2 rounded-lg font-mono font-semibold text-xs border transition ${
                      customWeightGrams === g
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {g === "1000" ? "1 kg" : `${g}g`}
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-sm">
                <span className="text-slate-400">Subtotal estimado:</span>
                <span className="font-mono text-xl font-extrabold text-emerald-400">
                  $
                  {(
                    ((parseFloat(customWeightGrams) || 0) / 1000) *
                    selectedProduct.salePrice
                  ).toLocaleString("es-AR", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsWeightModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmWeightedAdd}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-950/40"
              >
                Agregar al Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cobro & Vuelto */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Banknote className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-xl text-white">Finalizar Venta</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selección Método de Pago */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase">
                Método de Pago:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "EFECTIVO", label: "Efectivo", icon: Banknote },
                  { id: "TARJETA_DEBITO", label: "Débito", icon: CreditCard },
                  { id: "TARJETA_CREDITO", label: "Crédito", icon: CreditCard },
                  { id: "TRANSFERENCIA", label: "Transferencia / MP", icon: QrCode },
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-3 rounded-xl border flex items-center gap-3 font-semibold text-sm transition ${
                        isSelected
                          ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-emerald-400" />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculadora de Vuelto en Efectivo */}
            {paymentMethod === "EFECTIVO" && (
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Pagó con (Efectivo):
                  </label>
                  <input
                    type="number"
                    inputMode={disableVirtualKeyboard ? "none" : "decimal"}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder={`Ej: ${totalCart}`}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xl font-bold focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  {/* Botones Rápidos de Billetes */}
                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setCashTendered(totalCart.toString())}
                      className="py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold font-mono border border-slate-700"
                    >
                      Exacto
                    </button>
                    {["1000", "2000", "5000", "10000", "20000", "50000"].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setCashTendered(bill)}
                        className={`py-1 rounded text-xs font-semibold font-mono border transition ${
                          cashTendered === bill
                            ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                        }`}
                      >
                        ${parseInt(bill).toLocaleString("es-AR")}
                      </button>
                    ))}
                  </div>
                </div>

                {tenderedVal > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-sm font-semibold text-slate-300">Vuelto a entregar:</span>
                    <span
                      className={`font-mono text-2xl font-extrabold ${
                        changeDue >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      ${changeDue >= 0 ? changeDue.toLocaleString("es-AR") : "Falta dinero"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Total final */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex justify-between items-center">
              <span className="text-slate-200 font-bold">Monto Total:</span>
              <span className="font-mono text-3xl font-extrabold text-emerald-400">
                ${totalCart.toLocaleString("es-AR")}
              </span>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
              >
                Cancelar
              </button>
              <button
                disabled={isProcessing || (paymentMethod === "EFECTIVO" && tenderedVal < totalCart)}
                onClick={handleProcessSale}
                className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>CONFIRMAR COBRO</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket / Confirmación de Venta Exitosa & Impresión Térmica */}
      {lastSale && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-fade-in max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <h3 className="font-extrabold text-xl text-white">¡Venta Registrada!</h3>
              </div>
              <button
                onClick={() => setLastSale(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Opciones de Formato de Ticket */}
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Ancho del Papel:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPaperWidth("58mm")}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      paperWidth === "58mm"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    58mm (Mini)
                  </button>
                  <button
                    onClick={() => setPaperWidth("80mm")}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      paperWidth === "80mm"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    80mm (Estándar)
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Tipo de Comprobante:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsFiscalTicket(false)}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      !isFiscalTicket
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Control Interno
                  </button>
                  <button
                    onClick={() => setIsFiscalTicket(true)}
                    className={`px-2.5 py-1 rounded font-bold transition ${
                      isFiscalTicket
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Vista AFIP (Factura C)
                  </button>
                </div>
              </div>
            </div>

            {/* Vista Previa del Ticket Térmico */}
            <div className="py-2 bg-slate-950 rounded-xl overflow-x-auto border border-slate-800">
              <ThermalTicket
                ticketNumber={lastSale.saleNumber}
                date={new Date(lastSale.createdAt || Date.now()).toLocaleString("es-AR")}
                cashierName={lastSale.user?.name || "Cajero"}
                customerName={lastSale.customerName || "Consumidor Final"}
                items={lastSale.items?.map((item: any) => ({
                  name: item.product?.name || "Producto",
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  subtotal: item.subtotal,
                  unitType: item.unitType || "UNIDAD",
                  isWeighted: item.product?.isWeighted || false,
                })) || []}
                totalAmount={lastSale.totalAmount}
                paymentMethod={lastSale.paymentMethod}
                cashTendered={lastSale.cashTenderedVal ?? lastSale.totalAmount}
                changeDue={lastSale.changeDueVal ?? 0}
                paperWidth={paperWidth}
                isFiscal={isFiscalTicket}
                caeNumber={isFiscalTicket ? "7429183928194" : undefined}
              />
            </div>

            {/* Acciones de Impresión */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => printThermalTicketElement("printable-thermal-ticket")}
                className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Imprimir Ticket</span>
              </button>
              <button
                onClick={() => setLastSale(null)}
                className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 transition"
              >
                Siguiente Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
