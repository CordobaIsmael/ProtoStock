"use client";

import { User, Bell, Clock, LogOut, Menu, Maximize2, Minimize2 } from "lucide-react";
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  if (pathname === "/login") return null;

  const handleOpenMobileMenu = () => {
    window.dispatchEvent(new Event("toggleMobileMenu"));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
      }
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        {/* Botón Menú Hamburguesa para Móvil y Tablet */}
        <button
          onClick={handleOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 border border-slate-700 transition"
          aria-label="Abrir Menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Reloj */}
        <div className="flex items-center gap-2 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs sm:text-sm font-mono">
          <Clock className="w-4 h-4 text-rose-400" />
          <span>{time || "--:--:--"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botón Pantalla Completa (Tablet / POS) */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 border border-transparent hover:border-slate-700"
          title="Pantalla Completa (Tablet / POS)"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-amber-400" />
          ) : (
            <Maximize2 className="w-5 h-5 text-slate-300" />
          )}
        </button>

        {/* Notificaciones */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-slate-900"></span>
        </button>

        {/* Perfil del Usuario Activo */}
        <div className="flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-800">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shadow-inner shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          </div>
          <div className="text-left hidden sm:block">
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
            </div>
          </div>

          <Link
            href="/login"
            onClick={() => {
              localStorage.removeItem("activeUser");
              window.dispatchEvent(new Event("userSessionChange"));
            }}
            title="Salir de la Sesión"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition ml-1 border border-transparent hover:border-slate-700"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
