<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LearnFlow - Platform E-Learning & CBT Modern</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-[#f8fbff] text-slate-800 font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-hidden">
    <!-- Ambient glowing orbs -->
    <div class="fixed -top-24 -left-24 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
    <div class="fixed top-1/4 -right-24 w-96 h-96 bg-orange-100/60 rounded-full blur-3xl pointer-events-none -z-10"></div>
    <div class="fixed bottom-0 left-1/3 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>

    <!-- Top Header -->
    <header class="border-b border-sky-100/90 bg-white/85 backdrop-blur-md px-6 py-3.5 shadow-xs">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-500/25 ring-2 ring-sky-200">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-extrabold text-lg text-slate-900 tracking-tight">LearnFlow</span>
                        <span class="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-mono font-semibold">Backend Ready</span>
                    </div>
                    <p class="text-xs text-slate-500">E-Learning & Computer Based Testing Modern</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <a href="{{ url('/docs/api') }}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200 shadow-2xs transition">
                    <span>Swagger Scramble API</span>
                    <svg class="h-3.5 w-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center text-center space-y-8">
        <div class="space-y-4 max-w-3xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
                <span class="h-2 w-2 rounded-full bg-sky-500 animate-ping"></span>
                <span>LearnFlow Portal Gateway</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Platform Pembelajaran & Ujian Terintegrasi
            </h1>
            <p class="text-slate-600 text-base leading-relaxed">
                Backend API Laravel 12 dengan otentikasi Sanctum, RBAC Spatie multi-peran, PostgreSQL 18+, Redis, dan WebSocket Reverb telah aktif.
            </p>
        </div>

        <!-- Quick Access Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
            <a href="{{ url('/docs/api') }}" class="group p-6 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 hover:shadow-md transition shadow-sm flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                    <div class="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center font-bold text-sm shadow-2xs">
                        API
                    </div>
                    <h3 class="font-bold text-slate-900 group-hover:text-sky-600 transition">Dokumentasi Scramble</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Akses spesifikasi OpenAPI interaktif untuk seluruh endpoint Auth, Profil, Wali Murid, dan Audit Trail.
                    </p>
                </div>
                <span class="text-xs text-sky-600 font-semibold inline-flex items-center gap-1">
                    Buka /docs/api &rarr;
                </span>
            </a>

            <a href="{{ url('/api/v1/health') }}" target="_blank" class="group p-6 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition shadow-sm flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                    <div class="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold text-sm shadow-2xs">
                        OK
                    </div>
                    <h3 class="font-bold text-slate-900 group-hover:text-emerald-600 transition">Health Status</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Cek koneksi real-time ke PostgreSQL 18+, Redis caching, dan Laravel Reverb WebSocket.
                    </p>
                </div>
                <span class="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
                    Buka /api/v1/health &rarr;
                </span>
            </a>

            <div class="p-6 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 hover:shadow-md transition shadow-sm flex flex-col justify-between space-y-4">
                <div class="space-y-2">
                    <div class="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-sm shadow-2xs">
                        SPA
                    </div>
                    <h3 class="font-bold text-slate-900">Frontend React 19</h3>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        Jalankan <code class="text-orange-700 font-mono bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[11px]">npm run build</code> di folder <code class="text-sky-700 font-mono bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded text-[11px]">frontend/</code> untuk memuat Single Page Application.
                    </p>
                </div>
                <span class="text-xs text-slate-400 font-mono">
                    Port Dev: 5173
                </span>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-sky-100 bg-white/80 py-5 px-6 text-center text-xs text-slate-500">
        LearnFlow CBT & LMS Platform • Laravel 12 & React 19 Architecture
    </footer>
</body>
</html>
