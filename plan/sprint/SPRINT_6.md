# Sprint 6: Sertifikasi Chromium, Analitik, Load Testing & Rilis
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

| Parameter Sprint | Keterangan |
| :--- | :--- |
| **Durasi** | 2 Minggu (Hari Kerja 61 – 70) |
| **Target Story Points** | 76 SP |
| **Fokus Utama** | Penerbitan sertifikat kelulusan otomatis berbasis Chromium headless (`spatie/laravel-pdf`) ke Cloudflare R2, kode QR verifikasi publik anti-pemalsuan, ekspor rekap nilai ujian massal via spreadsheet (`maatwebsite/excel`), dasbor analitik butir soal, uji beban K6 (1.000+ concurrent students), audit keamanan, dan rilis produksi. |

---

## 1. Sasaran Sprint (Sprint Goal)
Menyelesaikan siklus penuh pembelajaran dengan otomasi sertifikasi kelulusan terverifikasi QR, menyediakan analitik butir soal bagi pengajar, serta membuktikan kesiapan sistem menahan lonjakan ribuan siswa serentak melalui uji beban (*stress testing*) sebelum peluncuran resmi.

---

## 2. Rincian User Story & Kriteria Penerimaan

### Story 6.1: Generator Sertifikat Kelulusan Otomatis (Spatie Laravel PDF & Cloudflare R2)
- **ID**: `US-6.1` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Siswa yang telah menyelesaikan kursus
- **Saya ingin**: Mendapatkan sertifikat digital resmi beresolusi tinggi dalam format PDF yang langsung tersimpan di akun saya
- **Agar**: Saya memiliki bukti kelulusan yang valid dan dapat diunduh kapan saja.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siswa menuntaskan 100% modul pelajaran dan nilai CBT melampaui KKM, *When* sistem mendeteksi kelulusan, *Then* antrean Redis mengeksekusi job `GenerateCourseCertificate`.
  - *Given* job berjalan, *Then* `spatie/laravel-pdf` merender desain Blade dengan Chromium headless, menyematkan nomor sertifikat unik, nama siswa, dan SVG QR Code verifikasi.
  - *Given* file PDF selesai digenerate, *Then* berkas diunggah ke bucket Cloudflare R2 dan URL CDN-nya disimpan ke tabel `issued_certificates`.
  - *Given* proses berhasil, *Then* siswa menerima notifikasi real-time Reverb dan frontend menampilkan SweetAlert2 Modal Perayaan beranimasi.
- **Tugas Teknis**:
  - [x] Migrasi tabel `certificate_templates` dan `issued_certificates`.
  - [x] Setup package `spatie/laravel-pdf` dengan Chromium driver.
  - [x] Buat template Blade sertifikat elegan (A4 Landscape, font Inter/Outfit, border emas).
  - [x] Dispatch background job ke Redis queue.

---

### Story 6.2: Halaman Verifikasi Publik Sertifikat via Kode QR
- **ID**: `US-6.2` | **Estimasi**: `5 SP` | **Prioritas**: High (P1)
- **Sebagai**: Pihak Eksternal (Perusahaan / Institusi)
- **Saya ingin**: Memindai kode QR pada sertifikat dan diarahkan ke halaman verifikasi resmi
- **Agar**: Saya dapat memastikan keaslian sertifikat dan mencegah pemalsuan dokumen akademik.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siapapun memindai QR code atau mengakses `/verify/{code}`, *Then* sistem menampilkan data validasi publik: Nama Penerima, Judul Kursus, Tanggal Terbit, Status Berlaku, dan Nama Instruktur.
  - *Given* kode QR palsu atau tidak terdaftar, *Then* sistem menampilkan peringatan sertifikat tidak ditemukan.
- **Tugas Teknis**:
  - [x] Endpoint publik `GET /api/v1/certificates/{code}/verify`.
  - [x] Halaman verifikasi publik responsif di React 19 tanpa memerlukan login.

---

### Story 6.3: Ekspor Rekapitulasi Nilai Ujian Massal (Maatwebsite Excel)
- **ID**: `US-6.3` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: Guru / Bagian Tata Usaha
- **Saya ingin**: Mengunduh rekapitulasi nilai ujian seluruh siswa dalam format spreadsheet (.xlsx / .csv) lengkap dengan analisis per butir soal
- **Agar**: Nilai dapat diserahkan ke sistem akademik pusat atau diarsipkan secara offline.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* guru mengklik "Ekspor Rekap Nilai", *Then* job `ExportExamGradesJob` dieksekusi via antrean Redis.
  - *Given* file XLSX selesai dibuat dengan styling tabel dan penanda warna KKM, *Then* link download dikirimkan via WebSocket Reverb ke browser guru dan unduhan dimulai otomatis.
- **Tugas Teknis**:
  - [x] Buat Export class `ExamGradesExport` menggunakan `maatwebsite/excel`.
  - [x] Query data join teroptimasi (users, exam_grades, student_answers) tanpa masalah N+1.
  - [x] Simpan file sementara di Cloudflare R2 disk.

---

### Story 6.4: Dasbor Analisis Butir Soal & Statistik Ujian (React 19)
- **ID**: `US-6.4` | **Estimasi**: `8 SP` | **Prioritas**: Medium (P2)
- **Sebagai**: Guru Pembuat Soal
- **Saya ingin**: Melihat grafik distribusi skor nilai, tingkat kesukaran soal (*difficulty index*), dan daya pembeda butir soal (*discrimination index*)
- **Agar**: Saya dapat mengevaluasi butir soal mana yang terlalu mudah, terlalu sulit, atau membingungkan siswa.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* guru membuka statistik ujian, *Then* halaman menampilkan visualisasi grafik sebaran nilai (Histogram/Bar Chart) dan tabel status butir soal (Kategori: Baik, Perlu Revisi, Dibuang).
- **Tugas Teknis**:
  - [x] Algoritma kalkulasi tingkat kesukaran ($P = B / N$) dan daya pembeda ($D$) di backend.
  - [x] Endpoint `GET /api/v1/exams/{id}/analytics`.
  - [x] Komponen grafik visual interaktif di React 19.

---

### Story 6.5: Pengujian Beban Massal (Load Testing K6) & Hardening Keamanan
- **ID**: `US-6.5` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: DevOps Lead & Security Officer
- **Saya ingin**: Melakukan simulasi pengujian beban dengan K6 untuk 1.000+ siswa konkuren yang melakukan autosave bersamaan
- **Agar**: Server dipastikan stabil, p95 respons < 200ms, dan tidak terjadi crash memori atau deadlock basis data.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* skrip K6 mensimulasikan 1.000 virtual users mengerjakan ujian dengan pengiriman autosave setiap 800ms, *Then*:
    - Error rate HTTP 5xx < 0.1%.
    - Waktu respons p95 < 200ms.
    - CPU server dan koneksi PostgreSQL tetap di bawah 75% ambang batas.
  - *Given* audit keamanan dijalankan, *Then* seluruh endpoint tervalidasi kebal dari SQL Injection, Cross-Site Scripting (XSS), dan Broken Object Level Authorization (BOLA).
- **Tugas Teknis**:
  - [x] Buat skenario pengujian K6 `tests/load/cbt_simulation.js`.
  - [x] Tunning pool koneksi PostgreSQL 16+ dan alokasi memori Redis 7+.
  - [x] Finalisasi dokumentasi interaktif OpenAPI Scramble (`/docs/api`).

---

## 3. Matriks Alokasi Story Points Sprint 6

| Story ID | Judul User Story | Estimasi Poin | PIC Utama |
| :--- | :--- | :---: | :--- |
| `US-6.1` | Generator Sertifikat Otomatis Spatie PDF & Cloudflare R2 | 13 SP | Backend Dev |
| `US-6.2` | Halaman Verifikasi Publik Sertifikat via Kode QR | 5 SP | Frontend Dev |
| `US-6.3` | Ekspor Rekapitulasi Nilai Ujian Massal (Excel) | 8 SP | Backend Dev |
| `US-6.4` | Dasbor Analisis Butir Soal & Statistik Ujian | 8 SP | Fullstack Dev |
| `US-6.5` | Pengujian Beban K6 (1.000 Konkuren) & Hardening | 13 SP | DevOps / QA |
| **Total** | | **47 SP** + 29 SP (Spikes, Retrospective & Launch) = **76 SP** | Tim Scrum |

---

## 4. Kriteria Kelulusan Sprint 6 & Rilis Produksi (Final DoD)
1. Sertifikat kelulusan terbit otomatis dalam hitungan detik via Chromium headless, tersimpan aman di Cloudflare R2, dan dapat divalidasi keasliannya via pemindaian kode QR.
2. Rekapitulasi nilai ujian dapat diekspor ke Excel dengan format rapi tanpa memory exhaustion.
3. Analisis psikometrik butir soal membantu guru menyempurnakan kualitas bank soal.
4. Uji beban K6 membuktikan platform sanggup menampung 1.000+ siswa ujian simultan dengan performa prima.
5. Platform LearnFlow dinyatakan siap diluncurkan (*Production Launch Ready*).
