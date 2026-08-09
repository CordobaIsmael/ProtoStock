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
  Eye,
  EyeOff,
  Edit3,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  KeyRound,
} from "lucide-react";

interface TenantUser {
  id: string;
  name: string;
  username: string;
  role: string;
  passwordHash?: string;
  isActive?: boolean;
}

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
  users?: TenantUser[];
  sales?: { totalAmount: number }[];
  _count?: { users: number; products: number; sales: number };
}

interface TenantDetailResponse {
  tenant: Tenant & {
    products: { id: string; name: string; salePrice: number; currentStock: number }[];
    sales: { id: string; totalAmount: number; createdAt: string; paymentMethod: string }[];
  };
  metrics: {
    totalRevenue: number;
    totalTickets: number;
    totalProducts: number;
    totalUsers: number;
  };
}

export default function SuperAdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});

  // Modal Alta de Nuevo Comercio
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Inspección / Métricas de Comercio
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTenantDetail, setSelectedTenantDetail] = useState<TenantDetailResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Modal Edición de Comercio & Admin Credentials
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    taxId: "",
    phone: "",
    email: "",
    address: "",
    plan: "PRO",
    monthlyFee: 25000,
    adminUserId: "",
    adminName: "",
    adminUsername: "",
    adminPassword: "",
  });

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
    const stored = localStorage.getItem("activeUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role !== "SUPERADMIN") {
          window.location.href = "/";
          return;
        }
      } catch (e) {}
    } else {
      window.location.href = "/login";
      return;
    }
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

  const handleOpenDetailModal = async (tenantId: string) => {
    setIsDetailModalOpen(true);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/superadmin/tenants/${tenantId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTenantDetail(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleOpenEditModal = (tenant: Tenant) => {
    const adminUser = tenant.users?.find((u) => u.role === "ADMIN") || tenant.users?.[0];
    setEditFormData({
      id: tenant.id,
      name: tenant.name || "",
      taxId: tenant.taxId || "",
      phone: tenant.phone || "",
      email: tenant.email || "",
      address: tenant.address || "",
      plan: tenant.plan || "PRO",
      monthlyFee: tenant.monthlyFee || 25000,
      adminUserId: adminUser?.id || "",
      adminName: adminUser?.name || "",
      adminUsername: adminUser?.username || "",
      adminPassword: adminUser?.passwordHash || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/superadmin/tenants/${editFormData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("¡Datos del comercio y credenciales de Administrador actualizadas con éxito!");
        setIsEditModalOpen(false);
        fetchTenants();
        if (selectedTenantDetail?.tenant.id === editFormData.id) {
          handleOpenDetailModal(editFormData.id);
        }
      } else {
        alert(data.error || "Error al actualizar comercio");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el comercio");
    } finally {
      setIsSubmitting(false);
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
    const isCurrentlySuspended = tenant.status === "SUSPENDIDO_POR_PAGO";
    const actionText = isCurrentlySuspended ? "reactivar" : "suspender por pago";
    if (
      !confirm(
        `¿Estás seguro de que deseas ${actionText} el comercio '${tenant.name}'?`
      )
    )
      return;

    try {
      const res = await fetch(`/api/superadmin/tenants/${tenant.id}/toggle`, {
        method: "PUT",
      });
      if (res.ok) {
        fetchTenants();
      } else {
        alert("Error al modificar estado del comercio");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenewCuota = async (tenant: Tenant) => {
    if (
      !confirm(
        `¿Confirmas el cobro de la cuota mensual de $${tenant.monthlyFee.toLocaleString(
          "es-AR"
        )} para '${tenant.name}'?\n\nEsto extenderá la fecha de vencimiento por 30 días.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/superadmin/tenants/${tenant.id}/renew`, {
        method: "PUT",
      });
      if (res.ok) {
        alert("¡Cuota registrada con éxito! La suscripción fue renovada por 30 días.");
        fetchTenants();
      } else {
        alert("Error al renovar la cuota");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  const activeTenantsCount = tenants.filter((t) => t.status === "ACTIVO").length;
  const suspendedTenantsCount = tenants.filter(
    (t) => t.status === "SUSPENDIDO_POR_PAGO"
  ).length;
  const totalMrr = tenants
    .filter((t) => t.status === "ACTIVO")
    .reduce((acc, t) => acc + t.monthlyFee, 0);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header SaaS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white shadow-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Panel SuperAdmin - Gestión SaaS ProtoStock
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Control de comercios clientes, cobranza de cuotas mensuales y métricas generales.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Dar de Alta Nuevo Comercio</span>
        </button>
      </div>

      {/* KPI Cards de Métricas SaaS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Comercios Activos</p>
            <h3 className="text-2xl font-mono font-extrabold text-emerald-400 mt-1">
              {activeTenantsCount} / {tenants.length}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Pausados por Pago</p>
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
            onClick={() => fetchTenants()}
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
                  <th className="py-3.5 px-4">Usuario Admin</th>
                  <th className="py-3.5 px-4">Plan & Cuota</th>
                  <th className="py-3.5 px-4 text-center">Vencimiento Cuota</th>
                  <th className="py-3.5 px-4 text-center">Estado Suscripción</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Cargando lista de comercios...
                    </td>
                  </tr>
                ) : filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No hay comercios registrados aún.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((tenant) => {
                    const isSuspended = tenant.status === "SUSPENDIDO_POR_PAGO";
                    const dueDateObj = tenant.dueDate ? new Date(tenant.dueDate) : null;
                    const isOverdue = dueDateObj ? dueDateObj < new Date() : false;
                    const adminUser = tenant.users?.find((u) => u.role === "ADMIN") || tenant.users?.[0];

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
                              <button
                                onClick={() => handleOpenDetailModal(tenant.id)}
                                className="font-bold text-slate-100 hover:text-rose-400 transition text-left flex items-center gap-1.5"
                              >
                                <span>{tenant.name}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                              </button>
                              <span className="text-xs text-slate-400 font-mono">
                                slug: {tenant.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {adminUser ? (
                            <div>
                              <p className="font-semibold text-slate-200 text-xs">{adminUser.name}</p>
                              <div className="flex items-center gap-1.5 font-mono text-xs text-rose-300">
                                <span>@{adminUser.username}</span>
                                {adminUser.passwordHash && (
                                  <span className="text-[10px] text-slate-500">
                                    ({visiblePasswords[adminUser.id] ? adminUser.passwordHash : "••••••"})
                                  </span>
                                )}
                                <button
                                  onClick={() => togglePasswordVisibility(adminUser.id)}
                                  className="text-slate-500 hover:text-white p-0.5"
                                >
                                  {visiblePasswords[adminUser.id] ? (
                                    <EyeOff className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-amber-400 font-mono">Sin Admin</span>
                          )}
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
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Botón Ver Métricas & Usuarios */}
                            <button
                              onClick={() => handleOpenDetailModal(tenant.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1"
                              title="Ver métricas de rendimiento y usuarios"
                            >
                              <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
                              <span>Métricas</span>
                            </button>

                            {/* Botón Editar Comercio & Admin */}
                            <button
                              onClick={() => handleOpenEditModal(tenant)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-1"
                              title="Editar comercio y credenciales de Administrador"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            {/* Botón Renovar Cuota (+30 días) */}
                            <button
                              onClick={() => handleRenewCuota(tenant)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition flex items-center gap-1"
                              title="Registrar cobro de cuota (+30 días)"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Cobrar</span>
                            </button>

                            {/* Botón Activar / Suspender */}
                            <button
                              onClick={() => handleToggleStatus(tenant)}
                              className={`p-1.5 rounded-xl text-xs font-extrabold border transition flex items-center ${
                                isSuspended
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                                  : "bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800"
                              }`}
                              title={isSuspended ? "Reactivar acceso al sistema" : "Pausar acceso por falta de pago"}
                            >
                              <Power className="w-3.5 h-3.5" />
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

      {/* MODAL 1: Alta de Nuevo Comercio */}
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Subdominio / Slug:
                </label>
                <input
                  type="text"
                  placeholder="fiambreria-sanjose"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono text-sm focus:outline-none focus:border-rose-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="STARTER">Starter Kiosco ($18.000 / mes)</option>
                  <option value="PRO">Pro Comercial ($25.000 / mes)</option>
                  <option value="ENTERPRISE">Enterprise Multi-Caja ($35.000 / mes)</option>
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
                  onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
              <p className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <User className="w-4 h-4" /> USUARIO ADMINISTRADOR DEL COMERCIO
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Usuario de Acceso: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="admin_sanjose"
                    value={formData.adminUsername}
                    onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Contraseña Inicial: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="clave123"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
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
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/50 disabled:opacity-50"
              >
                {isSubmitting ? "Registrando..." : "Crear Comercio & Administrador"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Inspección de Métricas & Usuarios del Comercio */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-extrabold text-rose-400 text-lg">
                  {selectedTenantDetail?.tenant.name.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    <span>{selectedTenantDetail?.tenant.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
                      {selectedTenantDetail?.tenant.plan}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    slug: {selectedTenantDetail?.tenant.slug} | Cuota: ${selectedTenantDetail?.tenant.monthlyFee.toLocaleString("es-AR")}/mes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {isLoadingDetail ? (
              <div className="py-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-rose-500 mb-2" />
                <p>Cargando métricas y datos del local...</p>
              </div>
            ) : selectedTenantDetail ? (
              <div className="space-y-6">
                {/* Cards de Métricas del Comercio */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase">
                      <TrendingUp className="w-4 h-4" /> Ventas Totales
                    </div>
                    <p className="text-xl font-mono font-extrabold text-white mt-1">
                      ${selectedTenantDetail.metrics.totalRevenue.toLocaleString("es-AR")}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase">
                      <ShoppingCart className="w-4 h-4" /> Total Tickets
                    </div>
                    <p className="text-xl font-mono font-extrabold text-white mt-1">
                      {selectedTenantDetail.metrics.totalTickets}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase">
                      <Package className="w-4 h-4" /> Productos
                    </div>
                    <p className="text-xl font-mono font-extrabold text-white mt-1">
                      {selectedTenantDetail.metrics.totalProducts}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase">
                      <Users className="w-4 h-4" /> Personal
                    </div>
                    <p className="text-xl font-mono font-extrabold text-white mt-1">
                      {selectedTenantDetail.metrics.totalUsers}
                    </p>
                  </div>
                </div>

                {/* Lista de Usuarios del Local */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-400" /> Personal & Credenciales de Acceso
                    </h4>
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleOpenEditModal(selectedTenantDetail.tenant);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Editar Administrador
                    </button>
                  </div>

                  <div className="bg-slate-850 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-700">
                        <tr>
                          <th className="py-2.5 px-3">Nombre</th>
                          <th className="py-2.5 px-3">Usuario (Login)</th>
                          <th className="py-2.5 px-3">Rol</th>
                          <th className="py-2.5 px-3">Contraseña</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 font-medium">
                        {(selectedTenantDetail.tenant.users || []).map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-semibold text-white">{u.name}</td>
                            <td className="py-2.5 px-3 font-mono text-rose-300">@{u.username}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-amber-300">
                                {u.role}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-emerald-400">
                              <div className="flex items-center gap-2">
                                <span>{visiblePasswords[u.id] ? u.passwordHash : "••••••••"}</span>
                                <button
                                  onClick={() => togglePasswordVisibility(u.id)}
                                  className="text-slate-400 hover:text-white p-0.5"
                                >
                                  {visiblePasswords[u.id] ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm"
                  >
                    Cerrar Vista
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL 3: Edición de Comercio & Credenciales Administrador */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleUpdateTenant}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-xl text-white">Editar Comercio & Administrador</h3>
              </div>
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
                  Nombre del Comercio: *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Plan de Suscripción:
                </label>
                <select
                  value={editFormData.plan}
                  onChange={(e) => setEditFormData({ ...editFormData, plan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="STARTER">Starter Kiosco ($18.000 / mes)</option>
                  <option value="PRO">Pro Comercial ($25.000 / mes)</option>
                  <option value="ENTERPRISE">Enterprise Multi-Caja ($35.000 / mes)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Cuota Mensual Pactada ($ ARS): *
                </label>
                <input
                  type="number"
                  required
                  value={editFormData.monthlyFee}
                  onChange={(e) => setEditFormData({ ...editFormData, monthlyFee: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  CUIT / Tax ID:
                </label>
                <input
                  type="text"
                  value={editFormData.taxId}
                  onChange={(e) => setEditFormData({ ...editFormData, taxId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Credenciales de Acceso Administrador */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
              <p className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" /> CREDENCIALES DEL ADMINISTRADOR DEL COMERCIO
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nombre del Administrador:
                </label>
                <input
                  type="text"
                  value={editFormData.adminName}
                  onChange={(e) => setEditFormData({ ...editFormData, adminName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Usuario de Acceso: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.adminUsername}
                    onChange={(e) => setEditFormData({ ...editFormData, adminUsername: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Nueva Contraseña: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.adminPassword}
                    onChange={(e) => setEditFormData({ ...editFormData, adminPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
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
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-950/50 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
