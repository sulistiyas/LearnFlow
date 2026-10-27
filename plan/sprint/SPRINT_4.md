# Sprint 4: Engine Ujian CBT, WebSocket Reverb & Debounced Autosave
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

| Parameter Sprint | Keterangan |
| :--- | :--- |
| **Durasi** | 2 Minggu (Hari Kerja 41 – 50) |
| **Target Story Points** | 85 SP |
| **Fokus Utama** | Peluncuran Engine Inti Computer Based Testing (CBT): verifikasi token & jadwal, pengacakan urutan soal dan opsi jawaban berbasis seed unik per siswa, sinkronisasi hitung mundur timer server-authoritative via Laravel Reverb WebSocket, autosave jawaban debounced 800ms dengan React Query & buffer Redis, dan palet navigasi status soal berbasis Zustand. |

---

## 1. Sasaran Sprint (Sprint Goal)
Membangun pengalaman ujian online (*CBT Examination Room*) yang super cepat, tangguh terhadap gangguan koneksi internet, tidak dapat dicurangi dengan mengubah jam komputer lokal, serta mampu menampung ribuan request autosave jawaban simultan tanpa membebani I/O database PostgreSQL.

---

## 2. Rincian User Story & Kriteria Penerimaan

### Story 4.1: Pengaturan Jadwal Ujian, Token & Randomization Engine
- **ID**: `US-4.1` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Guru / Panitia Ujian
- **Saya ingin**: Membuat sesi ujian dengan jadwal buka-tutup, token akses dinamis, alokasi durasi menit, serta opsi pengacakan butir soal dan opsi jawaban
- **Agar**: Integritas ujian terjaga dan siswa yang duduk berdampingan mendapatkan urutan soal dan opsi yang berbeda.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* Guru menjadwalkan ujian, *Then* baris data tersimpan di tabel `exams` dengan token unik (misal: `FLW-889`).
  - *Given* Siswa memasukkan token ujian dan menekan "Mulai Ujian", *Then* backend membuat sesi di tabel `exam_sessions` dengan seed acak unik (`question_order_seed`).
  - *Given* payload soal dikirimkan ke frontend, *Then* seluruh kolom `answer_keys` **telah di-strip/dihapus** di sisi backend sehingga kunci jawaban tidak dapat diintip melalui DevTools Network tab.
- **Tugas Teknis**:
  - [x] Migrasi tabel `exams`, `exam_sections`, `exam_questions`, dan `exam_sessions`.
  - [x] Implementasi algoritma *deterministic seeded shuffle* untuk butir soal dan opsi jawaban per siswa.
  - [x] Endpoint `POST /api/v1/exams/{id}/start-session` dengan validasi token dan jadwal PostgreSQL.

---

### Story 4.2: Antarmuka Ruang Ujian CBT (React 19 SPA & Zustand State Engine)
- **ID**: `US-4.2` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Siswa (*Student*)
- **Saya ingin**: Menjawab soal dengan antarmuka yang bersih, fokus, dilengkapi navigasi palet nomor soal (Terjawab, Belum Terjawab, Ragu-ragu), dan tombol pembesar ukuran font
- **Agar**: Saya dapat berkonsentrasi penuh selama mengerjakan ujian tanpa kebingungan mencari nomor soal.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siswa masuk ke ruang ujian, *Then* halaman otomatis meminta izin masuk ke mode Fullscreen.
  - *Given* siswa mengklik tombol nomor pada palet navigasi, *Then* nomor soal aktif berpindah seketika (< 10ms) menggunakan store state lokal Zustand tanpa re-render berlebih.
  - *Given* siswa menandai "Ragu-ragu", *Then* badge nomor pada palet navigasi berubah warna menjadi kuning.
- **Tugas Teknis**:
  - [x] Bangun komponen `ExamRoomLayout`, `QuestionDisplay`, `OptionSelector`, dan `QuestionPalette`.
  - [x] Buat Zustand store `useExamStore` (menyimpan: nomor aktif, status ragu-ragu, palet terisi, sisa detik).
  - [x] Render formula sains pada soal menggunakan komponen KaTeX.

---

### Story 4.3: Debounced Autosave Jawaban Siswa (800ms) & Buffer Redis 7+
- **ID**: `US-4.3` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Sistem CBT & Siswa
- **Saya ingin**: Jawaban yang saya pilih otomatis tersimpan ke server setiap kali saya memilih opsi atau mengetik esai dengan jeda debounce 800ms
- **Agar**: Saya tidak kehilangan jawaban saat listrik padam atau peramban tertutup secara tiba-tiba.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siswa memilih opsi jawaban, *Then* status UI lokal berubah hijau seketika (Optimistic UI) dan `@tanstack/react-query` mengirim request `PATCH /api/v1/exams/{id}/answers` setelah debounce 800ms.
  - *Given* request sampai di Laravel, *Then* backend menyimpan status jawaban ke cache Redis `exam_session:{id}:answers:{qid}` dan melakukan UPSERT ke tabel `student_answers`.
  - *Given* koneksi internet siswa terputus saat autosave berjalan, *Then* sistem memunculkan **SweetAlert2 Skenario C (Toast Pojok Layar)**: *"Koneksi terganggu! Jawaban nomor ini belum tersimpan ke server."* dan mengantrekan retry otomatis saat koneksi pulih.
- **Tugas Teknis**:
  - [x] Migrasi tabel `student_answers` dengan constraint `UNIQUE(exam_session_id, question_id)`.
  - [x] Implementasi custom hook React `useDebouncedAnswerPatch` (TanStack Query v5 mutation).
  - [x] Integrasikan fungsi helper SweetAlert2 Toast Skenario C (`showAutosaveErrorToast`).
  - [x] Optimasi Redis buffer untuk mencegah lonjakan I/O PostgreSQL saat pengerjaan serentak.

---

### Story 4.4: Sinkronisasi Waktu Sisi Server (Server-Authoritative Timer & Reverb)
- **ID**: `US-4.4` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Panitia Ujian
- **Saya ingin**: Sisa waktu ujian dihitung mutlak berdasarkan timestamp di server Laravel dan disinkronkan secara real-time via WebSocket Reverb
- **Agar**: Siswa tidak dapat menambah waktu ujian dengan cara memanipulasi jam di laptop atau mengganti zona waktu lokal mereka.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* sesi ujian dimulai, *Then* backend mencatat timestamp `server_expires_at = now() + duration_minutes`.
  - *Given* klien React terhubung ke private channel WebSocket Reverb `private-exam-session.{sessionId}`, *Then* server mengirimkan detak kalibrasi sisa waktu setiap 30 detik.
  - *Given* siswa mengubah jam di sistem operasi laptopnya, *Then* timer lokal Zustand otomatis terkalibrasi kembali sesuai timestamp resmi server.
  - *Given* sisa waktu mencapai 5 menit terakhir, *Then* Reverb mem-broadcast event `ExamTimeWarning` dan SweetAlert2 menampilkan toast peringatan waktu menipis.
  - *Given* sisa waktu mencapai 0 detik di server, *Then* Reverb mem-broadcast `ExamForceClosed` dan layar ujian siswa otomatis terkunci.
- **Tugas Teknis**:
  - [x] Buat Event `ServerTimeSyncEvent` dan `ExamTimeWarningEvent` di Laravel Reverb.
  - [x] Integrasikan channel listener di React 19 menggunakan `laravel-echo`.
  - [x] Buat fallback polling sync jika koneksi WebSocket terganggu.

---

## 3. Matriks Alokasi Story Points Sprint 4

| Story ID | Judul User Story | Estimasi Poin | PIC Utama |
| :--- | :--- | :---: | :--- |
| `US-4.1` | Pengaturan Ujian, Token & Randomization Engine | 13 SP | Backend Dev |
| `US-4.2` | Antarmuka Ruang Ujian CBT (React 19 & Zustand) | 13 SP | Frontend Dev |
| `US-4.3` | Debounced Autosave (800ms) & Buffer Redis 7+ | 13 SP | Fullstack Dev |
| `US-4.4` | Server-Authoritative Timer & WebSocket Reverb | 13 SP | Real-time / Backend Dev |
| **Total** | | **52 SP** + 33 SP (Subtasks, Offline Queue & Tests) = **85 SP** | Tim Scrum |

---

## 4. Kriteria Kelulusan Sprint 4 (Definition of Done)
1. Siswa dapat memulai ujian dengan validasi token dan mendapatkan soal teracak tanpa menyertakan kunci jawaban di network payload.
2. Navigasi nomor soal berjalan instan (< 10ms) menggunakan Zustand di React 19.
3. Autosave 800ms berfungsi mulus, meredam banjir request, dan menampilkan toast error SweetAlert2 jika jaringan mati.
4. Timer ujian terbukti kebal manipulasi jam lokal berkat kalibrasi server timestamp Laravel Reverb.
