"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Wallet,
  Truck,
  BarChart3,
  Users,
  Store,
  X,
  Menu,
  Building2,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "ENCARGADO"] },
  { href: "/pos", label: "Ventas / POS", icon: ShoppingCart, badge: "Caja", roles: ["ADMIN", "ENCARGADO", "CAJERO"] },
  { href: "/caja", label: "Turnos & Caja", icon: Wallet, roles: ["ADMIN", "ENCARGADO", "CAJERO"] },
  { href: "/productos", label: "Productos & Precios", icon: Package, roles: ["ADMIN", "ENCARGADO", "CAJERO"] },
  { href: "/compras", label: "Compras & Lotes", icon: Truck, roles: ["ADMIN", "ENCARGADO"] },
  { href: "/reportes", label: "Reportes & Métricas", icon: BarChart3, roles: ["ADMIN", "ENCARGADO"] },
  { href: "/usuarios", label: "Usuarios & Permisos", icon: Users, roles: ["ADMIN", "ENCARGADO"] },
  { href: "/superadmin", label: "Gestión SaaS (Cuotas)", icon: Building2, badge: "SaaS", roles: ["SUPERADMIN"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>("CAJERO");
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserRole(u.role || "CAJERO");
      } catch (e) {
        console.error(e);
      }
    }
  }, [pathname]);

  // Escuchar evento personalizado para abrir menú móvil desde el Header
  useEffect(() => {
    const handleToggleMobileMenu = () => setIsOpenMobile((prev) => !prev);
    window.addEventListener("toggleMobileMenu", handleToggleMobileMenu);
    return () => window.removeEventListener("toggleMobileMenu", handleToggleMobileMenu);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsOpenMobile(false);
  }, [pathname]);

  if (pathname === "/login") return null;

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-900/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-lg tracking-wide leading-tight">
                ProtoStock
              </h1>
              <p className="text-xs text-rose-400 font-medium">Fiambrería & Almacén</p>
            </div>
          </div>

          {/* Botón cerrar en móvil */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5 mt-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-rose-600 text-white shadow-md shadow-rose-900/20 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span>Rol de Sesión:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[10px] border uppercase ${
              userRole === "ADMIN"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : userRole === "ENCARGADO"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
            }`}
          >
            {userRole}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Estado del Local:</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Abierto
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Escritorio (Fija en pantallas >1024px) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between min-h-screen select-none shrink-0">
        {sidebarContent}
      </aside>

      {/* Drawer Móvil y Tablet (Slide-over) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl z-50 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
