# Sprint 5: Anti-Cheat Terkunci, Dialog SweetAlert2 & Auto-Grading
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

| Parameter Sprint | Keterangan |
| :--- | :--- |
| **Durasi** | 2 Minggu (Hari Kerja 51 – 60) |
| **Target Story Points** | 84 SP |
| **Fokus Utama** | Pelacakan kecurangan real-time (*Anti-Cheat Engine*) via browser events, modal peringatan SweetAlert2 terkunci, dasbor pengawas live via WebSocket Reverb, proteksi submit terkonfirmasi (Skenario A), transaksi ACID penilaian otomatis (*Auto-Grading*), dan portal koreksi rubrik esai guru dengan log audit. |

---

## 1. Sasaran Sprint (Sprint Goal)
Mencegah kecurangan ujian secara komprehensif melalui deteksi berpindah jendela/aplikasi terintegrasi dasbor pengawas, mencegah kesalahan fatal siswa saat submit kuis via SweetAlert2, serta mengeksekusi penilaian instan berintegritas tinggi dengan transaksi database ACID PostgreSQL 16+.

---

## 2. Rincian User Story & Kriteria Penerimaan

### Story 5.1: Mesin Deteksi Pelanggaran Anti-Cheat & Modal Kunci SweetAlert2
- **ID**: `US-5.1` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Sistem Integritas Akademik & Pengawas
- **Saya ingin**: Mendeteksi saat siswa berpindah tab browser, membuka aplikasi lain, keluar dari mode fullscreen, atau mencoba membuka DevTools
- **Agar**: Siswa tidak dapat mencari contekan di peramban atau menggunakan bantuan chatbot AI secara leluasa.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siswa sedang ujian, *When* event `document.visibilitychange` atau `window.onblur` terpicu, *Then* layar ujian seketika memunculkan **SweetAlert2 Skenario B (Modal Terkunci)** dengan parameter `allowOutsideClick: false` dan `allowEscapeKey: false`.
  - *Given* modal muncul, *Then* pesan bertuliskan: *"Peringatan! Aktivitas keluar tab telah dicatat pengawas."* dan nomor pelanggaran bertambah.
  - *Given* counter pelanggaran melebihi batas maksimal (`max_cheat_violations = 3`), *Then* sistem otomatis mengumpulkan paksa ujian siswa (`status = 'force_submitted'`) dan mendiskualifikasi sesi.
- **Tugas Teknis**:
  - [x] Migrasi tabel `exam_violations` dengan pencatatan timestamp mikrodetik dan metadata.
  - [x] Buat hook React `useAntiCheatMonitor` yang mendengarkan event `visibilitychange`, `blur`, dan pintasan keyboard terlarang (F12, Ctrl+C, Ctrl+V).
  - [x] Integrasikan fungsi helper SweetAlert2 Skenario B (`showAntiCheatWarning`).
  - [x] Endpoint `POST /api/v1/exams/{id}/log-violation`.

---

### Story 5.2: Dasbor Live Proctoring Pengawas (Laravel Reverb WebSocket)
- **ID**: `US-5.2` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: Guru / Pengawas Ujian
- **Saya ingin**: Melihat status real-time kehadiran seluruh peserta, sisa waktu, dan notifikasi peringatan pelanggaran langsung di layar dasbor pengawas
- **Agar**: Saya dapat mengidentifikasi siswa yang curang secara visual tanpa perlu berkeliling memeriksa meja satu per satu.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* Pengawas membuka `/teacher/exams/{id}/proctor`, *Then* pengawas otomatis tersambung ke Reverb presence channel `presence-exam-room.{examId}` dan private channel `private-proctor-exam.{examId}`.
  - *Given* seorang siswa berpindah tab, *Then* event `StudentViolationAlert` masuk dan kartu siswa tersebut di layar pengawas seketika menyala berkedip **MERAH** disertai counter jumlah pelanggaran.
- **Tugas Teknis**:
  - [x] Buat Event broadcasting `StudentViolationBroadcastEvent` di Laravel Reverb.
  - [x] Komponen Grid Monitoring Pengawas di React 19 (kartu status siswa: Hijau = Normal, Kuning = Lambat, Merah = Melanggar).
  - [x] Tombol aksi pengawas untuk mengirim peringatan tertulis khusus ke siswa tertentu.

---

### Story 5.3: Konfirmasi Pengumpulan Ujian Terproteksi (SweetAlert2 Skenario A)
- **ID**: `US-5.3` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: Siswa (*Student*)
- **Saya ingin**: Sistem menampilkan dialog konfirmasi yang memberi tahu jumlah soal yang belum terjawab sebelum lembar ujian saya kumpulkan secara permanen
- **Agar**: Saya tidak sengaja menekan tombol kumpulkan saat masih ada soal kosong yang belum sempat saya kerjakan.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siswa menekan tombol "Kumpulkan Ujian", *When* masih ada 3 butir soal yang belum diisi, *Then* muncul **SweetAlert2 Skenario A** dengan teks: *"Masih ada 3 nomor belum dijawab. Yakin ingin mengumpulkan sekarang?"* dengan tombol pembatalan berfokus utama (*focusCancel: true*).
  - *Given* seluruh nomor telah terjawab, *Then* muncul modal konfirmasi sukses bertombol hijau: *"Seluruh nomor telah dijawab. Kumpulkan jawaban Anda?"*.
  - *Given* siswa mengonfirmasi submit, *Then* request pengumpulan `POST /api/v1/exams/{id}/submit` dikirimkan ke server.
- **Tugas Teknis**:
  - [x] Implementasi fungsi helper SweetAlert2 Skenario A (`confirmExamSubmission`).
  - [x] Logika kalkulasi soal terisi vs kosong di store Zustand sebelum dialog dipanggil.
  - [x] Kunci seluruh interaksi tombol saat proses pengumpulan sedang berlangsung.

---

### Story 5.4: Mesin Penilaian Otomatis (Auto-Grading Engine) Berbasis Transaksi ACID
- **ID**: `US-5.4` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Sistem CBT & Guru
- **Saya ingin**: Soal objektif (Pilihan Ganda, PG Kompleks, Menjodohkan, True/False) dinilai otomatis secara instan dengan transaksi database ACID yang aman
- **Agar**: Hasil ujian langsung keluar dengan akurat tanpa risiko tumpang tindih data saat ribuan siswa submit bersamaan.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* request submit diterima, *When* backend menjalankan `DB::transaction()`, *Then* baris sesi dikunci menggunakan `lockForUpdate()` untuk mencegah *race condition*.
  - *Given* soal tipe PG Kompleks dievaluasi, *Then* sistem menghitung poin proporsional sesuai opsi benar yang dipilih jika `partial_scoring: true`.
  - *Given* ujian hanya terdiri dari soal objektif, *Then* nilai akhir (skala 0 - 100) langsung disimpan di tabel `exam_grades` dan status kelulusan KKM ditentukan seketika.
- **Tugas Teknis**:
  - [x] Migrasi tabel `exam_grades`.
  - [x] Buat service class `ExamGradingService` dengan algoritma evaluasi untuk tiap tipe soal JSONB.
  - [x] Invalidate cache sesi ujian di Redis pasca commit database.

---

### Story 5.5: Portal Koreksi Esai Guru & Audit Trail Revisi Nilai
- **ID**: `US-5.5` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: Guru Pengampu Kursus
- **Saya ingin**: Membaca lembar jawaban esai siswa, memberi skor berdasarkan kriteria rubrik, dan menuliskan catatan evaluasi
- **Agar**: Penilaian soal subjektif terstandarisasi dan setiap perubahan nilai tercatat dalam log audit.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* ujian memiliki soal esai, *Then* status ujian berstatus *"Menunggu Koreksi Guru"*.
  - *Given* guru memasukkan skor esai pada rubrik penilaian, *Then* skor akhir terakumulasi ulang otomatis di tabel `exam_grades`.
  - *Given* guru merevisi nilai yang sudah tersimpan sebelumnya, *Then* `spatie/laravel-activitylog` mencatat: nilai lama, nilai baru, nama guru pengubah, dan waktu revisi di tabel `activity_log`.
- **Tugas Teknis**:
  - [x] Migrasi tabel `rubric_criteria` dan `rubric_evaluations`.
  - [x] Antarmuka koreksi esai guru di React 19 dengan pembagian layar (Lembar Jawaban vs Form Rubrik).
  - [x] Integrasi `activity('grade_revision')->performedOn($grade)->log(...)`.

---

## 3. Matriks Alokasi Story Points Sprint 5

| Story ID | Judul User Story | Estimasi Poin | PIC Utama |
| :--- | :--- | :---: | :--- |
| `US-5.1` | Deteksi Pelanggaran Anti-Cheat & Modal SweetAlert2 | 13 SP | Frontend Dev |
| `US-5.2` | Dasbor Live Proctoring Pengawas (Reverb WebSocket) | 8 SP | Real-time Dev |
| `US-5.3` | Konfirmasi Pengumpulan Ujian Terproteksi (SweetAlert2) | 8 SP | Frontend Dev |
| `US-5.4` | Mesin Penilaian Otomatis (Auto-Grading ACID) | 13 SP | Backend Lead |
| `US-5.5` | Portal Koreksi Esai Guru & Audit Trail Revisi Nilai | 8 SP | Fullstack Dev |
| **Total** | | **50 SP** + 34 SP (Subtasks, Logging & Tests) = **84 SP** | Tim Scrum |

---

## 4. Kriteria Kelulusan Sprint 5 (Definition of Done)
1. Event perpindahan tab berhasil memicu modal peringatan SweetAlert2 terkunci tanpa bisa ditutup sembarangan.
2. Dasbor pengawas menerima alert real-time dengan latensi < 500ms via Laravel Reverb.
3. Konfirmasi submit SweetAlert2 menghitung soal kosong secara presisi dan mencegah salah klik.
4. Auto-grading untuk soal objektif terbukti aman dari *race condition* melalui transaksi ACID ber-lock.
5. Seluruh revisi nilai oleh pengajar terekam rapi di log audit Spatie ActivityLog.
