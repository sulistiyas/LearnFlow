import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import Swal from 'sweetalert2';
import { Users, UserPlus, GraduationCap, CheckCircle2 } from 'lucide-react';

interface Ward {
  id: string;
  student_id: string;
  student_name: string;
  student_username: string;
  student_code: string;
  avatar_url?: string | null;
  relationship: string;
  is_verified: boolean;
  linked_at: string;
}

export const ParentPortalView: React.FC = () => {
  const [studentCode, setStudentCode] = useState('');
  const [relationship, setRelationship] = useState('father');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: wards = [], refetch, isLoading } = useQuery<Ward[]>({
    queryKey: ['parentWards'],
    queryFn: async () => {
      const res = await apiClient.get('/parent/wards');
      return res.data.data;
    },
  });

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/parent/link-student', {
        student_code: studentCode.trim(),
        relationship,
      });

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Akun Terhubung!',
          text: res.data.message,
          confirmButtonColor: '#0284c7',
        });
        setStudentCode('');
        refetch();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menghubungkan akun siswa.';
      Swal.fire({
        icon: 'error',
        title: 'Verifikasi Gagal',
        text: msg,
        confirmButtonColor: '#ea580c',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3.5 sm:pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <div className="p-1 rounded-md bg-orange-100 text-orange-600 shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <span>Portal Wali Murid & Anak Asuh</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hubungkan akun siswa dengan Nomor Induk Siswa (NIS) untuk memantau progres CBT dan nilai akademik.
          </p>
        </div>
      </div>

      {/* Link Student Form */}
      <form onSubmit={handleLinkStudent} className="p-3.5 sm:p-4 rounded-xl border border-sky-100 bg-sky-50/40 space-y-3.5 sm:space-y-4">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <UserPlus className="h-3.5 w-3.5 text-sky-600" />
          <span>Hubungkan Akun Siswa Baru:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Kode Siswa / NIS:</label>
            <input
              type="text"
              required
              placeholder="Contoh: NIS-2026-001"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Hubungan Keluarga:</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
            >
              <option value="father">Ayah Kandung (Father)</option>
              <option value="mother">Ibu Kandung (Mother)</option>
              <option value="guardian">Wali / Pengasuh (Guardian)</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition disabled:opacity-50 active:scale-[0.98] touch-manipulation flex items-center justify-center"
            >
              {isSubmitting ? 'Memverifikasi...' : 'Hubungkan Siswa'}
            </button>
          </div>
        </div>
      </form>

      {/* Wards List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700">Daftar Anak Asuh Terhubung ({wards.length}):</h4>

        {isLoading ? (
          <div className="text-center py-6 text-xs text-slate-500">Memuat data anak asuh...</div>
        ) : wards.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-sky-200 bg-sky-50/20 rounded-xl text-xs text-slate-500 space-y-2 p-4">
            <GraduationCap className="h-8 w-8 mx-auto text-sky-400" />
            <p>Belum ada siswa yang terhubung. Masukkan NIS-2026-001 untuk menghubungkan akun sampel Ahmad Fauzi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {wards.map((ward) => (
              <div
                key={ward.id}
                className="p-3.5 sm:p-4 rounded-xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/40 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 hover:border-sky-300 shadow-2xs hover:shadow-xs transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                    {ward.student_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{ward.student_name}</h5>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      NIS: {ward.student_code} • <span className="capitalize">{ward.relationship}</span>
                    </p>
                  </div>
                </div>

                <span className="self-end xs:self-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200 shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Terverifikasi
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
