"use client";

import {
  User,
  Bell,
  Clock,
  LogOut,
  Menu,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Calendar,
  Wallet,
  Trophy,
  ArrowRight,
  X,
  CheckCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ActiveUser {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface NotificationItem {
  id: string;
  type: "STOCK" | "EXPIRATION" | "SHIFT" | "WITHDRAWAL" | "MILESTONE";
  title: string;
  message: string;
  timestamp: string;
  severity: "danger" | "warning" | "info" | "success" | "purple";
  link: string;
  roles: string[];
}

export default function Header() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");
  const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Estado de Notificaciones
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  const loadActiveUser = () => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setActiveUser(u);
        fetchNotifications(u.role || "CAJERO");
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
      fetchNotifications("ADMIN");
    }
  };

  const fetchNotifications = async (role: string) => {
    try {
      const res = await fetch(`/api/notifications?role=${encodeURIComponent(role)}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
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

    loadActiveUser();

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "STOCK":
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case "EXPIRATION":
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case "SHIFT":
        return <Clock className="w-4 h-4 text-blue-400" />;
      case "WITHDRAWAL":
        return <Wallet className="w-4 h-4 text-purple-400" />;
      case "MILESTONE":
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
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

      <div className="flex items-center gap-2 sm:gap-3 relative">
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

        {/* Botón e Ícono de Notificaciones */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            title="Centro de Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-extrabold text-[10px] flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Panel Desplegable de Notificaciones */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="p-3.5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-rose-400" />
                  <h3 className="font-bold text-sm text-white">Notificaciones</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {activeUser?.role || "CAJERO"}
                  </span>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1.5">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 space-y-2">
                    <CheckCheck className="w-8 h-8 mx-auto text-emerald-400 opacity-60" />
                    <p className="text-xs">No hay alertas ni notificaciones pendientes.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <Link
                      key={notif.id}
                      href={notif.link}
                      onClick={() => setIsNotificationsOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-850/60 hover:bg-slate-800 transition flex items-start gap-3 group border border-slate-800/80"
                    >
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-slate-200 group-hover:text-rose-300 transition-colors">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-2.5 bg-slate-850 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setUnreadCount(0);
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
                  >
                    Marcar todas como vistas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
