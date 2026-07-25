"use client";

import { User, Bell, Clock, LogOut, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ActiveUser {
  id: string;
  name: string;
  username: string;
  role: string;
}

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);

  const loadActiveUser = () => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      try {
        setActiveUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    } else {
      setActiveUser({
        id: "admin-demo",
        name: "Administrador General",
        username: "admin",
        role: "ADMIN",
      });
    }
  };

  useEffect(() => {
    // Reloj
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Cargar usuario activo inmediatamente
    loadActiveUser();

    // Escuchar eventos de cambio de sesión o almacenamiento
    const handleSessionChange = () => loadActiveUser();
    window.addEventListener("userSessionChange", handleSessionChange);
    window.addEventListener("storage", handleSessionChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("userSessionChange", handleSessionChange);
      window.removeEventListener("storage", handleSessionChange);
    };
  }, [pathname]);

  // Si estamos en la pantalla de login, no mostrar la cabecera
  if (pathname === "/login") return null;

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-sm font-mono">
          <Clock className="w-4 h-4 text-rose-400" />
          <span>{time || "--:--:--"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-slate-900"></span>
        </button>

        {/* Perfil del Usuario Activo */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shadow-inner">
            <User className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-100 leading-tight">
              {activeUser?.name || "Administrador General"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                  activeUser?.role === "ADMIN"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : activeUser?.role === "ENCARGADO"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                }`}
              >
                {activeUser?.role || "ADMIN"}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                @{activeUser?.username || "admin"}
              </span>
            </div>
          </div>

          <Link
            href="/login"
            onClick={() => {
              // Limpiar sesión al hacer clic en salir
              localStorage.removeItem("activeUser");
              window.dispatchEvent(new Event("userSessionChange"));
            }}
            title="Cambiar Usuario / Salir de la Sesión"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition ml-2 border border-transparent hover:border-slate-700"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
