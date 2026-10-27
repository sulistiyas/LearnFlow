import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import Swal from 'sweetalert2';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  status: string;
  roles: string[];
  last_login_at?: string | null;
}

interface AuditLogItem {
  id: number;
  log_name: string;
  description: string;
  causer_name: string;
  causer_email?: string | null;
  properties?: Record<string, any>;
  created_at: string;
}

export const AdminAuditView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');

  const { data: usersData, refetch: refetchUsers, isLoading: isLoadingUsers } = useQuery<{ data: AdminUser[] }>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users');
      return res.data;
    },
  });

  const { data: auditData, refetch: refetchAudit, isLoading: isLoadingAudit } = useQuery<{ data: AuditLogItem[] }>({
    queryKey: ['adminAuditLogs'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/audit-logs');
      return res.data;
    },
  });

  const handleAssignRole = async (user: AdminUser, newRole: string) => {
    try {
      const res = await apiClient.post(`/admin/users/${user.id}/roles`, {
        roles: [newRole],
      });

      if (res.data.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Peran ${user.name} diubah menjadi ${newRole}`,
          showConfirmButton: false,
          timer: 3000,
        });
        refetchUsers();
        refetchAudit();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengubah peran pengguna.';
      Swal.fire({
        icon: 'error',
        title: 'Otorisasi Gagal',
        text: msg,
        confirmButtonColor: '#ea580c',
      });
    }
  };

  const users = usersData?.data ?? [];
  const logs = auditData?.data ?? [];

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-sm hover:shadow-md transition">
      {/* Header with Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-100 text-blue-600 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span>Manajemen Multi-Peran & Audit Trail</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Penetapan 5 peran Spatie Permission dan pencatatan forensik mutasi pengguna di PostgreSQL.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition text-center touch-manipulation ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Manajemen Peran
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition text-center touch-manipulation ${
              activeTab === 'audit' 
                ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Audit Log ({logs.length})
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Daftar Pengguna Sistem ({users.length}):</span>
            <button
              onClick={() => refetchUsers()}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 touch-manipulation"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {isLoadingUsers ? (
            <div className="text-center py-6 text-xs text-slate-500">Memuat pengguna...</div>
          ) : (
            <>
              {/* Mobile Card View (Screens < 640px) */}
              <div className="space-y-3 sm:hidden">
                {users.map((u) => (
                  <div 
                    key={u.id}
                    className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/20 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{u.name}</div>
                        <div className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                          {u.email} <span className="text-slate-400">(@{u.username ?? '-'})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded-full border font-mono text-[9px] font-semibold ${
                              r === 'superadmin'
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : r === 'instructor'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : r === 'student'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : r === 'parent'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-sky-100/60 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-medium">Ubah Peran:</span>
                      <select
                        defaultValue={u.roles[0] ?? 'student'}
                        onChange={(e) => handleAssignRole(u, e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500 transition"
                      >
                        <option value="superadmin">superadmin</option>
                        <option value="instructor">instructor</option>
                        <option value="teaching_assistant">teaching_assistant</option>
                        <option value="student">student</option>
                        <option value="parent">parent</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablet & Desktop Table View (Screens >= 640px) */}
              <div className="hidden sm:block overflow-x-auto rounded-xl border border-sky-100 shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-sky-50/70 text-slate-600 uppercase text-[10px] tracking-wider border-b border-sky-100 font-bold">
                    <tr>
                      <th className="px-4 py-3">Pengguna</th>
                      <th className="px-4 py-3">Email & Username</th>
                      <th className="px-4 py-3">Peran Saat Ini</th>
                      <th className="px-4 py-3 text-right">Aksi Ubah Peran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-sky-50/30 transition">
                        <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                          {u.email} <span className="text-slate-400">(@{u.username ?? '-'})</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {u.roles.map((r) => (
                              <span
                                key={r}
                                className={`px-2 py-0.5 rounded-full border font-mono text-[10px] font-semibold ${
                                  r === 'superadmin'
                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                    : r === 'instructor'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : r === 'student'
                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                    : r === 'parent'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <select
                            defaultValue={u.roles[0] ?? 'student'}
                            onChange={(e) => handleAssignRole(u, e.target.value)}
                            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition"
                          >
                            <option value="superadmin">superadmin</option>
                            <option value="instructor">instructor</option>
                            <option value="teaching_assistant">teaching_assistant</option>
                            <option value="student">student</option>
                            <option value="parent">parent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Riwayat Audit Trail Forensik ({logs.length}):</span>
            <button
              onClick={() => refetchAudit()}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 touch-manipulation"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {isLoadingAudit ? (
            <div className="text-center py-6 text-xs text-slate-500">Memuat log audit...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">Belum ada riwayat aktivitas yang tercatat.</div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs shadow-2xs hover:border-sky-300 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 font-mono text-[10px] text-sky-800 uppercase font-bold shrink-0">
                        {log.log_name}
                      </span>
                      <span className="font-bold text-slate-900">{log.description}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                      <span>Pelaku: <b className="text-slate-800">{log.causer_name}</b></span>
                      {log.properties?.ip && <span>IP: <code className="text-sky-600 font-semibold">{log.properties.ip}</code></span>}
                    </div>
                  </div>
                  <span className="self-end sm:self-auto text-[10px] text-slate-400 shrink-0 font-mono">
                    {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
