import { useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import type { NavMenuId } from './components/layout/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { ExamSimulationView } from './components/views/ExamSimulationView';
import { ProfileView } from './components/ProfileView';
import { ParentPortalView } from './components/ParentPortalView';
import { AdminAuditView } from './components/AdminAuditView';
import { InfrastructureView } from './components/views/InfrastructureView';
import { RoleGate } from './components/RoleGate';

export function App() {
  const { isAuthenticated } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState<NavMenuId>('overview');

  // If user is not authenticated, show standard split LoginPage
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If authenticated, show Modular Dashboard with Header, Sidebar, Footer, and Content
  return (
    <DashboardLayout activeMenu={activeMenu} onSelectMenu={setActiveMenu}>
      {activeMenu === 'overview' && (
        <OverviewView onNavigate={setActiveMenu} />
      )}

      {activeMenu === 'simulation' && (
        <ExamSimulationView />
      )}

      {activeMenu === 'profile' && (
        <ProfileView />
      )}

      {activeMenu === 'parent' && (
        <RoleGate
          allowedRoles={['parent', 'superadmin']}
          fallback={
            <div className="rounded-2xl border border-sky-100 bg-white p-5 sm:p-8 text-center text-xs text-slate-600 space-y-3 shadow-sm max-w-xl mx-auto my-4 sm:my-8">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
                🔒
              </div>
              <h3 className="font-bold text-sm text-slate-900">Akses Portal Terbatas</h3>
              <p>Portal Wali Murid ini dilindungi untuk akun dengan peran <b className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">parent</b> atau <b className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">superadmin</b>.</p>
              <p className="text-slate-500">Silakan keluar dan masuk kembali menggunakan akun demo <b>Wali Murid (wali@learnflow.io)</b>.</p>
            </div>
          }
        >
          <ParentPortalView />
        </RoleGate>
      )}

      {activeMenu === 'admin' && (
        <RoleGate
          allowedRoles={['superadmin']}
          fallback={
            <div className="rounded-2xl border border-sky-100 bg-white p-5 sm:p-8 text-center text-xs text-slate-600 space-y-3 shadow-sm max-w-xl mx-auto my-4 sm:my-8">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center mx-auto shadow-2xs">
                🛡️
              </div>
              <h3 className="font-bold text-sm text-slate-900">Akses Superadmin Diperlukan</h3>
              <p>Manajemen Peran & Audit Trail dilindungi secara ketat untuk peran <b className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">superadmin</b>.</p>
              <p className="text-slate-500">Silakan keluar dan masuk kembali menggunakan akun demo <b>Superadmin (admin@learnflow.io)</b>.</p>
            </div>
          }
        >
          <AdminAuditView />
        </RoleGate>
      )}

      {activeMenu === 'infrastructure' && (
        <InfrastructureView />
      )}
    </DashboardLayout>
  );
}

export default App;
