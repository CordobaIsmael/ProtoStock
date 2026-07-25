"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  ShieldAlert,
  Calendar,
  RefreshCw,
  Scale,
} from "lucide-react";

interface DashboardData {
  metrics: {
    totalSalesToday: number;
    ticketsCountToday: number;
    avgTicket: number;
    lowStockCount: number;
    expiringBatchesCount: number;
  };
  lowStockProducts: any[];
  expiringBatches: any[];
  activeShift: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        const role = u.role || "CAJERO";
        setUserRole(role);
        if (role === "CAJERO") {
          router.replace("/pos");
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (userRole === "CAJERO") {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in select-none">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Acceso Restringido</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-md">
            El Panel General de Métricas y Administración no está disponible para el rol de Cajero.
          </p>
        </div>
        <Link
          href="/pos"
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/50"
        >
          IR A PUNTO DE VENTA (POS)
        </Link>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalSalesToday: 0,
    ticketsCountToday: 0,
    avgTicket: 0,
    lowStockCount: 0,
    expiringBatchesCount: 0,
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-rose-950 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Panel General de Control
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Resumen diario del comercio, estado de caja, stock bajo y lotes en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/pos"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Ir al POS / Caja</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ventas Hoy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ventas de Hoy
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              ${metrics.totalSalesToday.toLocaleString("es-AR")}
            </h2>
            <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Recaudación acumulada hoy
            </p>
          </div>
        </div>

        {/* Operaciones */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tickets Emitidos
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {metrics.ticketsCountToday}
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Promed: ${metrics.avgTicket.toLocaleString("es-AR", { maximumFractionDigits: 0 })} / ticket
            </p>
          </div>
        </div>

        {/* Alerta de Stock Bajo */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Stock Bajo / Crítico
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-amber-400 tracking-tight">
              {metrics.lowStockCount} Prod.
            </h2>
            <p className="text-xs text-slate-400 mt-2">Stock &le; mínimo requerido</p>
          </div>
        </div>

        {/* Lotes próximos a vencer */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Próximos Vencimientos
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-rose-400 tracking-tight">
              {metrics.expiringBatchesCount} Lotes
            </h2>
            <p className="text-xs text-slate-400 mt-2">Vencen en los próximos 30 días</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertas Dinámicas: Stock Bajo & Vencimientos */}
        <div className="lg:col-span-2 space-y-6">
          {/* TABLA 1: Productos con Stock Bajo */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">
                  Productos con Stock Crítico ({data?.lowStockProducts?.length || 0})
                </h3>
              </div>
              <Link href="/productos" className="text-xs text-rose-400 hover:underline font-medium">
                Ir a Productos
              </Link>
            </div>

            <div className="space-y-2.5">
              {data?.lowStockProducts?.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  ¡Excelente! No hay productos con stock por debajo del mínimo.
                </p>
              ) : (
                data?.lowStockProducts?.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                        <span>{prod.name}</span>
                        {prod.isWeighted && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                            KG
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Categoría: {prod.category?.name || "General"} &bull; SKU: {prod.code || "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                        Stock: {prod.currentStock.toFixed(prod.isWeighted ? 2 : 0)} {prod.unitType} (Mín: {prod.minStock})
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TABLA 2: Lotes Próximos a Vencer */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-lg text-white">
                  Lotes con Fecha de Vencimiento Cercana ({data?.expiringBatches?.length || 0})
                </h3>
              </div>
              <Link href="/compras" className="text-xs text-rose-400 hover:underline font-medium">
                Ir a Lotes & Compras
              </Link>
            </div>

            <div className="space-y-2.5">
              {data?.expiringBatches?.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No hay lotes con fecha de vencimiento próxima en los próximos 30 días.
                </p>
              ) : (
                data?.expiringBatches?.map((batch) => {
                  const expDate = new Date(batch.expirationDate);
                  const diffDays = Math.ceil(
                    (expDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                  );
                  const isExpired = diffDays <= 0;

                  return (
                    <div
                      key={batch.id}
                      className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-slate-200">
                          {batch.product?.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          Lote: {batch.batchNumber || "S/N"} &bull; Cantidad en lote: {batch.currentQuantity} {batch.product?.unitType}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                            isExpired
                              ? "bg-rose-600/30 text-rose-300 border-rose-500"
                              : diffDays <= 10
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {isExpired
                            ? "¡VENCIDO!"
                            : `Vence en ${diffDays} días (${expDate.toLocaleDateString("es-AR")})`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Estado de Caja Activa */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">Estado de Caja</h3>
              </div>
              {data?.activeShift ? (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  Abierta
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                  Cerrada
                </span>
              )}
            </div>

            {data?.activeShift ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Monto Inicial:</span>
                  <span className="font-mono text-slate-200 font-semibold">
                    ${data.activeShift.initialAmount.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Ventas en Efectivo:</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    ${data.activeShift.cashSalesTotal.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Tarjetas / MP:</span>
                  <span className="font-mono text-blue-400 font-semibold">
                    ${data.activeShift.cardSalesTotal.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between py-1 pt-2 font-bold">
                  <span className="text-white">Esperado en Caja (Efectivo):</span>
                  <span className="font-mono text-emerald-400 text-base">
                    ${data.activeShift.expectedAmount.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-400">No hay turno de caja abierto en este momento.</p>
              </div>
            )}

            <Link
              href="/caja"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            >
              <span>Gestión & Arqueo de Caja</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
