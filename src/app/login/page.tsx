"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, User, KeyRound, ArrowRight, ShieldCheck, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados de 2FA
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");

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
        // Si el usuario requiere autenticación de 2 Factores (2FA)
        if (data.requires2FA) {
          setRequires2FA(true);
          setPendingUserId(data.userId);
          setLoading(false);
          return;
        }

        // Guardar usuario en localStorage y redirigir
        localStorage.setItem("activeUser", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userSessionChange"));

        const targetUrl =
          data.user.role === "CAJERO"
            ? "/caja"
            : data.user.role === "SUPERADMIN"
            ? "/superadmin"
            : "/";
        window.location.href = targetUrl;
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

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!twoFactorCode.trim() || twoFactorCode.trim().length !== 6) {
      setError("Ingresa el código de 6 dígitos generado por tu app");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/2fa/validate-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: pendingUserId,
          code: twoFactorCode.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("activeUser", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userSessionChange"));

        const targetUrl =
          data.user.role === "SUPERADMIN"
            ? "/superadmin"
            : "/";
        window.location.href = targetUrl;
      } else {
        setError(data.error || "Código de 6 dígitos incorrecto o expirado");
      }
    } catch (err) {
      console.error(err);
      setError("Error al validar el código de seguridad");
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
            {requires2FA ? <ShieldCheck className="w-8 h-8 text-amber-300" /> : <Store className="w-8 h-8" />}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">ProtoStock</h1>
          <p className="text-xs text-rose-400 font-semibold">
            {requires2FA ? "🔐 Verificación de 2 Factores (2FA)" : "Sistema de Gestión POS & Stock"}
          </p>
        </div>

        {/* Formulario Estándar o Pantalla 2FA */}
        {!requires2FA ? (
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
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-4 relative animate-fade-in">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center animate-fade-in">
                {error}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 text-center space-y-1">
              <p className="font-bold">📱 Abre tu aplicación de seguridad</p>
              <p className="text-[11px] text-slate-400">
                Ingresa el código temporal de 6 dígitos que aparece en tu <b>Google Authenticator</b> o <b>Authy</b>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-400 text-center uppercase mb-2">
                Código de Verificación (6 Dígitos):
              </label>
              <div className="relative max-w-[200px] mx-auto">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-amber-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  style={{ color: "#ffffff", backgroundColor: "#1e293b" }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-500/50 text-white font-mono font-extrabold text-xl tracking-[0.25em] text-center focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || twoFactorCode.length !== 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-950/50 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{loading ? "VALIDANDO CÓDIGO..." : "CONFIRMAR E INGRESAR"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRequires2FA(false);
                setPendingUserId(null);
                setTwoFactorCode("");
              }}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition font-semibold"
            >
              ← Volver al login normal
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
