"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  PlusCircle,
  MinusCircle,
  FileText,
  Clock,
  UserCheck,
  Building2,
  Receipt,
  ShieldAlert,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Power,
} from "lucide-react";

interface ActiveUser {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface SaleItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: { name: string };
}

interface Sale {
  id: string;
  saleNumber: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  customerName?: string;
  items?: SaleItem[];
}

interface CashShift {
  id: string;
  openingDate: string;
  closingDate?: string;
  initialAmount: number;
  expectedAmount: number;
  actualAmount?: number;
  difference?: number;
  status: string;
  notes?: string;
  user: { id: string; name: string; username: string; role: string };
  cashMovements: {
    id: string;
    type: string;
    amount: number;
    concept: string;
    createdAt: string;
  }[];
  sales?: Sale[];
}

export default function CashPage() {
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
  const [activeTab, setActiveTab] = useState<"my-shift" | "all-shifts" | "history">("my-shift");

  // Mi Caja Activa
  const [myShift, setMyShift] = useState<CashShift | null>(null);
  const [loadingMyShift, setLoadingMyShift] = useState(true);

  // Monitor Multi-Caja (Todas las Cajas Abiertas)
  const [openShifts, setOpenShifts] = useState<CashShift[]>([]);
  const [loadingOpenShifts, setLoadingOpenShifts] = useState(false);

  // Form Apertura
  const [initialAmount, setInitialAmount] = useState("25000");

  // Form Movimiento Manual (Ingreso / Egreso)
  const [movementType, setMovementType] = useState("EGRESO");
  const [movementAmount, setMovementAmount] = useState("");
  const [movementConcept, setMovementConcept] = useState("");

  // Form Cierre Propio
  const [countedAmount, setCountedAmount] = useState("");
  const [closeNotes, setCloseNotes] = useState("");

  // Modal para Cierre Forzoso por Admin
  const [forceCloseShiftTarget, setForceCloseShiftTarget] = useState<CashShift | null>(null);
  const [forceCountedAmount, setForceCountedAmount] = useState("");
  const [forceCloseNotes, setForceCloseNotes] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("activeUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setActiveUser(u);
        fetchMyShift(u.id);
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultUser = {
        id: "admin-demo",
        name: "Administrador General",
        username: "admin",
        role: "ADMIN",
      };
      setActiveUser(defaultUser);
      fetchMyShift(defaultUser.id);
    }
  }, []);

  const fetchMyShift = async (userId: string) => {
    setLoadingMyShift(true);
    try {
      const res = await fetch(`/api/caja/active?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMyShift(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMyShift(false);
    }
  };

  const fetchOpenShifts = async () => {
    setLoadingOpenShifts(true);
    try {
      const res = await fetch("/api/caja/open-shifts");
      if (res.ok) {
        const data = await res.json();
        setOpenShifts(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOpenShifts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "all-shifts") {
      fetchOpenShifts();
    }
  }, [activeTab]);

  const handleOpenShift = async () => {
    if (!activeUser) return;
    try {
      const res = await fetch("/api/caja/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialAmount: parseFloat(initialAmount) || 0,
          userId: activeUser.id,
        }),
      });
      if (res.ok) {
        fetchMyShift(activeUser.id);
        if (activeTab === "all-shifts") fetchOpenShifts();
      } else {
        const data = await res.json();
        alert(data.error || "Error al abrir la caja");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movementAmount || !movementConcept || !activeUser || !myShift) return;
    try {
      const res = await fetch("/api/caja/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: movementType,
          amount: parseFloat(movementAmount),
          concept: movementConcept,
          userId: activeUser.id,
          shiftId: myShift.id,
        }),
      });
      if (res.ok) {
        setMovementAmount("");
        setMovementConcept("");
        fetchMyShift(activeUser.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseShift = async () => {
    if (!countedAmount || !activeUser || !myShift)
      return alert("Por favor ingresa el monto contado en tu caja");

    try {
      const res = await fetch("/api/caja/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shiftId: myShift.id,
          actualAmount: parseFloat(countedAmount),
          notes: closeNotes,
          activeUserRole: activeUser.role,
        }),
      });
      if (res.ok) {
        setCountedAmount("");
        setCloseNotes("");
        fetchMyShift(activeUser.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleForceCloseShift = async () => {
    if (!forceCloseShiftTarget || !activeUser || activeUser.role !== "ADMIN") return;
    try {
      const res = await fetch("/api/caja/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shiftId: forceCloseShiftTarget.id,
          actualAmount: parseFloat(forceCountedAmount) || forceCloseShiftTarget.expectedAmount,
          notes: forceCloseNotes || "Cierre Forzoso por Administrador General",
          activeUserRole: "ADMIN",
        }),
      });

      if (res.ok) {
        setForceCloseShiftTarget(null);
        setForceCountedAmount("");
        setForceCloseNotes("");
        fetchOpenShifts();
        if (activeUser.id === forceCloseShiftTarget.user?.id) {
          fetchMyShift(activeUser.id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = activeUser?.role === "ADMIN";
  const isEncargado = activeUser?.role === "ENCARGADO";

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Banner de Título & Control Multi-Caja */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Control de Caja & Turnos Multi-Caja
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
              {activeUser?.role || "CAJERO"}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Gestión independiente de caja por empleado, arqueos, retiros y monitoreo de cajas abiertas en tiempo real.
          </p>
        </div>

        {/* Badges de Estado */}
        <div className="flex items-center gap-3">
          {myShift ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs sm:text-sm">
              <Unlock className="w-4 h-4 text-emerald-400" /> MI CAJA: ABIERTA
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 text-xs sm:text-sm">
              <Lock className="w-4 h-4 text-rose-400" /> MI CAJA: CERRADA
            </span>
          )}
        </div>
      </div>

      {/* Pestañas de Navegación de Caja */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("my-shift")}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === "my-shift"
              ? "border-rose-500 text-rose-400 bg-slate-900/60"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Mi Caja Actual ({activeUser?.name || "Usuario"})</span>
        </button>

        {(isAdmin || isEncargado) && (
          <button
            onClick={() => setActiveTab("all-shifts")}
            className={`px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "all-shifts"
                ? "border-rose-500 text-rose-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Monitor Multi-Caja (Cajas Abiertas en Vivo)</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {openShifts.length}
            </span>
          </button>
        )}
      </div>

      {/* TAB 1: MI CAJA ACTUAL */}
      {activeTab === "my-shift" && (
        <div className="space-y-6">
          {/* Si NO TIENE caja abierta */}
          {!myShift && !loadingMyShift && (
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Abrir Mi Turno de Caja</h2>
                <p className="text-slate-400 text-xs mt-1">
                  Hola <strong className="text-white">{activeUser?.name}</strong>, ingresa el dinero de cambio inicial guardado en tu cajón.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 text-left">
                  Monto Inicial en Efectivo ($):
                </label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xl font-bold text-center focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={handleOpenShift}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 transition active:scale-95"
              >
                CONFIRMAR APERTURA DE MI CAJA
              </button>
            </div>
          )}

          {/* Si SI TIENE caja abierta */}
          {myShift && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resumen del Turno & Arqueo */}
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Detalle de Mi Caja</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(myShift.openingDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Cajero Responsable:</span>
                      <span className="text-slate-200 font-semibold">{myShift.user?.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Fondo Inicial:</span>
                      <span className="font-mono text-slate-200">${myShift.initialAmount.toLocaleString("es-AR")}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Ventas del Turno ({myShift.sales?.length || 0}):</span>
                      <span className="font-mono text-slate-200">
                        ${(myShift.sales?.reduce((acc, s) => acc + s.totalAmount, 0) || 0).toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 pt-2 font-bold text-base">
                      <span className="text-white">Total Esperado en Efectivo:</span>
                      <span className="font-mono text-emerald-400">${myShift.expectedAmount.toLocaleString("es-AR")}</span>
                    </div>
                  </div>
                </div>

                {/* Arqueo y Cierre */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <h3 className="font-bold text-lg text-white pb-2 border-b border-slate-800">
                    Arqueo & Cierre de Mi Turno
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Efectivo Contado en Cajón ($):
                      </label>
                      <input
                        type="number"
                        value={countedAmount}
                        onChange={(e) => setCountedAmount(e.target.value)}
                        placeholder="Monto total contado..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-lg font-bold focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {countedAmount && (
                      <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex justify-between items-center text-sm font-mono">
                        <span className="text-slate-400">Diferencia de Caja:</span>
                        <span
                          className={`font-bold ${
                            parseFloat(countedAmount) - myShift.expectedAmount >= 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          $
                          {(
                            parseFloat(countedAmount) - myShift.expectedAmount
                          ).toLocaleString("es-AR")}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handleCloseShift}
                      className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 active:scale-95 transition"
                    >
                      CERRAR Y ARQUEAR MI CAJA
                    </button>
                  </div>
                </div>
              </div>

              {/* Movimientos Manuales & Historial de Ventas del Turno */}
              <div className="lg:col-span-2 space-y-6">
                {/* Form de Ingreso/Egreso */}
                <form
                  onSubmit={handleAddMovement}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
                >
                  <h3 className="font-bold text-lg text-white pb-2 border-b border-slate-800">
                    Registrar Movimiento Manual en Mi Caja
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Tipo:
                      </label>
                      <select
                        value={movementType}
                        onChange={(e) => setMovementType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                      >
                        <option value="EGRESO">Egreso (Retiro / Pago)</option>
                        <option value="INGRESO">Ingreso Adicional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Monto ($):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={movementAmount}
                        onChange={(e) => setMovementAmount(e.target.value)}
                        placeholder="Ej. 1500"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                        Concepto / Motivo:
                      </label>
                      <input
                        type="text"
                        required
                        value={movementConcept}
                        onChange={(e) => setMovementConcept(e.target.value)}
                        placeholder="Ej: Pago a Proveedor"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 shadow"
                  >
                    + Registrar Movimiento en Mi Caja
                  </button>
                </form>

                {/* Historial de Ventas del Turno Actual */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-rose-400" />
                      <h3 className="font-bold text-lg text-white">Ventas Realizadas en Mi Turno</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      Total: ${myShift.sales?.reduce((a, b) => a + b.totalAmount, 0).toLocaleString("es-AR")}
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] font-semibold sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">Ticket #</th>
                          <th className="py-2.5 px-3">Hora</th>
                          <th className="py-2.5 px-3">Método Pago</th>
                          <th className="py-2.5 px-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {!myShift.sales || myShift.sales.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-500 text-xs">
                              Aún no has registrado ventas en este turno.
                            </td>
                          </tr>
                        ) : (
                          myShift.sales.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-800/40">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                                #{s.saleNumber}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-xs text-slate-400">
                                {new Date(s.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                  {s.paymentMethod}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                                ${s.totalAmount.toLocaleString("es-AR")}
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
          )}
        </div>
      )}

      {/* TAB 2: MONITOR MULTI-CAJA (Solo Admin y Encargado) */}
      {activeTab === "all-shifts" && (isAdmin || isEncargado) && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <h3 className="font-bold text-white text-lg">Monitor Multi-Caja en Tiempo Real</h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Estado del efectivo esperado y ventas activas de cada empleado en el local.
              </p>
            </div>
            <button
              onClick={fetchOpenShifts}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-2 text-xs font-semibold"
            >
              <RefreshCw className="w-4 h-4" /> Actualizar Cajas
            </button>
          </div>

          {loadingOpenShifts ? (
            <div className="p-12 text-center text-slate-500">Cargando monitor multi-caja...</div>
          ) : openShifts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
              No hay turnos de caja abiertos en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-rose-400 text-sm">
                          {shift.user?.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{shift.user?.name}</h4>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {shift.user?.role}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Unlock className="w-3 h-3" /> Abierta
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Apertura:</span>
                        <span className="text-slate-200">
                          {new Date(shift.openingDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Fondo Inicial:</span>
                        <span className="text-slate-200">${shift.initialAmount.toLocaleString("es-AR")}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Ventas ({shift.sales?.length || 0}):</span>
                        <span className="text-slate-200">
                          ${(shift.sales?.reduce((a, b) => a + b.totalAmount, 0) || 0).toLocaleString("es-AR")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800">
                        <span className="text-white">Efectivo Esperado:</span>
                        <span className="text-emerald-400">${shift.expectedAmount.toLocaleString("es-AR")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Admin */}
                  {isAdmin && (
                    <div className="pt-3 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setForceCloseShiftTarget(shift);
                          setForceCountedAmount(String(shift.expectedAmount));
                        }}
                        className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30 flex items-center justify-center gap-1.5 transition"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>Forzar Cierre de Caja</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal para Forzar Cierre de Caja (Solo Admin) */}
      {forceCloseShiftTarget && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-lg text-white">Forzar Cierre de Caja</h3>
              </div>
              <button
                onClick={() => setForceCloseShiftTarget(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Caja a cerrar: <strong className="text-white">{forceCloseShiftTarget.user?.name}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Efectivo Arqueado ($):
              </label>
              <input
                type="number"
                value={forceCountedAmount}
                onChange={(e) => setForceCountedAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Notas del Administrador:
              </label>
              <input
                type="text"
                value={forceCloseNotes}
                onChange={(e) => setForceCloseNotes(e.target.value)}
                placeholder="Ej: Cierre forzoso por cambio de turno"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setForceCloseShiftTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleForceCloseShift}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg shadow-rose-950/40"
              >
                Confirmar Cierre Forzoso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
