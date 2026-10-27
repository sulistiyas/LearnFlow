import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api';
import { RoleGate } from '../RoleGate';
import { 
  CheckCircle2, 
  ShieldCheck, 
  User as UserIcon, 
  Users, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import type { NavMenuId } from '../layout/Sidebar';

interface OverviewViewProps {
  onNavigate: (menu: NavMenuId) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { user, roles } = useAuthStore();
  const [examTitle, setExamTitle] = useState('Ujian Matematika Diskrit');

  const handleTestCreateExam = async () => {
    try {
      const res = await apiClient.post('/exams', { title: examTitle });
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Dibuat!',
          text: `Endpoint Guru diakses dengan peran: ${roles.join(', ')}`,
          confirmButtonColor: '#0284c7',
        });
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'HTTP 403 Forbidden',
          html: `Peran Anda saat ini: <b>[${roles.join(', ')}]</b> tidak memiliki izin membuat ujian. Hanya <b>instructor</b> atau <b>superadmin</b> yang diizinkan!`,
          confirmButtonColor: '#ea580c',
        });
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Sprint 1 Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 text-white p-5 sm:p-7 md:p-8 shadow-lg shadow-sky-500/15 border border-sky-400/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-orange-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-orange-300" />
            <span>Sprint 1 Verification Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
            Selamat Datang di Portal LearnFlow, {user?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            Sistem otorisasi aman dari XSS/CSRF dengan 5 peran Spatie (<code className="bg-white/20 text-orange-200 px-1.5 py-0.5 rounded font-mono text-[11px]">superadmin</code>, <code className="bg-white/20 text-orange-200 px-1.5 py-0.5 rounded font-mono text-[11px]">instructor</code>, <code className="bg-white/20 text-orange-200 px-1.5 py-0.5 rounded font-mono text-[11px]">teaching_assistant</code>, <code className="bg-white/20 text-orange-200 px-1.5 py-0.5 rounded font-mono text-[11px]">student</code>, <code className="bg-white/20 text-orange-200 px-1.5 py-0.5 rounded font-mono text-[11px]">parent</code>), upload avatar R2, portal wali murid, dan audit trail mutasi forensik.
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => onNavigate('simulation')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition text-left space-y-2.5 sm:space-y-3 group active:scale-[0.98] touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition">
              Simulasi CBT Ujian
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Uji anti-cheat lock, autosave, dan konfirmasi submit.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition text-left space-y-2.5 sm:space-y-3 group active:scale-[0.98] touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
              <UserIcon className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-sky-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition">
              Profil & Cloud Avatar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data diri & unggah avatar ke Cloudflare R2.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('parent')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition text-left space-y-2.5 sm:space-y-3 group active:scale-[0.98] touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Users className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition">
              Portal Wali Murid
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hubungkan akun siswa (NIS) untuk pantau nilai CBT.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('admin')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 shadow-sm hover:shadow-md transition text-left space-y-2.5 sm:space-y-3 group active:scale-[0.98] touch-manipulation"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition">
              RBAC & Audit Trail
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mutasi peran Spatie & riwayat aktivitas forensik.
            </p>
          </div>
        </button>
      </div>

      {/* RBAC Role-Gate Simulation Test Section */}
      <section className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <div className="p-1 rounded-md bg-sky-100 text-sky-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span>Pengujian Otorisasi Endpoint Guru vs Siswa (US-1.2)</span>
        </h3>

        <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-6 space-y-3.5 sm:space-y-4 shadow-sm hover:shadow-md transition">
          <p className="text-xs text-slate-600 leading-relaxed">
            Kriteria Penerimaan US-1.2: <i>Siswa mencoba mengakses endpoint Guru (<code className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 font-mono">POST /api/v1/exams</code>), maka sistem menolak dengan HTTP 403 Forbidden. Guru atau Superadmin diizinkan.</i>
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
            />
            <button
              onClick={handleTestCreateExam}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition active:scale-[0.98] touch-manipulation flex items-center justify-center"
            >
              Uji POST /api/v1/exams
            </button>
          </div>

          <div className="pt-2 sm:pt-3 border-t border-slate-100">
            <RoleGate allowedRoles={['instructor', 'superadmin']}>
              <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>RoleGate Terbuka: Anda login dengan peran <b>{roles.join(', ')}</b> dan memiliki izin instruktur.</span>
              </div>
            </RoleGate>
          </div>
        </div>
      </section>
    </div>
  );
};
