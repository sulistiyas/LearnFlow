# Dokumen Perencanaan Arsitektur & Desain Sistem (LearnFlow)

Selamat datang di repositori perencanaan arsitektur platform **LearnFlow** — sistem *Learning Management System* (LMS) dan *Computer Based Testing* (CBT) enterprise generasi baru berbasis **Laravel 13 REST API**, database **PostgreSQL 16+**, frontend **React 19**, **Laravel Reverb WebSocket**, dan antarmuka dialog interaktif **SweetAlert2**.

Seluruh dokumen di dalam direktori `plan/` ini disusun berdasarkan dokumen resmi **Spesifikasi Tech Stack & Plugin E-Learning Platform Modern (Moodle Alternative)**.

---

## Daftar Berkas Perencanaan

Berikut adalah berkas-berkas arsitektur dan spesifikasi teknis yang telah dibuat:

| Berkas | Deskripsi & Isi Utama |
| :--- | :--- |
| **[ERD.md](file:///c:/laragon/www/LearnFlow/plan/ERD.md)** | **Entity Relationship Diagram & Database Specification**<br/>• Diagram Mermaid ERD global.<br/>• Kamus data lengkap (17 tabel relasional).<br/>• Strategi kolom dinamis `JSONB` dengan GIN Index PostgreSQL 16+.<br/>• Keamanan URL berbasis ULID (`CHAR(26)`).<br/>• Pencarian teks cepat bawaan (*Full-Text Search* `to_tsvector`).<br/>• Jaminan integritas ACID saat ujian massal serentak. |
| **[FLOWCHART.md](file:///c:/laragon/www/LearnFlow/plan/FLOWCHART.md)** | **Flowchart & Sequence Architecture Specification**<br/>• Diagram Alir Arsitektur Master Decoupled (API-First).<br/>• Sequence Diagram Autentikasi Sanctum & RBAC Multi-Peran Spatie.<br/>• Alur Pengerjaan Ujian Online (CBT Engine) end-to-end.<br/>• Sequence Diagram Autosave Jawaban Debounced 800ms via TanStack Query.<br/>• Sequence Diagram Sinkronisasi Timer Sisi Server via Laravel Reverb.<br/>• Alur Deteksi Pelanggaran Anti-Cheat & Modal Kunci SweetAlert2.<br/>• Alur Evaluasi Otomatis (Auto-Grading) & Penilaian Esai Guru.<br/>• Alur Penerbitan Sertifikat Kelulusan Otomatis (Chromium PDF & Cloudflare R2).<br/>• Alur Impor Bank Soal & Ekspor Nilai Spreadsheet (Maatwebsite Excel). |
| **[ARCHITECTURE_SYSTEM_DESIGN.md](file:///c:/laragon/www/LearnFlow/plan/ARCHITECTURE_SYSTEM_DESIGN.md)** | **System Architecture & Engineering Blueprint**<br/>• Matriks Komparasi Moodle Tradisional vs LearnFlow Modern.<br/>• Spesifikasi Backend Laravel 13 & daftar paket Composer standar industri.<br/>• Spesifikasi Frontend React 19 SPA & pustaka NPM pendukung.<br/>• Kode implementasi 4 Skenario Khusus SweetAlert2 (Submit Terproteksi, Anti-Cheat, Toast Autosave, Bahaya Hapus).<br/>• Arsitektur WebSocket Real-Time Laravel Reverb & Echo.<br/>• Strategi Penyimpanan Media Cloudflare R2 (Bebas Egress) & Bunny.net Stream HLS.<br/>• Skema Kunci Redis 7+ Cache & Buffer.<br/>• Panduan instalasi dan deployment cepat. |
| **[sprint/README.md](file:///c:/laragon/www/LearnFlow/plan/sprint/README.md)** | **Agile Scrum Framework & Master Roadmap**<br/>• Tata kelola Scrum (ritme 2 minggu, upacara, peran tim).<br/>• Standar mutu *Definition of Ready (DoR)* & *Definition of Done (DoD)*.<br/>• Peta jalan 7 sprint (Sprint 0 s.d. Sprint 6) berbobot total 558 Story Points. |
| **[sprint/SPRINT_0.md](file:///c:/laragon/www/LearnFlow/plan/sprint/SPRINT_0.md)** | **Sprint 0: Fondasi Arsitektur, Infrastruktur & Scaffolding (75 SP)**<br/>Laravel 13, React 19 Vite, PostgreSQL 16+ ULID, Redis 7+, Cloudflare R2, Bunny.net, CI/CD. |
| **[sprint/SPRINT_1.md](file:///c:/laragon/www/LearnFlow/plan/sprint/SPRINT_1.md)** | **Sprint 1: Autentikasi Sanctum, Multi-Peran Spatie & Profil (78 SP)**<br/>HTTP-Only cookie auth, RBAC 5 role, upload avatar R2, portal wali murid, audit log auth. |
| **[sprint/SPRINT_2.md](file:///c:/laragon/www/LearnFlow/plan/sprint/SPRINT_2.md)** | **Sprint 2: Kurikulum Akademik, Modul TipTap & Video HLS (82 SP)**<br/>Hierarki kursus, editor TipTap + KaTeX LaTeX, streaming Bunny.net HLS, progres tonton, forum FTS. |
| **[sprint/SPRINT_3.md](file:///c:/laragon/www/LearnFlow/plan/sprint/SPRINT_3.md)** | **Sprint 3: Bank Soal Dinamis JSONB & Impor Massal Excel (80 SP)**<br/>Bank soal 6 tipe, GIN index, Maatwebsite Excel import dengan validasi baris, template XLSX. |
| **[sprint/SPRINT_4.md](file:///c:/laragon/www/LearnFlow/plan/sprint/SPRINT_4.md)** | **Sprint 4: Engine Ujian CBT, WebSocket Reverb & Autosave (85 SP)**<br/>Randomizer ber-seed, Reverb timer server, TanStack Query debounced autosave (800ms), buffer Redis. |
| **[sprint/SPRINT_5.md](file:///c:/laragon/www/LearnFlow/plan/sprint/SPRINT_5.md)** | **Sprint 5: Anti-Cheat Terkunci, Dialog SweetAlert2 & Penilaian (84 SP)**<br/>Deteksi perpindahan tab, SweetAlert2 modal lock, proctor dashboard, auto-grading ACID, rubrik esai. |
| **[sprint/SPRINT_6.md](file:///c:/laragon/www/LearnFlow/plan/sprint/SPRINT_6.md)** | **Sprint 6: Sertifikasi Chromium, Analitik, Load Testing & Rilis (76 SP)**<br/>Spatie PDF Chromium ke R2, QR verify publik, ekspor nilai Excel, stress test K6 1000 user, rilis. |

---

## Ringkasan Fitur Unggulan Sistem

```
                                  +---------------------------------------+
                                  |     React 19 SPA (Client Layer)       |
                                  |  TanStack Query v5 + Zustand + TipTap |
                                  |     KaTeX + Plyr + SweetAlert2        |
                                  +---------------------------------------+
                                                     |
                                   REST API (JSON)   |   WebSocket (WSS)
                                   (Laravel Sanctum) |   (Laravel Reverb)
                                                     v
                                  +---------------------------------------+
                                  |     Laravel 13 REST API Core          |
                                  |   Spatie RBAC, Media, PDF, Activity   |
                                  +---------------------------------------+
                                           |                      |
                    ACID / GIN Index / FTS |                      | Session / Buffer
                                           v                      v
                             +--------------------+     +-------------------+
                             |   PostgreSQL 16+   |     |      Redis 7+     |
                             |   ULID + JSONB     |     |   CBT Active Cache|
                             +--------------------+     +-------------------+
                                           |
                                           | S3 API & HLS Streaming
                                           v
                             +--------------------------------------------+
                             | Cloudflare R2 (Zero Egress PDF/Media)      |
                             | Bunny.net Stream (Multi-Bitrate HLS Video) |
                             +--------------------------------------------+
```

1. **Ujian Online CBT Skala Masif**:
   - Pengacakan soal dan opsi jawaban per siswa menggunakan *random seed*.
   - Timer mutlak berbasis timestamp server — manipulasi jam komputer lokal tidak akan menambah durasi ujian.
   - Autosave responsif dengan debounce 800ms mencegah beban berlebih pada database.
   - Deteksi anti-cheat real-time via `visibilitychange` dan window blur, memicu modal SweetAlert2 terkunci.
2. **Kaya Format Soal (PostgreSQL JSONB)**:
   - Mendukung Pilihan Ganda, PG Kompleks, Menjodohkan, Esai, dan Skala Likert tanpa perlu merubah skema migrasi tabel.
3. **Optimasi Bandwidth & Biaya**:
   - Cloudflare R2 membebaskan biaya transfer keluar (*zero egress fees*) saat ribuan siswa mengunduh PDF modul secara simultan.
   - Transcoding multi-resolusi otomatis Bunny.net Stream (360p - 1080p) menghemat bandwidth kuota internet siswa.
4. **Keamanan & Standar Enterprise**:
   - Autentikasi cookie HTTP-Only via Laravel Sanctum (kebal XSS).
   - Seluruh entitas dilindungi ULID 26 karakter mencegah eksploitasi enumerasi URL.
   - Pencatatan log audit lengkap (*audit trail*) untuk revisi nilai dan aktivitas ujian.
