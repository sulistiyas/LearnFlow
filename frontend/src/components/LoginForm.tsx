import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Lock, Mail, User, LogIn, LogOut, CheckCircle2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { user, roles, isAuthenticated, login, logout, isLoading } = useAuthStore();
  const [identifier, setIdentifier] = useState('admin@learnflow.io');
  const [password, setPassword] = useState('password');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  const handleQuickLogin = async (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    await login(id, pass);
  };

  if (isAuthenticated && user) {
    return (
      <div className="rounded-2xl border border-sky-100 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-500/25 ring-2 ring-sky-200">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>{user.name}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </h3>
              <p className="text-xs text-slate-500 font-mono">{user.email} • @{user.username ?? 'pengguna'}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar Sesi
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Hak Akses / Peran Aktif:</span>
          {roles.map((role) => (
            <span
              key={role}
              className={`px-2.5 py-0.5 rounded-full border font-mono font-semibold ${
                role === 'superadmin' 
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : role === 'instructor'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : role === 'student'
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : role === 'parent'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {role}
            </span>
          ))}
          {user.student_code && (
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-mono font-medium">
              NIS: {user.student_code}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-6 space-y-6 shadow-sm hover:shadow-md transition">
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <div className="p-1 rounded-md bg-sky-100 text-sky-600">
            <Lock className="h-4 w-4" />
          </div>
          <span>Autentikasi Aman Sanctum (SPA Session & Bearer)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Masuk dengan proteksi sesi HTTP-Only Cookie dan audit logging aktivitas login.
        </p>
      </div>

      {/* Quick Account Switcher for Demo & Testing */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Akun Pengujian Cepat (Seed Data):</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@learnflow.io', 'password')}
            className="p-3 rounded-xl bg-orange-50/60 hover:bg-orange-50 border border-orange-200/80 hover:border-orange-300 text-left transition shadow-2xs group"
          >
            <div className="text-xs font-bold text-orange-700">Superadmin</div>
            <div className="text-[10px] text-slate-500 group-hover:text-slate-700 truncate font-mono">admin@learnflow.io</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('guru@learnflow.io', 'password')}
            className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 hover:border-blue-300 text-left transition shadow-2xs group"
          >
            <div className="text-xs font-bold text-blue-700">Guru / Pengampu</div>
            <div className="text-[10px] text-slate-500 group-hover:text-slate-700 truncate font-mono">guru@learnflow.io</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('siswa@learnflow.io', 'password')}
            className="p-3 rounded-xl bg-sky-50/60 hover:bg-sky-50 border border-sky-200/80 hover:border-sky-300 text-left transition shadow-2xs group"
          >
            <div className="text-xs font-bold text-sky-700">Siswa / CBT</div>
            <div className="text-[10px] text-slate-500 group-hover:text-slate-700 truncate font-mono">siswa@learnflow.io</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('wali@learnflow.io', 'password')}
            className="p-3 rounded-xl bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 hover:border-amber-300 text-left transition shadow-2xs group"
          >
            <div className="text-xs font-bold text-amber-700">Wali Murid</div>
            <div className="text-[10px] text-slate-500 group-hover:text-slate-700 truncate font-mono">wali@learnflow.io</div>
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-3 border-t border-slate-100">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-sky-600" />
            Email atau Username:
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="contoh: admin@learnflow.io atau username"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-sky-600" />
            Kata Sandi (Password):
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold transition shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
        >
          <LogIn className="h-4 w-4" />
          {isLoading ? 'Memproses Masuk...' : 'Masuk ke Platform'}
        </button>
      </form>
    </div>
  );
};
