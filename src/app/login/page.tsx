"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, User, KeyRound, ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Por favor ingresa usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
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
        } else if (data.user.role === "SUPERADMIN") {
          router.push("/superadmin");
        } else {
          router.push("/");
        }
      } else {
        setError(data.error || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center animate-fade-in">
              {error}
            </div>
          )}

          {/* Campo Usuario */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Usuario:
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: superadmin, admin, cajero"
                style={{ color: "#ffffff", backgroundColor: "#1e293b" }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-700 text-white font-medium placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Contraseña:
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña..."
                style={{ color: "#ffffff", backgroundColor: "#1e293b" }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-700 text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-rose-950/50 transition flex items-center justify-center gap-2"
          >
            <span>{loading ? "VERIFICANDO..." : "INGRESAR AL SISTEMA"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
