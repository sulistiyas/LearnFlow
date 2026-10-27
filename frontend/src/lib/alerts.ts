import Swal from 'sweetalert2';

/**
 * Scenario A: Protected Exam Submission Confirmation
 */
export const confirmExamSubmission = async (unansweredCount: number): Promise<boolean> => {
  if (unansweredCount > 0) {
    const result = await Swal.fire({
      title: 'Peringatan Lembar Jawaban!',
      html: `Masih ada <b>${unansweredCount} butir soal</b> yang belum Anda jawab.<br/>Apakah Anda yakin ingin menyelesaikan ujian sekarang?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Tetap Kumpulkan',
      cancelButtonText: 'Kembali Periksa Soal',
      reverseButtons: true,
      focusCancel: true,
    });
    return result.isConfirmed;
  }

  const result = await Swal.fire({
    title: 'Konfirmasi Pengumpulan',
    text: 'Seluruh nomor telah Anda jawab dengan lengkap. Kumpulkan lembar jawaban Anda sekarang?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0284c7',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Kumpulkan Jawaban',
    cancelButtonText: 'Periksa Lagi',
  });
  return result.isConfirmed;
};

/**
 * Scenario B: Anti-Cheat Violation Warning (Locked modal)
 */
export const showAntiCheatWarning = (violationCount: number, maxAllowed: number) => {
  return Swal.fire({
    title: 'Pelanggaran Integritas Terdeteksi!',
    html: `Sistem mencatat Anda telah <b>meninggalkan layar ujian</b>.<br/>Pelanggaran ke-<b>${violationCount}</b> dari maksimal <b>${maxAllowed}</b> kali toleransi.<br/><small class="text-orange-600 font-semibold">Jika melebihi batas, ujian akan otomatis dikumpulkan paksa!</small>`,
    icon: 'warning',
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonColor: '#f97316',
    confirmButtonText: 'Saya Mengerti dan Kembali ke Ujian',
  });
};

/**
 * Scenario C: Autosave Notification Toast
 */
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
});

export const showAutosaveErrorToast = (questionNumber: number) => {
  Toast.fire({
    icon: 'error',
    title: `Koneksi terganggu! Jawaban nomor ${questionNumber} belum tersimpan ke server.`,
  });
};

export const showAutosaveSuccessToast = () => {
  Toast.fire({
    icon: 'success',
    title: 'Jawaban tersimpan otomatis.',
  });
};

/**
 * Scenario D: Danger Action Confirmation (Delete academic content)
 */
export const confirmDangerAction = async (itemTitle: string): Promise<boolean> => {
  const result = await Swal.fire({
    title: 'Hapus Konten Akademik?',
    html: `Tindakan ini akan menghapus modul <b>"${itemTitle}"</b> beserta seluruh riwayat pengerjaan siswa yang terhubung. Tindakan ini tidak dapat dibatalkan!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ea580c',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Hapus Permanen',
    cancelButtonText: 'Batalkan',
  });
  return result.isConfirmed;
};
