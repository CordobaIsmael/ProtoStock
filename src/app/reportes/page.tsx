"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Wallet,
  TrendingDown,
  Calendar,
  Award,
  PieChart,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Scale,
} from "lucide-react";

interface ReportData {
  period: string;
  summary: {
    totalRevenue: number;
    ticketsCount: number;
    avgTicket: number;
    totalCost: number;
    grossProfit: number;
    profitMarginPercentage: number;
    totalShrinkageLoss: number;
  };
  paymentBreakdown: {
    cash: number;
    card: number;
    transfer: number;
  };
  topProducts: Array<{
    name: string;
    category: string;
    quantity: number;
    revenue: number;
    profit: number;
    isWeighted: boolean;
  }>;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<string>("30days");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("CAJERO");

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
    fetchReports(period);
  }, [period]);

  const fetchReports = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?period=${selectedPeriod}`);
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
            El módulo de Métricas y Análisis Financiero está reservado para Encargados y Administradores.
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

  const summary = data?.summary || {
    totalRevenue: 0,
    ticketsCount: 0,
    avgTicket: 0,
    totalCost: 0,
    grossProfit: 0,
    profitMarginPercentage: 0,
    totalShrinkageLoss: 0,
  };

  const payment = data?.paymentBreakdown || { cash: 0, card: 0, transfer: 0 };
  const totalPaymentSum = payment.cash + payment.card + payment.transfer || 1;

  const cashPct = Math.round((payment.cash / totalPaymentSum) * 100);
  const cardPct = Math.round((payment.card / totalPaymentSum) * 100);
  const transferPct = Math.round((payment.transfer / totalPaymentSum) * 100);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-rose-400" />
            <span>Reportes, Ganancias & Métricas</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Análisis de rentabilidad, ganancias brutas, métodos de pago y ranking de productos.
          </p>
        </div>

        {/* Filtros de Período */}
        <div className="flex items-center gap-2 bg-slate-850 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setPeriod("today")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              period === "today"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Hoy
          </button>
          <button
            onClick={() => setPeriod("week")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              period === "week"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              period === "month"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Este Mes
          </button>
          <button
            onClick={() => setPeriod("30days")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              period === "30days"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Últimos 30 días
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Facturado */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Facturado
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              ${summary.totalRevenue.toLocaleString("es-AR")}
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              {summary.ticketsCount} tickets emitidos &bull; Prom: ${summary.avgTicket.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Ganancia Bruta Estimada */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ganancia Bruta
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              ${summary.grossProfit.toLocaleString("es-AR")}
            </h2>
            <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Margen del {summary.profitMarginPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Costo de Mercadería Vendida */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Costo Mercadería
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-slate-200 tracking-tight">
              ${summary.totalCost.toLocaleString("es-AR")}
            </h2>
            <p className="text-xs text-slate-400 mt-2">Costo reposición estimado</p>
          </div>
        </div>

        {/* Pérdidas por Mermas / Vencimiento */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pérdidas por Mermas
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-extrabold text-rose-400 tracking-tight">
              ${summary.totalShrinkageLoss.toLocaleString("es-AR")}
            </h2>
            <p className="text-xs text-slate-400 mt-2">Vencidos o dañados en período</p>
          </div>
        </div>
      </div>

      {/* Grid Principal: Métodos de Pago & Ranking de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desglose por Métodos de Pago */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-lg text-white">Métodos de Pago</h3>
            </div>
          </div>

          <div className="space-y-4">
            {/* Efectivo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-400" /> Efectivo
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  ${payment.cash.toLocaleString("es-AR")} ({cashPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${cashPct}%` }}
                ></div>
              </div>
            </div>

            {/* Tarjeta */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-400" /> Tarjeta (Débito/Crédito)
                </span>
                <span className="font-mono text-blue-400 font-bold">
                  ${payment.card.toLocaleString("es-AR")} ({cardPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${cardPct}%` }}
                ></div>
              </div>
            </div>

            {/* Mercado Pago / Transferencia */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-sky-400" /> Mercado Pago / Transferencia
                </span>
                <span className="font-mono text-sky-400 font-bold">
                  ${payment.transfer.toLocaleString("es-AR")} ({transferPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${transferPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking de Productos Más Vendidos */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-lg text-white">
                Ranking Top 10 Productos Más Vendidos
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-center">Cantidad Vendida</th>
                  <th className="py-3 px-4 text-right">Recaudación ($)</th>
                  <th className="py-3 px-4 text-right">Ganancia ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Calculando métricas de productos...
                    </td>
                  </tr>
                ) : data?.topProducts?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No hay registros de ventas en el período seleccionado.
                    </td>
                  </tr>
                ) : (
                  data?.topProducts?.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-amber-400">#{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-100">{prod.name}</td>
                      <td className="py-3 px-4 text-xs text-slate-400">{prod.category}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-200">
                        {prod.quantity.toFixed(prod.isWeighted ? 3 : 0)}{" "}
                        {prod.isWeighted ? "KG" : "Unid"}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-100">
                        ${prod.revenue.toLocaleString("es-AR")}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        ${prod.profit.toLocaleString("es-AR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
