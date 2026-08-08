"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Power,
  RefreshCw,
  ShieldCheck,
  Lock,
  ExternalLink,
  X,
  CreditCard,
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  taxId?: string;
  phone?: string;
  email?: string;
  address?: string;
  plan: string;
  status: string;
  dueDate?: string;
  monthlyFee: number;
  createdAt: string;
  users?: { id: string; name: string; username: string; role: string }[];
  _count?: { users: number; products: number; sales: number };
}

export default function SuperAdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal Alta de Nuevo Comercio
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    taxId: "",
    phone: "",
    email: "",
    address: "",
    plan: "PRO",
    monthlyFee: 25000,
    adminName: "",
    adminUsername: "",
    adminPassword: "",
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/superadmin/tenants");
      if (res.ok) {
        const data = await res.json();
        setTenants(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.adminUsername || !formData.adminPassword) {
      return alert("Por favor completa los campos requeridos");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/superadmin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(
          `¡Comercio '${data.tenant.name}' creado exitosamente!\n\nUsuario Admin: ${data.adminUser.username}\nContraseña: ${formData.adminPassword}`
        );
        setIsCreateModalOpen(false);
        setFormData({
          name: "",
          slug: "",
          taxId: "",
          phone: "",
          email: "",
          address: "",
          plan: "PRO",
          monthlyFee: 25000,
          adminName: "",
          adminUsername: "",
          adminPassword: "",
        });
        fetchTenants();
      } else {
        alert(data.error || "Error al crear el comercio");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al registrar el comercio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (tenant: Tenant) => {
    const nextStatus = tenant.status === "ACTIVO" ? "SUSPENDIDO_POR_PAGO" : "ACTIVO";
    const confirmMsg =
      nextStatus === "SUSPENDIDO_POR_PAGO"
        ? `¿Seguro que deseas SUSPENDER el acceso a '${tenant.name}' por falta de pago?`
        : `¿Seguro que deseas ACTIVAR el acceso a '${tenant.name}'?`;

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/superadmin/tenants/${tenant.id}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        fetchTenants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenewCuota = async (tenant: Tenant) => {
    if (!confirm(`¿Registrar cobro de cuota mensual de $${tenant.monthlyFee.toLocaleString("es-AR")} para '${tenant.name}' y extender +30 días?`)) return;

    try {
      const res = await fetch(`/api/superadmin/tenants/${tenant.id}/renew`, {
        method: "PUT",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        fetchTenants();
      } else {
        alert(data.error || "Error al renovar la cuota");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalTenants = tenants.length;
  const activeTenantsCount = tenants.filter((t) => t.status === "ACTIVO").length;
  const suspendedTenantsCount = tenants.filter((t) => t.status === "SUSPENDIDO_POR_PAGO").length;
  const totalMrr = tenants
    .filter((t) => t.status === "ACTIVO")
    .reduce((acc, t) => acc + (t.monthlyFee || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Banner Titular SuperAdmin */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Panel SuperAdmin - Gestión SaaS ProtoStock
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PROPIETARIO SAAS
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Administra tus clientes, cobros de cuota mensual, altas de nuevos almacenes y suspensiones por falta de pago.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-lg shadow-rose-950/40 transition active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Dar de Alta Nuevo Comercio</span>
        </button>
      </div>

      {/* Tarjetas KPI SaaS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Total Comercios</p>
            <h3 className="text-2xl font-mono font-extrabold text-white mt-1">{totalTenants}</h3>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Comercios Activos</p>
            <h3 className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">{activeTenantsCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Suspendidos por Pago</p>
            <h3 className="text-2xl font-mono font-extrabold text-rose-400 mt-1">{suspendedTenantsCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Facturación Mensual (MRR)</p>
            <h3 className="text-2xl font-mono font-extrabold text-amber-400 mt-1">
              ${totalMrr.toLocaleString("es-AR")}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Buscador & Tabla de Comercios */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar comercio por nombre o subdominio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 text-sm"
            />
          </div>

          <button
            onClick={fetchTenants}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Recargar Lista"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Tabla SaaS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Comercio / Almacén</th>
                  <th className="py-3.5 px-4">Plan & Cuota</th>
                  <th className="py-3.5 px-4 text-center">Vencimiento Cuota</th>
                  <th className="py-3.5 px-4 text-center">Estado Suscripción</th>
                  <th className="py-3.5 px-4 text-right">Acciones de Cobro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Cargando lista de comercios...
                    </td>
                  </tr>
                ) : filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No hay comercios registrados aún.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((tenant) => {
                    const isSuspended = tenant.status === "SUSPENDIDO_POR_PAGO";
                    const dueDateObj = tenant.dueDate ? new Date(tenant.dueDate) : null;
                    const isOverdue = dueDateObj ? dueDateObj < new Date() : false;

                    return (
                      <tr
                        key={tenant.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          isSuspended ? "bg-rose-950/20" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-rose-400 text-base">
                              {tenant.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-100">{tenant.name}</p>
                              <span className="text-xs text-slate-400 font-mono">
                                slug: {tenant.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700 mr-2">
                            {tenant.plan}
                          </span>
                          <span className="font-mono font-bold text-slate-200 text-sm">
                            ${tenant.monthlyFee.toLocaleString("es-AR")}/mes
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-xs">
                          {dueDateObj ? (
                            <span
                              className={`px-2.5 py-1 rounded-lg border font-bold ${
                                isOverdue
                                  ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                  : "bg-slate-800 text-slate-300 border-slate-700"
                              }`}
                            >
                              {dueDateObj.toLocaleDateString("es-AR")}
                            </span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {isSuspended ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <XCircle className="w-3.5 h-3.5" /> SUSPENDIDO POR PAGO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVO
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Botón Renovar Cuota (+30 días) */}
                            <button
                              onClick={() => handleRenewCuota(tenant)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                              title="Registrar cobro de cuota mensual (+30 días)"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Renovar Cuota</span>
                            </button>

                            {/* Botón Activar / Suspender */}
                            <button
                              onClick={() => handleToggleStatus(tenant)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition flex items-center gap-1.5 ${
                                isSuspended
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-sm"
                                  : "bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800"
                              }`}
                              title={isSuspended ? "Reactivar acceso al sistema" : "Pausar acceso por falta de pago"}
                            >
                              <Power className="w-3.5 h-3.5" />
                              <span>{isSuspended ? "Reactivar" : "Suspender"}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para Dar de Alta Nuevo Comercio */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateTenant}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-rose-400" />
                <h3 className="font-bold text-xl text-white">Alta de Nuevo Comercio Cliente</h3>
              </div>
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
                  Nombre del Comercio: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fiambrería San José"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Subdominio / Slug:
                </label>
                <input
                  type="text"
                  placeholder="ej: fiambreria-sanjose"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Plan de Suscripción:
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="STARTER">Starter ($20.000 / mes)</option>
                  <option value="PRO">Pro Comercial ($25.000 / mes)</option>
                  <option value="ENTERPRISE">Enterprise ($40.000 / mes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Cuota Mensual Pactada ($ ARS):
                </label>
                <input
                  type="number"
                  required
                  value={formData.monthlyFee}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs font-bold text-amber-300 uppercase mb-3">
                👤 Usuario Administrador del Comercio
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Usuario de Acceso: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: admin_sanjose"
                    value={formData.adminUsername}
                    onChange={(e) =>
                      setFormData({ ...formData, adminUsername: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Contraseña Inicial: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej: SanJose2026"
                    value={formData.adminPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, adminPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
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
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-extrabold shadow-lg shadow-rose-950/40"
              >
                {isSubmitting ? "Registrando..." : "Crear Comercio & Administrador"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
