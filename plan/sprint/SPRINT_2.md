# Sprint 2: Kurikulum Akademik, Modul TipTap & Video HLS
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

| Parameter Sprint | Keterangan |
| :--- | :--- |
| **Durasi** | 2 Minggu (Hari Kerja 21 – 30) |
| **Target Story Points** | 82 SP |
| **Fokus Utama** | Manajemen hierarki kursus/modul, editor materi TipTap kaya fitur dengan KaTeX LaTeX matematika, pemutar video HLS adaptif Bunny.net menggunakan `plyr-react`, pelacakan progres tontonan materi, forum diskusi dengan PostgreSQL Full-Text Search, dan dialog SweetAlert2 penghapusan konten bahaya. |

---

## 1. Sasaran Sprint (Sprint Goal)
Menyediakan pengalaman belajar interaktif kelas dunia yang memadukan modul materi kaya visual, rumus sains/matematika instan, pemutaran video tanpa *buffering* berkat HLS adaptif, sistem pelacakan ketuntasan otomatis, serta forum diskusi kontekstual berkinerja tinggi.

---

## 2. Rincian User Story & Kriteria Penerimaan

### Story 2.1: Manajemen Kursus, Modul & Silabus Kurikulum
- **ID**: `US-2.1` | **Estimasi**: `8 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Guru / Dosen (*Instructor*)
- **Saya ingin**: Membuat kursus baru, menyusun struktur bab (*modules*), dan mengurutkan materi (*lessons*) dengan drag-and-drop
- **Agar**: Siswa memiliki alur pembelajaran yang terstruktur dan mudah diikuti.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* Guru mengisi formulir kursus, *When* disimpan, *Then* kursus tersimpan dengan kode unik dan slug ramah SEO.
  - *Given* Guru menambah modul dan materi, *Then* kolom `order_index` terupdate otomatis saat dilakukan re-ordering.
  - *Given* Guru/Admin menghapus modul ajar, *Then* muncul **SweetAlert2 Skenario D (Bahaya)** dengan tombol konfirmasi merah: *"Hapus Modul Beserta Seluruh Riwayat Siswa?"*.
- **Tugas Teknis**:
  - [x] Migrasi tabel `courses`, `modules`, dan `lessons`.
  - [x] CRUD endpoint REST API `/api/v1/courses` dan `/api/v1/courses/{id}/modules`.
  - [x] Antarmuka manajemen kurikulum React 19 dengan Accordion Shadcn/ui.
  - [x] Integrasi fungsi helper SweetAlert2 Skenario D (`confirmDangerAction`).

---

### Story 2.2: Editor Materi Pembelajaran TipTap Rich Text & KaTeX LaTeX
- **ID**: `US-2.2` | **Estimasi**: `13 SP` | **Prioritas**: High (P1)
- **Sebagai**: Guru Sains / Matematika
- **Saya ingin**: Mengetik modul ajar dengan formula matematika LaTeX, tabel data, gambar terkompresi, dan blok kode
- **Agar**: Materi eksakta dapat ditampilkan dengan akurasi visual tinggi tanpa memerlukan screenshot gambar manual.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* Guru mengetik kode LaTeX (misal: `\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}`), *Then* editor merender rumus seketika menggunakan KaTeX.
  - *Given* Guru menempelkan gambar ke editor, *Then* gambar otomatis diunggah ke Cloudflare R2 via `spatie/laravel-medialibrary` dan URL CDN-nya disisipkan ke tag HTML TipTap.
  - *Given* materi disimpan, *Then* konten HTML TipTap disimpan ke kolom `lessons.content_html`.
- **Tugas Teknis**:
  - [x] Setup komponen `@tiptap/react` dengan extension starter-kit, table, code-block, image, dan KaTeX custom extension.
  - [x] Endpoint upload media inline editor `/api/v1/media/upload-inline` (S3/R2).
  - [x] Komponen preview materi di sisi Siswa dengan sanitasi HTML aman (DOMPurify).

---

### Story 2.3: Pemutar Video Adaptif HLS (Plyr-React & Bunny.net Stream)
- **ID**: `US-2.3` | **Estimasi**: `13 SP` | **Prioritas**: High (P1)
- **Sebagai**: Siswa (*Student*)
- **Saya ingin**: Menonton video pembelajaran dengan multi-resolusi otomatis (360p - 1080p), pengatur kecepatan (0.75x - 2x), dan subtitle VTT
- **Agar**: Video berjalan lancar meskipun koneksi internet saya terbatas dan saya dapat belajar dengan tempo sendiri.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siswa membuka materi tipe video, *Then* backend menghasilkan signed token URL Bunny.net Stream berdurasi terbatas (mencegah pembajakan tautan).
  - *Given* video diputar via `plyr-react`, *Then* opsi kualitas adaptif (360p, 480p, 720p, 1080p) tersedia di kontrol pemain.
  - *Given* file subtitle `.vtt` tersedia, *Then* teks terjemahan/transkrip dapat diaktifkan.
- **Tugas Teknis**:
  - [x] Integrasi `BunnyStreamService` di Laravel untuk penandatanganan token otentikasi SHA256.
  - [x] Komponen pemutar video `plyr-react` dengan konfigurasi HLS.js.
  - [x] Error handling jika token streaming kedaluwarsa.

---

### Story 2.4: Pelacakan Progres Tontonan & Ketuntasan Materi
- **ID**: `US-2.4` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: Sistem Akademik
- **Saya ingin**: Melacak persentase tontonan video siswa dan menandai materi selesai jika telah melampaui batas minimal (misal: 85%)
- **Agar**: Siswa tidak dapat melewati (*skip*) video secara curang untuk mendapatkan sertifikat kelulusan.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* video sedang diputar, *When* siswa mencapai detik tertentu, *Then* event `timeupdate` mengirimkan progres ke backend setiap 10 detik.
  - *Given* persentase tontonan melampaui `min_watch_percentage` (85%), *Then* baris `lesson_progress` diupdate dengan `status = 'completed'` dan timestamp `completed_at`.
  - *Given* materi selesai, *Then* muncul SweetAlert2 Toast perayaan di sisi siswa.
- **Tugas Teknis**:
  - [x] Migrasi tabel `lesson_progress`.
  - [x] Endpoint `POST /api/v1/lessons/{id}/track-progress`.
  - [x] Logika debounce pengiriman posisi detik pemutaran dari `plyr-react`.

---

### Story 2.5: Forum Diskusi Materi dengan PostgreSQL Full-Text Search
- **ID**: `US-2.5` | **Estimasi**: `8 SP` | **Prioritas**: Medium (P2)
- **Sebagai**: Siswa dan Guru
- **Saya ingin**: Berdiskusi pada topik materi tertentu dan mencari percakapan lampau menggunakan fitur pencarian cepat
- **Agar**: Pertanyaan seputar materi pembelajaran dapat terjawab secara kolaboratif dan mudah ditemukan kembali.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* siswa membuat pertanyaan di forum, *Then* baris tersimpan di `forum_threads` dengan relasi `course_id` dan `lesson_id`.
  - *Given* pengguna mengetik kata kunci di kotak pencarian forum, *Then* PostgreSQL mengeksekusi query `WHERE to_tsvector('indonesian', title || ' ' || content) @@ plainto_tsquery('indonesian', :keyword)` menggunakan GIN index dengan waktu respons < 50ms.
- **Tugas Teknis**:
  - [x] Migrasi tabel `forum_threads` dan `forum_replies`.
  - [x] Tambahkan GIN Index Full-Text Search di PostgreSQL.
  - [x] Buat endpoint `GET /api/v1/courses/{id}/forum` dengan filter pencarian FTS.
  - [x] Buat komponen antarmuka thread diskusi di React 19.

---

## 3. Matriks Alokasi Story Points Sprint 2

| Story ID | Judul User Story | Estimasi Poin | PIC Utama |
| :--- | :--- | :---: | :--- |
| `US-2.1` | Manajemen Kursus, Modul & Silabus Kurikulum | 8 SP | Backend Dev |
| `US-2.2` | Editor Materi TipTap Rich Text & KaTeX LaTeX | 13 SP | Frontend Dev |
| `US-2.3` | Pemutar Video Adaptif HLS Plyr-React & Bunny.net | 13 SP | Fullstack Dev |
| `US-2.4` | Pelacakan Progres Tontonan & Ketuntasan Materi | 8 SP | Backend Dev |
| `US-2.5` | Forum Diskusi dengan PostgreSQL Full-Text Search | 8 SP | Database Dev |
| **Total** | | **50 SP** + 32 SP (Subtasks & Tests) = **82 SP** | Tim Scrum |

---

## 4. Kriteria Kelulusan Sprint 2 (Definition of Done)
1. Modul dan materi dapat dibuat dan diurutkan oleh instruktur dengan mulus.
2. Rumus matematika dan fisika berformat LaTeX berhasil dirender dengan KaTeX di TipTap editor dan sisi pembaca.
3. Pemutaran video Bunny.net Stream HLS berfungsi adaptif pada berbagai resolusi dengan token proteksi anti-bajak.
4. Persentase tontonan video tersimpan akurat dan memicu status tuntas materi secara otomatis.
5. Pencarian forum diskusi PostgreSQL Full-Text Search berjalan instan dengan dukungan indeks GIN.
