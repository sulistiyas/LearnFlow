import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { 
  LayoutDashboard, 
  Sparkles, 
  User as UserIcon, 
  Users, 
  ShieldCheck, 
  Server, 
  Layers, 
  X,
  ChevronRight
} from 'lucide-react';

export type NavMenuId = 'overview' | 'simulation' | 'profile' | 'parent' | 'admin' | 'infrastructure';

interface SidebarProps {
  activeMenu: NavMenuId;
  onSelectMenu: (menu: NavMenuId) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuItem {
  id: NavMenuId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  requiredRoles?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { roles } = useAuthStore();

  const isSuperadmin = roles.includes('superadmin');
  const isParentOrAdmin = roles.includes('parent') || isSuperadmin;

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Ringkasan & Verifikasi',
      icon: LayoutDashboard,
      badge: 'Sprint 1',
      badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    },
    {
      id: 'simulation',
      label: 'Simulasi Ujian & CBT',
      icon: Sparkles,
      badge: 'Interaktif',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    {
      id: 'profile',
      label: 'Profil & Cloudflare R2',
      icon: UserIcon,
    },
    {
      id: 'parent',
      label: 'Portal Wali Murid',
      icon: Users,
      badge: isParentOrAdmin ? 'Terbuka' : 'Terkunci',
      badgeColor: isParentOrAdmin 
        ? 'bg-amber-100 text-amber-700 border-amber-200' 
        : 'bg-slate-100 text-slate-500 border-slate-200',
    },
    {
      id: 'admin',
      label: 'RBAC & Audit Trail',
      icon: ShieldCheck,
      badge: isSuperadmin ? 'Admin' : 'Terkunci',
      badgeColor: isSuperadmin 
        ? 'bg-orange-100 text-orange-700 border-orange-200' 
        : 'bg-slate-100 text-slate-500 border-slate-200',
    },
    {
      id: 'infrastructure',
      label: 'Infrastruktur Inti',
      icon: Server,
      badge: 'Sprint 0',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-72 max-w-[85vw] bg-white border-r border-sky-100 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out shadow-lg md:shadow-sm ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 px-5 sm:px-6 flex items-center justify-between border-b border-sky-100/80 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-500/25 ring-2 ring-sky-200">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight block">
                  LearnFlow
                </span>
                <span className="text-[10px] text-sky-600 font-semibold font-mono tracking-wider block uppercase">
                  LMS & CBT Platform
                </span>
              </div>
            </div>

            {/* Mobile close button with optimal tap area */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition active:scale-95 touch-manipulation"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 sm:p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Menu Navigasi
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectMenu(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group text-left touch-manipulation active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-sky-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-sky-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform ${
                        isActive ? 'text-white/80 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Current Session & Info Card */}
        <div className="p-3 sm:p-4 border-t border-sky-100 bg-sky-50/30 pb-safe">
          <div className="p-3.5 rounded-xl border border-sky-100 bg-white shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Sesi Terautentikasi</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hak akses multi-peran aktif dikontrol langsung oleh Spatie RBAC & PostgreSQL 18+.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
