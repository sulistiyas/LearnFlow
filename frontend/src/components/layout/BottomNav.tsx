import React from 'react';
import type { NavMenuId } from './Sidebar';
import { 
  LayoutDashboard, 
  Sparkles, 
  User as UserIcon, 
  Menu
} from 'lucide-react';

interface BottomNavProps {
  activeMenu: NavMenuId;
  onSelectMenu: (menu: NavMenuId) => void;
  onOpenSidebar: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeMenu,
  onSelectMenu,
  onOpenSidebar,
}) => {
  const isOtherActive = activeMenu === 'parent' || activeMenu === 'admin' || activeMenu === 'infrastructure';

  return (
    <nav 
      aria-label="Navigasi Bawah Seluler"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-sky-100 shadow-[0_-4px_16px_rgba(2,132,199,0.06)] px-3 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Ringkasan */}
        <button
          onClick={() => onSelectMenu('overview')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[10px] font-medium ${
            activeMenu === 'overview'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeMenu === 'overview' ? 'bg-sky-50 -translate-y-0.5' : ''}`}>
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="truncate mt-0.5">Ringkasan</span>
        </button>

        {/* Simulasi CBT */}
        <button
          onClick={() => onSelectMenu('simulation')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[10px] font-medium ${
            activeMenu === 'simulation'
              ? 'text-orange-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeMenu === 'simulation' ? 'bg-orange-50 -translate-y-0.5' : ''}`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="truncate mt-0.5">Simulasi</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => onSelectMenu('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[10px] font-medium ${
            activeMenu === 'profile'
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${activeMenu === 'profile' ? 'bg-sky-50 -translate-y-0.5' : ''}`}>
            <UserIcon className="h-5 w-5" />
          </div>
          <span className="truncate mt-0.5">Profil</span>
        </button>

        {/* Menu Lainnya / Drawer */}
        <button
          onClick={onOpenSidebar}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition text-[10px] font-medium ${
            isOtherActive
              ? 'text-sky-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 active:scale-95'
          }`}
        >
          <div className={`p-1 rounded-lg transition-transform ${isOtherActive ? 'bg-sky-50 -translate-y-0.5' : ''}`}>
            <Menu className="h-5 w-5" />
          </div>
          <span className="truncate mt-0.5">Lainnya</span>
          {isOtherActive && (
            <span className="absolute top-1 right-2.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
          )}
        </button>
      </div>
    </nav>
  );
};
