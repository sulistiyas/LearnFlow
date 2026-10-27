# Sprint 3: Bank Soal Dinamis JSONB & Impor Massal Excel
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

| Parameter Sprint | Keterangan |
| :--- | :--- |
| **Durasi** | 2 Minggu (Hari Kerja 31 – 40) |
| **Target Story Points** | 80 SP |
| **Fokus Utama** | Desain Bank Soal fleksibel menggunakan kolom `JSONB` PostgreSQL 16+ berindeks GIN (mendukung 6 format soal), editor butir soal berbasis TipTap + KaTeX, sistem impor massal bank soal via spreadsheet `maatwebsite/excel` dengan validasi ketat, dan ekspor template Excel resmi. |

---

## 1. Sasaran Sprint (Sprint Goal)
Membangun sistem bank soal generasi baru yang mampu menampung beragam variasi soal modern (Pilihan Ganda, PG Kompleks, Menjodohkan, Esai, Skala Likert) tanpa perlu mengubah struktur migrasi tabel, serta mempermudah guru mengimpor ratusan butir soal secara massal dari file spreadsheet dengan validasi kesalahan baris per baris.

---

## 2. Rincian User Story & Kriteria Penerimaan

### Story 3.1: Skema Database Bank Soal Fleksibel (PostgreSQL 16+ JSONB & GIN)
- **ID**: `US-3.1` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Database & Backend Engineer
- **Saya ingin**: Menyimpan opsi jawaban dan kunci jawaban soal ke dalam kolom `options (JSONB)` dan `answer_keys (JSONB)` dengan indeks GIN
- **Agar**: Sistem mendukung penambahan variasi model soal baru secara instan dengan performa query tinggi.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* tabel `questions` dibuat di PostgreSQL 16+, *When* kolom `options` dan `answer_keys` diisi data JSON, *Then* indeks GIN `idx_questions_options_gin` dan `idx_questions_answer_keys_gin` memfasilitasi query pencarian JSON instan.
  - *Given* tipe soal yang disimpan berupa salah satu dari:
    - `single_choice` (Pilihan Ganda Biasa)
    - `multiple_choice_complex` (Pilihan Ganda Kompleks / Checkbox > 1 opsi benar)
    - `matching_pairs` (Menjodohkan pasangan kiri dan kanan)
    - `essay` (Esai dengan kata kunci & rubrik)
    - `likert_scale` (Survei evaluasi skala 1-5)
    - `true_false` (Benar atau Salah)
    *Then* struktur JSON tervalidasi sesuai skema Zod / Laravel Validator.
- **Tugas Teknis**:
  - [x] Migrasi tabel `question_banks`, `questions`, `question_tags`, dan `question_tag_map`.
  - [x] Terapkan Primary Key ULID pada seluruh tabel bank soal.
  - [x] Eksekusi DDL `CREATE INDEX ... USING gin (options)` dan `USING gin (answer_keys)`.
  - [x] Buat FormRequest validation untuk struktur JSON masing-masing tipe soal.

---

### Story 3.2: Antarmuka Editor Pembuatan Soal Interaktif (React 19 + TipTap + KaTeX)
- **ID**: `US-3.2` | **Estimasi**: `13 SP` | **Prioritas**: High (P1)
- **Sebagai**: Guru Pembuat Soal
- **Saya ingin**: Mengetik pertanyaan dan opsi jawaban dengan dukungan formula matematika LaTeX, gambar pendukung, dan pratinjau instan (*live preview*)
- **Agar**: Soal yang dibuat bebas dari kesalahan ketik formula sebelum diterbitkan ke siswa.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* guru memilih tipe soal "Menjodohkan", *Then* form UI menampilkan input pasangan dinamis (Kolom Kiri vs Kolom Kanan).
  - *Given* guru memilih "PG Kompleks", *Then* form memungkinkan mencentang lebih dari satu opsi kunci jawaban benar dengan pembagian bobot parsial.
  - *Given* tombol "Simpan Soal" ditekan, *Then* data terkirim via endpoint API dan tabel bank soal terupdate tanpa *full page reload*.
- **Tugas Teknis**:
  - [x] Buat komponen React form dinamis dengan `react-hook-form` + `zod` untuk 6 varian tipe soal.
  - [x] Integrasi rich text editor TipTap pada input pertanyaan dan setiap butir pilihan opsi.
  - [x] Komponen preview soal di sisi guru yang menyerupai tampilan nyata ujian siswa.

---

### Story 3.3: Impor Massal Bank Soal Spreadsheet (Maatwebsite Excel)
- **ID**: `US-3.3` | **Estimasi**: `13 SP` | **Prioritas**: High (P1)
- **Sebagai**: Guru / Administrator Ujian
- **Saya ingin**: Mengunggah ratusan butir soal sekaligus melalui berkas spreadsheet Excel (.xlsx / .csv)
- **Agar**: Saya tidak perlu menginput satu per satu butir soal secara manual ke sistem.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* guru mengunggah file template Excel, *When* sistem membaca file via `maatwebsite/excel`, *Then* sistem memvalidasi setiap baris (tipe soal, teks pertanyaan, opsi jawaban, dan kunci jawaban).
  - *Given* terdapat baris yang salah (misal: kunci jawaban tidak cocok dengan opsi yang tersedia), *Then* sistem menghentikan proses impor dan menampilkan **SweetAlert2 Modal Rekap Error** yang menyebutkan nomor baris dan deskripsi kesalahannya secara presisi.
  - *Given* seluruh baris valid, *Then* sistem melakukan *chunk batch insert* (100 baris/transaksi) ke PostgreSQL dan memunculkan SweetAlert2 Sukses.
- **Tugas Teknis**:
  - [x] Buat class `QuestionBankImport` menggunakan `WithHeadingRow`, `WithValidation`, `WithChunkReading`.
  - [x] Parsing otomatis kolom Excel ke struktur `options (JSONB)` dan `answer_keys (JSONB)`.
  - [x] Endpoint `POST /api/v1/question-banks/{id}/import-excel`.
  - [x] Komponen modal upload file dengan progress bar di React 19.

---

### Story 3.4: Unduh Template Excel & Ekspor Bank Soal
- **ID**: `US-3.4` | **Estimasi**: `5 SP` | **Prioritas**: Medium (P2)
- **Sebagai**: Guru
- **Saya ingin**: Mengunduh template resmi Excel berserta petunjuk pengisian format soal
- **Agar**: Format berkas yang saya isi sesuai dengan aturan parser sistem tanpa risiko ditolak.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* guru menekan tombol "Unduh Template Soal", *Then* browser mengunduh berkas `.xlsx` yang berisi header baku, lembar contoh (Pilihan Ganda, Menjodohkan, Esai), dan validasi dropdown sel.
- **Tugas Teknis**:
  - [x] Buat class `QuestionTemplateExport` dengan formula dropdown sel Excel.
  - [x] Endpoint `GET /api/v1/question-banks/template-excel`.

---

## 3. Matriks Alokasi Story Points Sprint 3

| Story ID | Judul User Story | Estimasi Poin | PIC Utama |
| :--- | :--- | :---: | :--- |
| `US-3.1` | Skema Database Bank Soal Fleksibel (PostgreSQL JSONB & GIN) | 13 SP | Database Specialist |
| `US-3.2` | Antarmuka Editor Pembuatan Soal Interaktif (React + TipTap) | 13 SP | Frontend Dev |
| `US-3.3` | Impor Massal Bank Soal Spreadsheet (Maatwebsite Excel) | 13 SP | Backend Dev |
| `US-3.4` | Unduh Template Excel & Ekspor Bank Soal | 5 SP | Backend Dev |
| **Total** | | **44 SP** + 36 SP (Subtasks, UI & Tests) = **80 SP** | Tim Scrum |

---

## 4. Kriteria Kelulusan Sprint 3 (Definition of Done)
1. Kolom PostgreSQL `options` dan `answer_keys` bertipe `JSONB` dapat menyimpan 6 format soal dengan indeks GIN aktif.
2. Guru dapat menginput soal dengan rumus LaTeX matematika dan formula sains secara presisi di antarmuka React 19.
3. Impor massal Excel berfungsi membaca file berisi 200+ soal, mendeteksi error dengan modal SweetAlert2, atau menyimpan secara *batch insert*.
4. Template resmi Excel dapat diunduh langsung dari dasbor guru.
