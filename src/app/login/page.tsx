"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, User, KeyRound, ArrowRight } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  username: string;
  role: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        if (data.length > 0) {
          const admin = data.find((u: UserItem) => u.role === "ADMIN") || data[0];
          setSelectedUsername(admin.username);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Ingresa tu contraseña para continuar");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: selectedUsername,
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Guardar usuario en localStorage y notificar a la cabecera
        localStorage.setItem("activeUser", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userSessionChange"));

        // Redirección según rol
        if (data.user.role === "CAJERO") {
          router.push("/caja");
        } else {
          router.push("/");
        }
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find((u) => u.username === selectedUsername);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl animate-fade-in relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-rose-950/50 mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">ProtoStock</h1>
          <p className="text-xs text-rose-400 font-semibold">Sistema de Gestión POS & Stock</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Selección de Usuario */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Seleccionar Usuario:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {users.map((u) => {
                const isSelected = selectedUsername === u.username;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUsername(u.username);
                      setPassword("");
                      setError("");
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isSelected
                        ? "bg-rose-600/20 border-rose-500 text-white shadow-md"
                        : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold leading-tight">{u.name}</p>
                        <p className="text-[11px] font-mono opacity-80">@{u.username}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        u.role === "ADMIN"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : u.role === "ENCARGADO"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {u.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contraseña / PIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Contraseña / PIN:
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-850 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedUsername}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-rose-950/50 transition flex items-center justify-center gap-2"
          >
            <span>INGRESAR COMO {selectedUser?.name?.toUpperCase() || "USUARIO"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
