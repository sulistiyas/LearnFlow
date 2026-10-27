# Sprint 1: Autentikasi Sanctum, Multi-Peran Spatie & Profil
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

| Parameter Sprint | Keterangan |
| :--- | :--- |
| **Durasi** | 2 Minggu (Hari Kerja 11 – 20) |
| **Target Story Points** | 78 SP |
| **Fokus Utama** | Autentikasi aman berbasis Laravel Sanctum (HTTP-Only Cookie untuk SPA dan Bearer Token untuk API), manajemen hak akses 5 peran dengan Spatie Permission, profil pengguna, upload avatar ke Cloudflare R2, relasi Wali Murid, dan pencatatan audit log aktivitas otentikasi. |

---

## 1. Sasaran Sprint (Sprint Goal)
Menyelesaikan sistem identitas dan otorisasi yang aman dari serangan XSS/CSRF, mengimplementasikan 5 peran pengguna (`superadmin`, `instructor`, `teaching_assistant`, `student`, `parent`), serta menyediakan halaman portal profil mandiri dan relasi pemantauan wali murid.

---

## 2. Rincian User Story & Kriteria Penerimaan

### Story 1.1: Autentikasi Aman SPA Laravel Sanctum (Login, Logout, Session)
- **ID**: `US-1.1` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Seluruh Pengguna Sistem
- **Saya ingin**: Melakukan login menggunakan email/username dan password dengan mekanisme proteksi sesi HTTP-Only Cookie
- **Agar**: Token otentikasi saya aman dan tidak dapat dicuri oleh skrip berbahaya di peramban (XSS).
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* pengguna mengakses form login React 19, *When* pengguna memasukkan kredensial yang valid, *Then* backend mengembalikan HTTP-Only Session Cookie dan status 200 OK beserta payload profil singkat & roles.
  - *Given* kredensial tidak valid, *Then* backend mengembalikan HTTP 422/401 dan frontend menampilkan SweetAlert2 Toast: *"Kredensial tidak valid"*.
  - *Given* pengguna menekan tombol logout, *Then* sesi di server dihancurkan, cookie dihapus, dan state Zustand dibersihkan.
- **Tugas Teknis**:
  - [x] Implementasi endpoint `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`.
  - [x] Konfigurasi middleware `EnsureFrontendRequestsAreStateful`.
  - [x] Buat Zustand Auth Store (`useAuthStore`) untuk melacak status user aktif dan permission.
  - [x] Buat komponen React Protected Route berbasis peran (`<RoleGate allowedRoles={['instructor', 'superadmin']} />`).

---

### Story 1.2: Implementasi Otorisasi Multi-Peran (Spatie Laravel Permission)
- **ID**: `US-1.2` | **Estimasi**: `13 SP` | **Prioritas**: Critical (P0)
- **Sebagai**: Superadmin
- **Saya ingin**: Menetapkan peran spesifik (`superadmin`, `instructor`, `teaching_assistant`, `student`, `parent`) dan permission kepada akun pengguna
- **Agar**: Setiap pengguna hanya dapat mengakses fitur yang menjadi hak dan tanggung jawabnya.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* seeder database dijalankan, *Then* 5 peran default dan daftar permission awal (misal: `exam.create`, `grade.revise`, `student.violation_view`) terdaftar di tabel `roles` dan `permissions`.
  - *Given* seorang Siswa mencoba mengakses endpoint Guru (misal: `POST /api/v1/exams`), *Then* sistem menolak dengan HTTP 403 Forbidden.
  - *Given* Superadmin mengakses dashboard, *Then* Superadmin dapat menambah/mencabut peran pengguna lain.
- **Tugas Teknis**:
  - [x] Migrasi tabel Spatie Permission dengan dukungan primary key ULID.
  - [x] Buat `RoleSeeder` dan `PermissionSeeder`.
  - [x] Buat FormRequest validasi penetapan peran dan controller admin.
  - [x] Integrasikan audit log (`spatie/laravel-activitylog`) setiap kali ada perubahan peran pengguna.

---

### Story 1.3: Pengelolaan Profil Pengguna & Avatar Cloudflare R2
- **ID**: `US-1.3` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: Pengguna (Guru, Siswa, Wali)
- **Saya ingin**: Mengubah informasi profil dan mengunggah foto avatar
- **Agar**: Identitas saya pada sistem pembelajaran mutakhir dan mudah dikenali.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* pengguna mengunggah foto avatar (JPEG/PNG/WebP maks 2MB), *Then* `spatie/laravel-medialibrary` memproses, mengompresi, dan mengunggah gambar ke bucket Cloudflare R2.
  - *Given* gambar tersimpan, *Then* URL CDN R2 disimpan pada profil pengguna dan ditampilkan di navbar React 19.
  - *Given* unggahan berhasil, *Then* muncul SweetAlert2 Toast: *"Profil dan avatar berhasil diperbarui"*.
- **Tugas Teknis**:
  - [x] Hubungkan model `User` dengan trait `InteractsWithMedia`.
  - [x] Buat konversi media otomatis (thumbnail 150x150, webp).
  - [x] Buat form profil React 19 menggunakan `react-hook-form` + `zod`.
  - [x] Uji pengunggahan avatar ke disk `r2`.

---

### Story 1.4: Portal & Relasi Wali Murid (Parent - Student Linking)
- **ID**: `US-1.4` | **Estimasi**: `8 SP` | **Prioritas**: High (P1)
- **Sebagai**: Wali Murid (*Parent*)
- **Saya ingin**: Menghubungkan akun saya dengan akun siswa/anak saya melalui kode verifikasi siswa
- **Agar**: Saya dapat memantau kehadiran, progres materi, dan kartu hasil ujian anak saya.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* Wali Murid memasukkan Nomor Induk Siswa (NIS) dan kode verifikasi siswa, *Then* baris relasi terbentuk di tabel `parent_students`.
  - *Given* akun terhubung, *Then* Wali Murid dapat melihat daftar anak asuhnya pada halaman `/parent/wards`.
- **Tugas Teknis**:
  - [x] Migrasi tabel `parent_students` (relasi `parent_id` dan `student_id`).
  - [x] Buat endpoint `POST /api/v1/parent/link-student` dan `GET /api/v1/parent/wards`.
  - [x] Buat komponen kartu anak didik pada antarmuka Wali Murid.

---

### Story 1.5: Audit Trail Aktivitas Otentikasi & Mutasi Pengguna
- **ID**: `US-1.5` | **Estimasi**: `5 SP` | **Prioritas**: Medium (P2)
- **Sebagai**: Superadmin / Petugas Kepatuhan
- **Saya ingin**: Memantau log riwayat login, perubahan password, dan modifikasi data pengguna
- **Agar**: Setiap aktivitas mencurigakan dapat dilacak secara forensik.
- **Kriteria Penerimaan (Acceptance Criteria)**:
  - *Given* pengguna berhasil login atau gagal login, *Then* entri tercatat di tabel `activity_log` mencakup alamat IP (`last_login_ip`), timestamp, dan user agent.
- **Tugas Teknis**:
  - [x] Event listener pada event `Illuminate\Auth\Events\Login` dan `Failed`.
  - [x] Integrasi `activity('auth')->causedBy($user)->log(...)`.
  - [x] Buat tabel riwayat aktivitas sederhana pada antarmuka admin.

---

## 3. Matriks Alokasi Story Points Sprint 1

| Story ID | Judul User Story | Estimasi Poin | PIC Utama |
| :--- | :--- | :---: | :--- |
| `US-1.1` | Autentikasi SPA Laravel Sanctum (Login, Logout, Session) | 13 SP | Fullstack Dev |
| `US-1.2` | Otorisasi Multi-Peran Spatie Laravel Permission | 13 SP | Backend Dev |
| `US-1.3` | Pengelolaan Profil Pengguna & Avatar Cloudflare R2 | 8 SP | Frontend Dev |
| `US-1.4` | Portal & Relasi Wali Murid (Parent - Student Linking) | 8 SP | Fullstack Dev |
| `US-1.5` | Audit Trail Aktivitas Otentikasi & Mutasi Pengguna | 5 SP | Backend Dev |
| **Total** | | **47 SP** + 31 SP (Subtasks & Tests) = **78 SP** | Tim Scrum |

---

## 4. Kriteria Kelulusan Sprint 1 (Definition of Done)
1. Fitur login/logout aman dengan cookie HTTP-Only teruji di lingkungan React 19 SPA.
2. 5 Peran pengguna berfungsi penuh membatasi akses rute frontend dan endpoint backend.
3. Berkas avatar profil tersimpan rapi di Cloudflare R2 dan terdistribusi via CDN.
4. Portal penghubung akun orang tua dan siswa dapat memverifikasi relasi anak asuh.
5. Log audit aktivitas otentikasi terekam akurat di PostgreSQL 16+.
