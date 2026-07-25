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
} from "lucide-react";

interface CashShift {
  id: string;
  openingDate: string;
  closingDate?: string;
  initialAmount: number;
  expectedAmount: number;
  actualAmount?: number;
  difference?: number;
  status: string;
  user: { name: string };
  cashMovements: {
    id: string;
    type: string;
    amount: number;
    concept: string;
    createdAt: string;
  }[];
}

export default function CashPage() {
  const [activeShift, setActiveShift] = useState<CashShift | null>(null);
  const [loading, setLoading] = useState(true);

  // Form para Apertura
  const [initialAmount, setInitialAmount] = useState("25000");

  // Form para Movimiento Manual (Ingreso / Egreso)
  const [movementType, setMovementType] = useState("EGRESO");
  const [movementAmount, setMovementAmount] = useState("");
  const [movementConcept, setMovementConcept] = useState("");

  // Form para Cierre
  const [countedAmount, setCountedAmount] = useState("");
  const [closeNotes, setCloseNotes] = useState("");

  useEffect(() => {
    fetchActiveShift();
  }, []);

  const fetchActiveShift = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/caja/active");
      if (res.ok) {
        const data = await res.json();
        setActiveShift(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShift = async () => {
    try {
      const res = await fetch("/api/caja/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initialAmount: parseFloat(initialAmount) || 0 }),
      });
      if (res.ok) {
        fetchActiveShift();
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
    if (!movementAmount || !movementConcept) return;
    try {
      const res = await fetch("/api/caja/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: movementType,
          amount: parseFloat(movementAmount),
          concept: movementConcept,
        }),
      });
      if (res.ok) {
        setMovementAmount("");
        setMovementConcept("");
        fetchActiveShift();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseShift = async () => {
    if (!countedAmount) return alert("Por favor ingresa el monto contado en caja");
    try {
      const res = await fetch("/api/caja/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actualAmount: parseFloat(countedAmount),
          notes: closeNotes,
        }),
      });
      if (res.ok) {
        fetchActiveShift();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Banner de Título */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Control de Caja & Turnos
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Apertura y cierre de turno, arqueo de dinero en efectivo e ingresos/egresos manuales.
          </p>
        </div>
        <div>
          {activeShift ? (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-sm">
              <Unlock className="w-4 h-4" /> CAJA ABIERTA
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 text-sm">
              <Lock className="w-4 h-4" /> CAJA CERRADA
            </span>
          )}
        </div>
      </div>

      {/* Si NO HAY caja abierta */}
      {!activeShift && !loading && (
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">Abrir Nuevo Turno de Caja</h2>
            <p className="text-slate-400 text-xs mt-1">
              Ingresa el monto de cambio inicial guardado en el cajón.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 text-left">
              Monto Inicial ($):
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
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 transition"
          >
            CONFIRMAR APERTURA DE CAJA
          </button>
        </div>
      )}

      {/* Si HAY caja abierta */}
      {activeShift && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumen del Turno Activo */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Detalle del Turno</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(activeShift.openingDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Responsable:</span>
                  <span className="text-slate-200 font-semibold">{activeShift.user?.name || "Juan Cajero"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Fondo Inicial:</span>
                  <span className="font-mono text-slate-200">${activeShift.initialAmount.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between py-1 pt-2 font-bold text-base">
                  <span className="text-white">Total Esperado en Efectivo:</span>
                  <span className="font-mono text-emerald-400">${activeShift.expectedAmount.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>

            {/* Arqueo y Cierre */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-lg text-white pb-2 border-b border-slate-800">
                Arqueo & Cierre de Caja
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
                        parseFloat(countedAmount) - activeShift.expectedAmount >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      $
                      {(
                        parseFloat(countedAmount) - activeShift.expectedAmount
                      ).toLocaleString("es-AR")}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleCloseShift}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40"
                >
                  REALIZAR CIERRE DE TURNO
                </button>
              </div>
            </div>
          </div>

          {/* Movimientos Manuales & Historial */}
          <div className="lg:col-span-2 space-y-6">
            {/* Form de Ingreso/Egreso */}
            <form
              onSubmit={handleAddMovement}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
            >
              <h3 className="font-bold text-lg text-white pb-2 border-b border-slate-800">
                Registrar Movimiento Manual de Efectivo
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
                    placeholder="Ej: Pago de Hielo o Pan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 shadow"
              >
                + Registrar Movimiento
              </button>
            </form>

            {/* Tabla de Movimientos */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-lg text-white pb-2 border-b border-slate-800">
                Movimientos del Turno
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Hora</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-3">Concepto</th>
                      <th className="py-2.5 px-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activeShift.cashMovements?.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono text-xs text-slate-400">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.type === "INGRESO" || m.type === "VENTA"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {m.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-200 font-medium">{m.concept}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold">
                          ${m.amount.toLocaleString("es-AR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
