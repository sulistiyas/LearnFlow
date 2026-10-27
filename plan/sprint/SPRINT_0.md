# Sprint 0: Fondasi Arsitektur, Infrastruktur & Scaffolding
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

| Parameter Sprint | Keterangan |
| :--- | :--- |
| **Durasi** | 2 Minggu (Hari Kerja 1 – 10) |
| **Target Story Points** | 75 SP |
| **Fokus Utama** | Pemasangan infrastruktur dasar, monorepo/decoupled scaffolding, setup database PostgreSQL 16+ dengan generator ULID, Redis 7+, Cloudflare R2 bucket, Bunny.net Stream API, pipeline CI/CD, dan dependensi pustaka resmi. |

---

## 1. Sasaran Sprint (Sprint Goal)
Membangun fondasi infrastruktur teknis yang kokoh, lingkungan kerja lokal yang konsisten, pipeline CI/CD otomatis, serta struktur proyek *backend* (Laravel 13 REST API) dan *frontend* (React 19 + TypeScript + Vite) yang siap menopang seluruh siklus pengembangan fitur selanjutnya.

---

## 2. Rincian User Story & Tugas Teknis

### Story 0.1: Scaffolding Backend Laravel 13 REST API & Composer Ecosystem
- **ID**: `US-0.1` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Developer Backend
- **Saya ingin**: Menginstal Laravel 13 REST API dengan seluruh paket Composer standar industri yang disyaratkan pada dokumen spesifikasi
- **Agar**: Seluruh tim backend memiliki dependensi resmi yang terverifikasi dan siap digunakan.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* repositori backend baru dibuat, *When* `composer install` dijalankan, *Then* seluruh paket berikut terpasang tanpa konflik versi:
    - `laravel/sanctum`
    - `spatie/laravel-permission`
    - `spatie/laravel-medialibrary`
    - `laravel/reverb`
    - `dedoc/scramble`
    - `maatwebsite/excel`
    - `spatie/laravel-activitylog`
    - `spatie/laravel-pdf`
  - *Given* perintah `php artisan reverb:install` dijalankan, *Then* server Reverb terkonfigurasi dan listening pada port 8080.
  - *Given* peramban mengakses endpoint `/docs/api`, *Then* halaman interaktif OpenAPI Swagger Scramble tampil dengan benar.
- **Tugas Teknis**:
  - [x] Inisialisasi proyek Laravel 13 API.
  - [x] Konfigurasi `config/cors.php` untuk mengizinkan request dari frontend SPA React 19 dengan `supports_credentials: true`.
  - [x] Publikasi service provider dan file konfigurasi seluruh paket Spatie.
  - [x] Setup standarisasi kode PHP menggunakan Laravel Pint (`vendor/bin/pint`).

---

### Story 0.2: Konfigurasi Database PostgreSQL 16+ & Redis 7+
- **ID**: `US-0.2` | **Estimasi**: `8 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Database Engineer
- **Saya ingin**: Menyiapkan database PostgreSQL 16+ dan Redis 7+ dengan dukungan ekstensi dan generator primary key ULID
- **Agar**: Seluruh tabel masa depan menggunakan identifier yang aman dari serangan enumerasi dan cache performa tinggi.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* migrasi database dieksekusi, *Then* tabel awal terbentuk menggunakan tipe data `CHAR(26)` untuk Primary Key berbasis ULID bawaan Laravel (`$table->ulid('id')->primary()`).
  - *Given* koneksi database dites, *Then* PostgreSQL 16+ mengizinkan tipe data `jsonb` dan pembuatan indeks `GIN`.
  - *Given* koneksi Redis diuji melalui `Cache::store('redis')->put('test', 'ok', 60)`, *Then* nilai berhasil tersimpan dan terbaca dari Redis 7+.
- **Tugas Teknis**:
  - [x] Konfigurasi `.env` untuk koneksi PostgreSQL 16+ (port 5432) dan Redis 7+ (port 6379).
  - [x] Buat trait `HasUlids` pada BaseModel Eloquent.
  - [x] Buat skrip health check database dan Redis di `routes/api.php` (`/api/v1/health`).

---

### Story 0.3: Scaffolding Frontend React 19 SPA, Vite & TailwindCSS
- **ID**: `US-0.3` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Developer Frontend
- **Saya ingin**: Melakukan setup proyek React 19 + TypeScript menggunakan Vite, TailwindCSS, dan Shadcn/ui
- **Agar**: Pengembang UI memiliki komponen antarmuka yang modern, konsisten, dan berkinerja tinggi.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* direktori frontend dijalankan dengan `npm run dev`, *Then* aplikasi React 19 Vite menyala dalam < 300ms tanpa error TypeScript.
  - *Given* paket pustaka frontend diinstal, *Then* `package.json` menyertakan:
    - `@tanstack/react-query` v5
    - `zustand`
    - `sweetalert2` & `sweetalert2-react-content`
    - `react-hook-form` & `zod`
    - `@tiptap/react` & `@tiptap/starter-kit`
    - `katex`
    - `plyr-react`
    - `laravel-echo` & `pusher-js`
    - `lucide-react`
  - *Given* komponen tombol atau dialog Shadcn/ui dipanggil, *Then* komponen tampil dengan styling TailwindCSS yang rapi.
- **Tugas Teknis**:
  - [x] `npm create vite@latest frontend -- --template react-ts`.
  - [x] Inisialisasi TailwindCSS, PostCSS, dan konfigurasi path alias `@/*` di `tsconfig.json`.
  - [x] Buat template wrapper untuk `sweetalert2-react-content`.
  - [x] Setup client HTTP Axios dengan interceptor CSRF cookie dan penanganan error 401/403.

---

### Story 0.4: Integrasi Cloud Storage (Cloudflare R2) & Streaming Video (Bunny.net)
- **ID**: `US-0.4` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: DevOps Engineer
- **Saya ingin**: Mengonfigurasi kredensial S3-compatible Cloudflare R2 dan API Bunny.net Stream
- **Agar**: Sistem siap menyimpan berkas PDF/tugas tanpa biaya egress dan siap menyiarkan video pembelajaran adaptif HLS.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* file sampel diunggah via Laravel Storage disk `r2`, *Then* file tersimpan di bucket Cloudflare R2 dan dapat diakses melalui URL CDN.
  - *Given* kredensial Bunny.net dikonfigurasi, *Then* endpoint API dapat melakukan request pembuatan signed token URL video.
- **Tugas Teknis**:
  - [x] Konfigurasi disk `r2` di `config/filesystems.php` menggunakan driver S3.
  - [x] Buat service helper `BunnyStreamService` untuk pembuatan token otentikasi video HLS.
  - [x] Uji konektivitas unggah dan hapus file sampel ke Cloudflare R2.

---

### Story 0.5: Otomasi Pipeline CI/CD & Standarisasi Git
- **ID**: `US-0.5` | **Estimasi**: `5 SP` | **Prioritas**: Medium (P2)
- **Sebagai**: Tim Pengembang
- **Saya ingin**: Memiliki pipeline GitHub Actions / GitLab CI untuk pengujian otomatis setiap pull request
- **Agar**: Kualitas kode terjaga dan tidak terjadi regresi fungsi.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* sebuah Pull Request dibuka ke branch `develop`, *Then* CI otomatis menjalankan:
    - Backend: `php artisan test` dan `vendor/bin/pint --test`.
    - Frontend: `npm run lint` dan `npm run build`.
- **Tugas Teknis**:
  - [x] Buat workflow `.github/workflows/ci.yml`.
  - [x] Konfigurasi pre-commit git hooks menggunakan Husky untuk mencegah commit kode yang tidak lolos linter.

---

## 3. Matriks Alokasi Story Points Sprint 0

| Story ID | Judul User Story | Estimasi Poin | PIC Utama |
| :--- | :--- | :---: | :--- |
| `US-0.1` | Scaffolding Laravel 13 REST API & Composer Ecosystem | 13 SP | Backend Lead |
| `US-0.2` | Konfigurasi Database PostgreSQL 16+ & Redis 7+ | 8 SP | Database Specialist |
| `US-0.3` | Scaffolding Frontend React 19 SPA & Tailwind/Shadcn | 13 SP | Frontend Lead |
| `US-0.4` | Integrasi Cloud Storage Cloudflare R2 & Bunny.net | 8 SP | DevOps Engineer |
| `US-0.5` | Pipeline CI/CD & Standarisasi Git | 5 SP | DevOps / QA |
| **Total** | | **47 SP** + 28 SP Spikes = **75 SP** | Tim Scrum |

---

## 4. Kriteria Kelulusan Sprint 0 (Definition of Done)
1. Seluruh paket resmi Composer & NPM berhasil terpasang tanpa konflik versi.
2. Server Laravel API, PostgreSQL 16+, Redis 7+, dan Reverb WebSocket dapat berjalan di mesin pengembang lokal.
3. Frontend React 19 Vite dapat berkomunikasi dengan API Laravel melalui request axios CORS dengan kredensial cookie.
4. Pipeline CI berhasil hijau pada repositori utama.
