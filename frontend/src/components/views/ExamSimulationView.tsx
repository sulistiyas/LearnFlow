import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  Trash2 
} from 'lucide-react';
import { 
  confirmExamSubmission, 
  showAntiCheatWarning, 
  showAutosaveErrorToast, 
  showAutosaveSuccessToast, 
  confirmDangerAction 
} from '../../lib/alerts';

export const ExamSimulationView: React.FC = () => {
  const [unansweredCount, setUnansweredCount] = useState(2);
  const [violationCount, setViolationCount] = useState(1);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-orange-100 text-orange-600 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <span>Simulasi CBT & SweetAlert2</span>
          </h2>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold font-mono">
            Blueprint Bab 4
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Uji skenario pencegahan kecurangan, konfirmasi penyerahan ujian terkunci, dan notifikasi autosave.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Scenario A: Exam Submit Confirmation */}
        <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-sky-300 transition">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-600">
              <Send className="h-4 w-4" />
              <h3 className="font-bold text-sm text-slate-900">Skenario A</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Konfirmasi submit ujian terproteksi untuk mencegah ketidaksengajaan siswa mengumpulkan soal belum lengkap.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <label className="text-xs text-slate-600 font-medium">Soal Kosong:</label>
              <input
                type="number"
                min="0"
                max="10"
                value={unansweredCount}
                onChange={(e) => setUnansweredCount(Number(e.target.value))}
                className="w-16 h-8 sm:h-7 px-2 bg-slate-50 border border-slate-200 rounded text-sm sm:text-xs text-slate-800 text-center font-mono focus:outline-none focus:border-sky-500 font-bold"
              />
            </div>
          </div>
          <button
            onClick={() => confirmExamSubmission(unansweredCount)}
            className="w-full min-h-[42px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold transition shadow-sm shadow-sky-500/20 active:scale-[0.98] touch-manipulation flex items-center justify-center"
          >
            Uji Submit Ujian
          </button>
        </div>

        {/* Scenario B: Anti-Cheat Violation Warning */}
        <div className="rounded-2xl border border-orange-100 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-orange-300 transition">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600">
              <ShieldAlert className="h-4 w-4" />
              <h3 className="font-bold text-sm text-slate-900">Skenario B</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Modal anti-cheat terkunci saat siswa berpindah aplikasi / tab browser tanpa izin.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <label className="text-xs text-slate-600 font-medium">Pelanggaran:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={violationCount}
                onChange={(e) => setViolationCount(Number(e.target.value))}
                className="w-16 h-8 sm:h-7 px-2 bg-slate-50 border border-slate-200 rounded text-sm sm:text-xs text-slate-800 text-center font-mono focus:outline-none focus:border-orange-500 font-bold"
              />
              <span className="text-xs text-slate-400">/ 3 maks</span>
            </div>
          </div>
          <button
            onClick={() => showAntiCheatWarning(violationCount, 3)}
            className="w-full min-h-[42px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition shadow-sm shadow-orange-500/20 active:scale-[0.98] touch-manipulation flex items-center justify-center"
          >
            Uji Anti-Cheat Lock
          </button>
        </div>

        {/* Scenario C: Autosave Toast */}
        <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-sky-300 transition">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-600">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-bold text-sm text-slate-900">Skenario C</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Toast notifikasi di pojok layar ketika koneksi terganggu saat background autosave jawaban kuis.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => showAutosaveErrorToast(14)}
              className="min-h-[42px] py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition active:scale-[0.98] touch-manipulation flex items-center justify-center"
            >
              Toast Gagal
            </button>
            <button
              onClick={() => showAutosaveSuccessToast()}
              className="min-h-[42px] py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition active:scale-[0.98] touch-manipulation flex items-center justify-center"
            >
              Toast Sukses
            </button>
          </div>
        </div>

        {/* Scenario D: Danger Delete Confirmation */}
        <div className="rounded-2xl border border-rose-100 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-rose-300 transition">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-4 w-4" />
              <h3 className="font-bold text-sm text-slate-900">Skenario D</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dialog konfirmasi bahaya sebelum guru/admin menghapus modul ajar atau bank soal.
            </p>
          </div>
          <button
            onClick={() => confirmDangerAction('Modul 01: Kalkulus Diferensial Lanjut')}
            className="w-full min-h-[42px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white text-xs font-bold transition shadow-sm shadow-rose-500/20 active:scale-[0.98] touch-manipulation flex items-center justify-center"
          >
            Uji Hapus Modul
          </button>
        </div>
      </div>
    </div>
  );
};
