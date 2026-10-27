import React, { useState, type ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar, type NavMenuId } from './Sidebar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

interface DashboardLayoutProps {
  activeMenu: NavMenuId;
  onSelectMenu: (menu: NavMenuId) => void;
  children: ReactNode;
}

const menuTitles: Record<NavMenuId, string> = {
  overview: 'Ringkasan Sprint',
  simulation: 'Simulasi CBT Ujian',
  profile: 'Manajemen Profil',
  parent: 'Portal Wali Murid',
  admin: 'RBAC & Audit Trail',
  infrastructure: 'Status Fondasi Server',
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeMenu,
  onSelectMenu,
  children,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-800 flex flex-row font-sans selection:bg-sky-500 selection:text-white relative">
      {/* Ambient background blur elements */}
      <div className="fixed -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/4 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-orange-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Modular Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onSelectMenu={onSelectMenu}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Modular Header */}
        <Header
          onToggleMobileSidebar={() => setIsMobileOpen(true)}
          activeTitle={menuTitles[activeMenu]}
        />

        {/* Dynamic Content View with safe bottom padding for Mobile BottomNav */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6">
          {children}
        </main>

        {/* Modular Footer with bottom margin on mobile */}
        <div className="mb-14 md:mb-0">
          <Footer />
        </div>

        {/* Mobile Sticky Bottom Navigation */}
        <BottomNav
          activeMenu={activeMenu}
          onSelectMenu={onSelectMenu}
          onOpenSidebar={() => setIsMobileOpen(true)}
        />
      </div>
    </div>
  );
};

