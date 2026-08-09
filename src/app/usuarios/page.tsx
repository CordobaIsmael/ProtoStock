"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Shield,
  UserPlus,
  Lock,
  KeyRound,
  CheckCircle,
  Clock,
  Activity,
  X,
  Eye,
  EyeOff,
  Edit3,
  ShieldAlert,
  Building2,
} from "lucide-react";

interface UserItem {
  id: string;
  tenantId?: string | null;
  name: string;
  username: string;
  email: string | null;
  role: string;
  passwordHash?: string;
  isActive: boolean;
  createdAt: string;
  tenant?: { id: string; name: string; slug: string } | null;
}

interface AuditItem {
  id: string;
  action: string;
  entity: string;
  details: string | null;
  createdAt: string;
  user?: { name: string; username: string; role: string; tenant?: { name: string } };
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditItem[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "audit">("users");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("CAJERO");
  const [tenantId, setTenantId] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});

  // Modal para nuevo usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "CAJERO",
  });

  // Modal para cambiar contraseña
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserItem | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    let role = "CAJERO";
    let tid = "";
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        role = u.role || "CAJERO";
        tid = u.tenantId || "";
        setUserRole(role);
        setTenantId(tid);
        setIsSuperAdmin(role === "SUPERADMIN");
      } catch (e) {
        console.error(e);
      }
    }
    fetchData(tid, role);
  }, []);

  const fetchData = async (currentTenantId?: string, currentRole?: string) => {
    setLoading(true);
    const tid = currentTenantId !== undefined ? currentTenantId : tenantId;
    const role = currentRole !== undefined ? currentRole : userRole;
    try {
      const [resUsers, resAudit] = await Promise.all([
        fetch(`/api/users?tenantId=${encodeURIComponent(tid)}&userRole=${encodeURIComponent(role)}`),
        fetch(`/api/audit?tenantId=${encodeURIComponent(tid)}&userRole=${encodeURIComponent(role)}`),
      ]);

      if (resUsers.ok) setUsers(await resUsers.json());
      if (resAudit.ok) setAuditLogs(await resAudit.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      return alert("Acceso restringido a Administradores.");
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, activeUserRole: userRole, tenantId }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        setFormData({ name: "", username: "", email: "", password: "", role: "CAJERO" });
        fetchData();
      } else {
        alert(data.error || "Error al crear el usuario");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForPassword || !newPassword) return;

    try {
      const res = await fetch("/api/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: selectedUserForPassword.id,
          newPassword,
          activeUserRole: userRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Contraseña de ${selectedUserForPassword.name} actualizada con éxito.`);
        setIsPasswordModalOpen(false);
        setSelectedUserForPassword(null);
        setNewPassword("");
        fetchData();
      } else {
        alert(data.error || "Error al cambiar la contraseña");
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Shield className="w-3 h-3 text-purple-400" /> SuperAdmin SaaS
          </span>
        );
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Shield className="w-3 h-3" /> Administrador
          </span>
        );
      case "ENCARGADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <KeyRound className="w-3 h-3" /> Encargado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Users className="w-3 h-3" /> Cajero
          </span>
        );
    }
  };

  const canManageUsers = userRole === "ADMIN" || isSuperAdmin;
  const isEncargado = userRole === "ENCARGADO";
  const isCashier = userRole === "CAJERO";

  // Si es Cajero, bloquear la página completa
  if (isCashier) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in select-none">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Acceso Restringido</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-md">
            La gestión de usuarios y permisos está reservada para Administradores y Encargados.
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
      {/* Banner de Título */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Usuarios, Permisos & Auditoría
            </h1>
            {isSuperAdmin && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-purple-400" /> Vista Global SuperAdmin (Todos los Comercios)
              </span>
            )}
            {isEncargado && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Modo Lectura de Usuarios (Encargado)
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {isSuperAdmin
              ? "Supervisión consolidada de todos los comercios cliente y sus empleados registrados."
              : canManageUsers
              ? "Administración exclusiva del personal de tu comercio."
              : "Consulta de personal activo en el local."}
          </p>
        </div>

        {canManageUsers ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition active:scale-95 self-start sm:self-auto"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nuevo Usuario</span>
          </button>
        ) : (
          <div className="text-xs text-amber-400 font-medium flex items-center gap-2 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
            <Lock className="w-4 h-4" />
            <span>Crear usuarios y cambiar contraseñas requiere rol Administrador.</span>
          </div>
        )}
      </div>

      {/* Tabs para alternar entre Usuarios y Registro de Auditoría */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "users"
              ? "border-rose-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" /> Lista de Usuarios ({users.length})
        </button>
        {canManageUsers && (
          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === "audit"
                ? "border-rose-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-4 h-4" /> Registro de Auditoría ({auditLogs.length})
          </button>
        )}
      </div>

      {/* TAB 1: Lista de Usuarios */}
      {activeTab === "users" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Nombre Completo</th>
                  <th className="py-3.5 px-4">Usuario</th>
                  {isSuperAdmin && <th className="py-3.5 px-4">Comercio / Local</th>}
                  <th className="py-3.5 px-4">Rol / Nivel</th>
                  {canManageUsers && <th className="py-3.5 px-4">Contraseña</th>}
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  {canManageUsers && <th className="py-3.5 px-4 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 8 : canManageUsers ? 7 : 5} className="py-8 text-center text-slate-500">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 8 : canManageUsers ? 7 : 5} className="py-8 text-center text-slate-500">
                      No hay usuarios registrados en este comercio.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">{u.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">@{u.username}</td>
                      {isSuperAdmin && (
                        <td className="py-3.5 px-4">
                          {u.tenant?.name ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-rose-300 border border-slate-700">
                              🏢 {u.tenant.name}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-950/50 text-purple-300 border border-purple-800/40">
                              🛡️ Sistema Global (SaaS)
                            </span>
                          )}
                        </td>
                      )}
                      <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                      {canManageUsers && (
                        <td className="py-3.5 px-4 font-mono text-xs text-rose-300">
                          <div className="flex items-center gap-2">
                            <span>
                              {visiblePasswords[u.id] ? u.passwordHash : "••••••••"}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="text-slate-400 hover:text-white p-1"
                              title={visiblePasswords[u.id] ? "Ocultar" : "Ver contraseña"}
                            >
                              {visiblePasswords[u.id] ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      )}
                      <td className="py-3.5 px-4 text-slate-400 text-xs">{u.email || "-"}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                          Activo
                        </span>
                      </td>
                      {canManageUsers && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedUserForPassword(u);
                              setNewPassword("");
                              setIsPasswordModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-rose-400" />
                            <span>Cambiar Contraseña</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Historial de Auditoría (solo ADMIN & SUPERADMIN) */}
      {activeTab === "audit" && canManageUsers && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-4 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-850 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Usuario</th>
                  {isSuperAdmin && <th className="py-3 px-4">Comercio</th>}
                  <th className="py-3 px-4">Acción</th>
                  <th className="py-3 px-4">Entidad</th>
                  <th className="py-3 px-4">Detalle auditado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="py-8 text-center text-slate-500">
                      No hay registros de auditoría guardados aún.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {new Date(log.createdAt).toLocaleString("es-AR")}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {log.user?.name || "Sistema"}
                      </td>
                      {isSuperAdmin && (
                        <td className="py-3 px-4 text-xs text-rose-300 font-semibold">
                          {log.user?.tenant?.name || "Global"}
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-rose-300 uppercase">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-400">
                        {log.entity}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-300">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Crear Usuario (solo ADMIN & SUPERADMIN) */}
      {isModalOpen && canManageUsers && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-xl text-white">Nuevo Usuario</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nombre Completo: *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: María González"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Usuario (Login): *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="mariag"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Contraseña / PIN: *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="******"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Rol / Nivel de Permisos: *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-rose-500"
              >
                <option value="CAJERO">Cajero (Solo POS y Apertura/Cierre de su Caja)</option>
                <option value="ENCARGADO">Encargado (Productos, Stock, Lotes y Compras)</option>
                <option value="ADMIN">Administrador de Local (Acceso total al comercio)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/40"
              >
                Crear Usuario
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para Cambiar Contraseña (solo ADMIN & SUPERADMIN) */}
      {isPasswordModalOpen && selectedUserForPassword && canManageUsers && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleChangePassword}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-lg text-white">Cambiar Contraseña</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Usuario seleccionado:</p>
              <p className="font-bold text-white text-sm">
                {selectedUserForPassword.name}{" "}
                <span className="font-mono text-slate-400 font-normal">
                  (@{selectedUserForPassword.username})
                </span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nueva Contraseña: *
              </label>
              <input
                type="text"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Escribe la nueva contraseña..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-950/40"
              >
                Guardar Contraseña
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
