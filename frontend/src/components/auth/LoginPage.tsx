import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { 
  Lock, 
  Mail, 
  LogIn, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Zap, 
  Database, 
  Radio, 
  Flame,
  CheckCircle2,
  Users
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const [identifier, setIdentifier] = useState('admin@learnflow.io');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  const handleQuickLogin = async (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    await login(id, pass);
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-800 flex flex-col justify-center font-sans selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed -top-32 -left-32 w-[500px] h-[500px] bg-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-32 w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-32 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-sky-100 shadow-xl shadow-sky-500/5 overflow-hidden">
          
          {/* SISI KIRI: PENJELASAN SISTEM & PENGENALAN LEARNFLOW (Tampil di desktop kiri, atau di bawah form di mobile) */}
          <div className="order-2 lg:order-1 lg:col-span-7 bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-600 text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient inner blob */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-80 h-80 bg-blue-900/40 rounded-full blur-2xl pointer-events-none" />

            {/* Top Brand & Badge */}
            <div className="relative z-10 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 sm:h-11 w-10 sm:w-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
                    <Layers className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white block">
                      LearnFlow
                    </span>
                    <span className="text-[11px] sm:text-xs text-sky-100 font-mono tracking-wider block">
                      E-Learning & CBT Platform
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/90 text-white text-xs font-bold shadow-sm">
                  <Flame className="h-3.5 w-3.5" />
                  Sprint 1 Live
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2 sm:space-y-3 pt-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Sistem Ujian Terproteksi & Manajemen Belajar Cerdas
                </h2>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-xl">
                  Platform modern dengan arsitektur multi-peran, pencegahan kecurangan berbasis komputasi cerdas, serta latensi rendah untuk kelancaran ujian serentak.
                </p>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-500 text-white shadow-2xs">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">Integritas CBT Teruji</h3>
                  </div>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    Deteksi tab-switch, autosave kuis Redis, konfirmasi kuis berlapis, dan anti-cheat modal terkunci.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500 text-white shadow-2xs">
                      <Users className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">5 Peran Pengguna</h3>
                  </div>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    Spatie RBAC untuk Superadmin, Guru, Asisten, Siswa, dan Portal Wali Murid pemantau nilai.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500 text-white shadow-2xs">
                      <Zap className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">Realtime & Cloud Native</h3>
                  </div>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    Laravel Reverb native WebSocket port 8080 dan avatar upload ke Cloudflare R2 bucket.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-2xs">
                      <Database className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">PostgreSQL 18+ ULID</h3>
                  </div>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    CHAR 26 time-ordered key, JSONB GIN Index, dan audit trail mutasi forensik Spatie.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Proof Metrics */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-100 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-300" />
                <span>24 Feature Tests Lulus (57 Asersi)</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-300" />
                <span>WebSocket Reverb Port 8080</span>
              </div>
            </div>
          </div>

          {/* SISI KANAN: LOGIN PAGE STANDART & DEMO ACCOUNTS (Tampil di atas pada mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-5 p-5 sm:p-8 lg:p-12 flex flex-col justify-between bg-white space-y-5">
            <div>
              {/* Mobile-only Top Brand Header */}
              <div className="lg:hidden flex items-center justify-between pb-3.5 border-b border-sky-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-500/25 ring-2 ring-sky-200">
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                      LearnFlow
                    </span>
                    <span className="text-[9px] text-sky-600 font-semibold font-mono tracking-wider block uppercase">
                      LMS & CBT Platform
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-semibold font-mono">
                  <Flame className="h-3 w-3 text-orange-500" />
                  Sprint 1
                </span>
              </div>

              {/* Header Title */}
              <div className="space-y-1 mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Masuk ke Platform
                </h3>
                <p className="text-xs text-slate-500">
                  Gunakan kredensial akun Anda atau pilih akun demo pengujian di bawah.
                </p>
              </div>

              {/* Standard Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-sky-600" />
                    Email atau Username:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="admin@learnflow.io atau username"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-sky-600" />
                      Kata Sandi (Password):
                    </label>
                    <span className="text-[11px] text-sky-600 hover:text-sky-700 font-medium cursor-pointer">
                      Lupa sandi?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 touch-manipulation"
                      tabIndex={-1}
                      aria-label="Lihat password"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
                    />
                    <span className="text-xs">Ingat saya</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Cookie Sesi Aman</span>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold transition shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                >
                  <LogIn className="h-4 w-4" />
                  {isLoading ? 'Memverifikasi Sesi...' : 'Masuk ke Platform'}
                </button>
              </form>

              {/* Demo Account Quick Switcher */}
              <div className="pt-5 mt-5 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                    <span>Akun Demo (1-Click Login):</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Seed Data</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@learnflow.io', 'password')}
                    className="p-2 sm:p-2.5 rounded-xl bg-orange-50/70 hover:bg-orange-50 border border-orange-200/80 hover:border-orange-300 text-left transition shadow-2xs group active:scale-[0.98] touch-manipulation"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-orange-700 truncate">Superadmin</span>
                      <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded bg-orange-200/70 text-orange-800 font-mono font-semibold shrink-0">ALL</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">admin@learnflow.io</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('guru@learnflow.io', 'password')}
                    className="p-2 sm:p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-50 border border-blue-200/80 hover:border-blue-300 text-left transition shadow-2xs group active:scale-[0.98] touch-manipulation"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-blue-700 truncate">Guru</span>
                      <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded bg-blue-200/70 text-blue-800 font-mono font-semibold shrink-0">CBT</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">guru@learnflow.io</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('siswa@learnflow.io', 'password')}
                    className="p-2 sm:p-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-50 border border-sky-200/80 hover:border-sky-300 text-left transition shadow-2xs group active:scale-[0.98] touch-manipulation"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-sky-700 truncate">Siswa</span>
                      <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded bg-sky-200/70 text-sky-800 font-mono font-semibold shrink-0">STUDENT</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">siswa@learnflow.io</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('wali@learnflow.io', 'password')}
                    className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 hover:border-amber-300 text-left transition shadow-2xs group active:scale-[0.98] touch-manipulation"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-amber-700 truncate">Wali Murid</span>
                      <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded bg-amber-200/70 text-amber-800 font-mono font-semibold shrink-0">PORTAL</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate font-mono mt-0.5">wali@learnflow.io</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="text-center pt-2 sm:pt-4 text-[10px] sm:text-[11px] text-slate-400">
              Kata sandi default: <code className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">password</code>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
