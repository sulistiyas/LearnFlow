import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { 
  Menu, 
  LogOut, 
  ExternalLink, 
  Radio, 
  Flame
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  activeTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, activeTitle }) => {
  const { user, roles, logout } = useAuthStore();

  const primaryRole = roles[0] || 'student';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'instructor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'student':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'parent':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-sky-50 border border-slate-200 transition touch-manipulation active:scale-95 shrink-0"
            aria-label="Buka Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                {activeTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold font-mono shrink-0">
                <Flame className="h-3 w-3 text-orange-500" />
                Sprint 1 Aktif
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block truncate">
              Sistem Manajemen Pembelajaran & Ujian Terintegrasi
            </p>
          </div>
        </div>

        {/* Right: Status Indicator, Documentation, User Info & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Real-time WebSocket Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Radio className="h-3 w-3" />
            <span>Reverb Online</span>
          </div>

          {/* Mobile minimal Reverb dot */}
          <div className="flex lg:hidden items-center" title="Reverb WebSocket Online">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          {/* Swagger Scramble API Link */}
          <a
            href="/docs/api"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200 shadow-2xs transition"
          >
            <span>Swagger API</span>
            <ExternalLink className="h-3 w-3 text-sky-500" />
          </a>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          {/* User Profile Summary */}
          {user && (
            <div className="flex items-center gap-2 pl-0.5 sm:pl-1">
              <div className="relative">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-xs ring-2 ring-sky-100 overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
              </div>

              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-tight block max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className={`px-1.5 py-0.2 rounded-full border text-[9px] font-mono font-semibold uppercase ${getRoleBadgeColor(primaryRole)}`}>
                    {primaryRole}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => logout()}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition flex items-center gap-1.5 shadow-2xs active:scale-95 touch-manipulation"
            title="Keluar Sesi"
            aria-label="Keluar Sesi"
          >
            <LogOut className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
