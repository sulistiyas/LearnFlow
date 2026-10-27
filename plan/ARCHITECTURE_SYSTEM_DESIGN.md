# Blueprint Arsitektur & Desain Sistem Komprehensif
## E-Learning & Computer Based Testing (CBT) Platform Modern (LearnFlow)

Dokumen ini merupakan panduan arsitektur sistem tingkat tinggi (*System Architecture & Engineering Blueprint*) yang menyatukan spesifikasi teknis dari dokumen **Spesifikasi Tech Stack**, desain database PostgreSQL 16+ pada [ERD.md](file:///c:/laragon/www/LearnFlow/plan/ERD.md), dan diagram alur pada [FLOWCHART.md](file:///c:/laragon/www/LearnFlow/plan/FLOWCHART.md).

---

## 1. Ringkasan Eksekutif & Karakteristik Sistem

LearnFlow adalah platform Learning Management System (LMS) dan Computer Based Testing (CBT) generasi baru yang dibangun sebagai alternatif modern untuk Moodle. Dengan beralih dari pola monolitik PHP tradisional ke **Pola Arsitektur Terpisah (*Decoupled API-First Architecture*)**, LearnFlow mengatasi kelemahan klasik berupa:
- Rendering halaman yang lambat saat ribuan siswa mengakses kuis secara serentak.
- Konsumsi bandwidth egress yang boros saat mengunduh modul PDF dan memutar video materi.
- Kompleksitas skema basis data dengan tabel pivot yang terlalu berbelit.

### Matriks Komparasi: Moodle Konvensional vs LearnFlow Modern

| Dimensi | Moodle Tradisional | LearnFlow Modern |
| :--- | :--- | :--- |
| **Arsitektur** | Server-Side Monolith (PHP/HTML bercampur) | Decoupled API-First (Laravel 13 REST API + React 19 SPA) |
| **User Interface** | Navigasi kaku, full page reload | Single Page Application (SPA), instan, micro-animations |
| **Format Bank Soal** | Skema tabel bertingkat kaku (banyak join) | Kolom `JSONB` PostgreSQL 16+ dengan GIN Index fleksibel |
| **Keamanan ID URL** | Auto-increment ID (`/exam/14/attempt/290`) | ULID non-guessable (`/exams/01HZ.../session/01HZ...`) |
| **Streaming Video** | Disimpan di web server internal | HLS Adaptive Multi-bitrate (Bunny.net Stream / Cloudflare) |
| **Penyimpanan Berkas** | Local disk server (biaya bandwidth tinggi) | Cloudflare R2 (S3-compatible, **Bebas Biaya Egress**) |
| **Realtime Engine** | Long-polling HTTP / Socket eksternal | **Laravel Reverb** Native WebSocket Server terintegrasi |
| **Timer CBT** | Mengandalkan JavaScript lokal browser | **Server-Authoritative Timestamp** + Reverb sync |
| **Dialog Interaktif** | Browser `alert()` dan `confirm()` standar | **SweetAlert2** interaktif terproteksi (Anti-Cheat modal lock) |

---

## 2. Struktur Ekosistem Backend (Laravel 13 REST API)

### 2.1. Paket Composer & Peran Spesifik

| Paket Composer | Kategori | Peran Teknis dalam Sistem |
| :--- | :--- | :--- |
| `laravel/sanctum` | Autentikasi | Autentikasi token Bearer dan Cookie SPA HTTP-Only yang aman dari eksploitasi XSS/CSRF. |
| `spatie/laravel-permission` | Role & Otorisasi | Mengatur hak akses multi-peran: `superadmin`, `instructor`, `teaching_assistant`, `student`, dan `parent`. |
| `spatie/laravel-medialibrary` | File Management | Pengelolaan upload berkas tugas siswa, PDF modul materi, gambar soal, avatar profil, kompresi otomatis, dan integrasi Cloudflare R2. |
| `laravel/reverb` | WebSocket Server | Server real-time native Laravel untuk sinkronisasi timer ujian, status kehadiran langsung, broadcast anti-cheat, dan chatroom. |
| `dedoc/scramble` | Dokumentasi API | Otomatis menghasilkan dokumentasi OpenAPI / Swagger interaktif tanpa perlu anotasi manual. Endpoint: `/docs/api`. |
| `maatwebsite/excel` | Import / Export Data | Ekspor rekapitulasi nilai ujian ke format XLSX/CSV dan impor bank soal massal via file spreadsheet. |
| `spatie/laravel-pdf` | Dokumen / Cetak | Generate sertifikat kelulusan kursus otomatis dan kartu ujian siswa berbasis Chromium headless (Browsershot). |
| `spatie/laravel-activitylog` | Audit Trail | Mencatat log audit perubahan nilai oleh guru, riwayat pengerjaan siswa, log pelanggaran anti-cheat, dan verifikasi waktu submit. |

### 2.2. Pola Penamaan Endpoint API (RESTful v1)

Seluruh respons API mengembalikan struktur standar JSON:
```json
{
  "success": true,
  "message": "Data berhasil dimuat",
  "data": { ... },
  "meta": { ... }
}
```

Daftar endpoint utama:
- `POST /api/v1/auth/login` - Otentikasi dan set sesi HTTP-Only cookie.
- `GET /api/v1/auth/me` - Informasi profil pengguna aktif beserta hak akses.
- `GET /api/v1/courses` - Katalog kursus (dengan filter full-text search PostgreSQL).
- `GET /api/v1/courses/{id}/curriculum` - Struktur modul dan materi TipTap.
- `POST /api/v1/exams/{id}/start-session` - Inisialisasi sesi CBT, pengacakan soal, dan pencatatan timer Redis.
- `PATCH /api/v1/exams/{id}/answers` - Debounced autosave jawaban siswa (800ms).
- `POST /api/v1/exams/{id}/log-violation` - Pencatatan pelanggaran ganti tab / devtools.
- `POST /api/v1/exams/{id}/submit` - Pengumpulan final ujian dan auto-grading.
- `GET /api/v1/certificates/{code}/verify` - Endpoint publik verifikasi keaslian sertifikat via QR Code.

---

## 3. Ekosistem Frontend (React 19 + TypeScript + Vite)

### 3.1. Komponen Pustaka NPM

| Paket NPM | Kategori | Implementasi pada LearnFlow |
| :--- | :--- | :--- |
| `sweetalert2` & `sweetalert2-react-content` | Alert & Modal | Dialog konfirmasi terproteksi, modal anti-cheat terkunci, toast autosave gagal, dialog hapus konten bahaya. |
| `@tanstack/react-query` v5 | Data Fetching & Cache | Pengambilan data materi modul, pagination daftar nilai, debounced background autosave kuis setiap siswa mengetik. |
| `zustand` | Client State Engine | State nomor soal aktif, navigasi palet nomor soal (terjawab, belum, ragu-ragu), collapse sidebar, hitung mundur timer. |
| `react-hook-form` + `zod` | Formulir & Validasi | Validasi form pembuatan ujian, input bobot nilai, dan form pendaftaran kursus dengan type safety. |
| `@tiptap/react` | Rich Text Editor | Pembuatan modul ajar, pengetikan soal guru dengan dukungan gambar, tabel dinamis, dan kode program. |
| `katex` | Rumus Eksakta | Render instan rumus Matematika dan Fisika berstandar LaTeX di modul dan butir soal kuis. |
| `plyr-react` | Pemutar Video | Kontrol pemutaran video pembelajaran (0.75x - 2x), penanda progres tonton minimal kelulusan, dan subtitle VTT. |
| `laravel-echo` + `pusher-js` | WebSocket Client | Klien penghubung ke Laravel Reverb untuk sinkronisasi sisa detik timer ujian dan notifikasi instan. |
| `tailwindcss` + `shadcn/ui` | Design System | Komponen UI modular berstandar aksesibilitas tinggi (Accordion kurikulum, Tabs evaluasi, Badges status, Dialog). |

---

## 4. Penerapan Khusus SweetAlert2 pada Skenario LMS

SweetAlert2 diintegrasikan secara mendalam pada 4 skenario kritis platform:

### Skenario A: Konfirmasi Submit Ujian Terproteksi
Mencegah siswa tidak sengaja menekan tombol kirim sebelum semua soal terjawab.
```typescript
import Swal from 'sweetalert2';

export const confirmExamSubmission = async (unansweredCount: number): Promise<boolean> => {
  if (unansweredCount > 0) {
    const result = await Swal.fire({
      title: 'Peringatan Lembar Jawaban!',
      html: `Masih ada <b>${unansweredCount} butir soal</b> yang belum Anda jawab.<br/>Apakah Anda yakin ingin menyelesaikan ujian sekarang?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Tetap Kumpulkan',
      cancelButtonText: 'Kembali Periksa Soal',
      reverseButtons: true,
      focusCancel: true
    });
    return result.isConfirmed;
  }

  const result = await Swal.fire({
    title: 'Konfirmasi Pengumpulan',
    text: 'Seluruh nomor telah Anda jawab dengan lengkap. Kumpulkan lembar jawaban Anda sekarang?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Kumpulkan Jawaban',
    cancelButtonText: 'Periksa Lagi'
  });
  return result.isConfirmed;
};
```

### Skenario B: Notifikasi Pelanggaran Anti-Cheat (Ganti Tab / Jendela)
Modal terkunci yang muncul saat siswa berpindah aplikasi atau tab browser, mencegah navigasi lanjutan sampai peringatan diakui.
```typescript
export const showAntiCheatWarning = (violationCount: number, maxAllowed: number) => {
  return Swal.fire({
    title: 'Pelanggaran Integritas Terdeteksi!',
    html: `Sistem mencatat Anda telah <b>meninggalkan layar ujian</b>.<br/>Pelanggaran ke-<b>${violationCount}</b> dari maksimal <b>${maxAllowed}</b> kali toleransi.<br/><small class="text-rose-600 font-semibold">Jika melebihi batas, ujian akan otomatis dikumpulkan paksa!</small>`,
    icon: 'error',
    allowOutsideClick: false,
    allowEscapeKey: false,
    confirmButtonColor: '#e11d48',
    confirmButtonText: 'Saya Mengerti dan Kembali ke Ujian'
  });
};
```

### Skenario C: Toast Notifikasi Autosave Jawaban
Indikator visual non-intrusif di sudut layar saat koneksi internet siswa terganggu saat autosave berlangsung.
```typescript
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
    title: `Koneksi terganggu! Jawaban nomor ${questionNumber} belum tersimpan ke server.`
  });
};
```

### Skenario D: Konfirmasi Penghapusan Konten Akademik
Modal bahaya (*danger confirmation*) bagi Guru/Admin untuk mencegah kehilangan modul ajar atau bank soal secara tidak sengaja.
```typescript
export const confirmDangerAction = async (itemTitle: string) => {
  const result = await Swal.fire({
    title: 'Hapus Konten Akademik?',
    html: `Tindakan ini akan menghapus modul <b>"${itemTitle}"</b> beserta seluruh riwayat pengerjaan siswa yang terhubung. Tindakan ini tidak dapat dibatalkan!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Ya, Hapus Permanen',
    cancelButtonText: 'Batalkan'
  });
  return result.isConfirmed;
};
```

---

## 5. Arsitektur WebSocket Real-Time (Laravel Reverb)

### 5.1. Saluran (*Channels*) dan Event

| Nama Saluran | Tipe | Akses Otorisasi | Event yang Ditransmisikan |
| :--- | :--- | :--- | :--- |
| `private-exam-session.{sessionId}` | Private | Siswa pemilik sesi | `ServerTimeSync`, `ExamTimeWarning`, `ExamForceClosed` |
| `presence-exam-room.{examId}` | Presence | Peserta ujian aktif | `Here`, `Joining`, `Leaving` (Live Absensi Siswa) |
| `private-proctor-exam.{examId}` | Private | Pengawas & Guru | `StudentViolationAlert`, `StudentSubmittedAlert` |
| `private-course-chat.{courseId}` | Private | Siswa & Guru terdaftar | `NewChatMessage`, `UserTyping` |
| `private-student.{studentId}` | Private | Siswa spesifik | `CertificateIssued`, `GradePublished` |

### 5.2. Konfigurasi Client (Laravel Echo di React 19)

```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
  authEndpoint: '/api/v1/broadcasting/auth',
  auth: {
    headers: {
      Accept: 'application/json',
    },
  },
});
```

---

## 6. Desain Penyimpanan Media & Streaming Video

Untuk mencegah server aplikasi kehabisan ruang disk lokal dan kuota bandwidth saat pemutaran video pembelajaran secara masif:

```mermaid
graph LR
    subgraph Storage["Cloudflare R2 (S3-Compatible)"]
        PDF["Modul Ajar PDF"]
        SUBMISSIONS["Unggahan Tugas Siswa (PDF/ZIP)"]
        CERTS["File Sertifikat Kelulusan"]
        ASSETS["Gambar Soal & Formula"]
    end
    
    subgraph Streaming["Bunny.net Stream / Cloudflare Stream"]
        VIDEO["Video Pembelajaran Asli (MP4/MOV)"]
        HLS["Transcoding HLS Multi-Bitrate:
        360p | 480p | 720p | 1080p"]
        TOKEN["Signed DRM Token URL
        (Mencegah Pembajakan)"]
    end

    CLIENT["React 19 SPA (Plyr Video Player)"]

    CLIENT -->|Bebas Biaya Egress (Direct Download)| Storage
    VIDEO --> HLS --> TOKEN -->|Adaptive Streaming Playback| CLIENT
```

---

## 7. Skema Kunci Redis 7+ Cache & Buffer

| Pola Key Redis | Tipe Data | TTL (Time-To-Live) | Deskripsi Kegunaan |
| :--- | :--- | :--- | :--- |
| `exam_session:{sessionId}:meta` | Hash | Durasi ujian + 2 jam | Menyimpan `server_expires_at`, status pengerjaan, dan metadata anti-cheat. |
| `exam_session:{sessionId}:answers:{questionId}` | String (JSON) | 4 Jam | Buffer autosave cepat sebelum ditulis ke PostgreSQL. |
| `exam:{examId}:active_students` | Set | 24 Jam | Daftar ID siswa yang sedang mengerjakan ujian secara simultan. |
| `course:{courseId}:curriculum` | String (JSON) | 1 Hari | Cache struktur modul & pelajaran (di-invalidate saat guru mengedit). |
| `rate_limit:cbt_answers:{studentId}` | String | 1 Menit | Throttling untuk mencegah serangan bot DDoS pada endpoint autosave. |

---

## 8. Panduan Verifikasi & Langkah Implementasi Pengembangan

### 8.1. Perintah Penyiapan Backend (Laravel 13 REST API)
```bash
# Inisialisasi dependensi inti
composer require laravel/sanctum spatie/laravel-permission spatie/laravel-medialibrary
composer require laravel/reverb dedoc/scramble maatwebsite/excel spatie/laravel-activitylog
composer require spatie/laravel-pdf

# Instalasi dan migrasi Reverb WebSocket
php artisan reverb:install

# Publikasi vendor migration & file config
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider"
php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider"

# Eksekusi migrasi database PostgreSQL
php artisan migrate
```

### 8.2. Perintah Penyiapan Frontend (React 19 + TypeScript + Vite)
```bash
# Inisialisasi frontend SPA
npm create vite@latest frontend -- --template react-ts
cd frontend

# Pustaka data fetching, state, dan network
npm install @tanstack/react-query zustand axios

# Dialog interaktif dan notifikasi
npm install sweetalert2 sweetalert2-react-content

# Formulir dan validasi tipe data
npm install react-hook-form zod @hookform/resolvers

# Editor teks kaya, formula LaTeX matematika, video player, dan ikon
npm install @tiptap/react @tiptap/starter-kit katex plyr-react lucide-react

# Realtime WebSocket client
npm install laravel-echo pusher-js

# Styling TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 9. Kesimpulan & Roadmap Keunggulan

Rancangan arsitektur sistem ini menjamin LearnFlow memiliki kapabilitas yang jauh melampaui LMS konvensional:
1. **Performa Tinggi & Skalabilitas**: Mampu melayani ujian serentak ribuan siswa tanpa lag berkat kombinasi Redis session buffering, PostgreSQL 16+ GIN Index, dan React Query debounce.
2. **Keamanan Maksimal**: Integritas terjamin melalui ID non-tebak (ULID), otentikasi Sanctum anti-XSS, server-authoritative timer, dan modal anti-cheat SweetAlert2 terkunci.
3. **Efisiensi Anggaran Infrastruktur**: Pemanfaatan Cloudflare R2 tanpa biaya egress bandwidth menghemat biaya operasional hingga 80% dibanding arsitektur penyimpanan tradisional.
4. **Siap Diintegrasikan dengan Mobile App**: Desain REST API murni siap dikonsumsi langsung oleh aplikasi Android / iOS berbasis Flutter maupun React Native di masa mendatang.
