import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sky-100 bg-white/80 py-4 px-6 md:px-8 text-slate-500 text-xs transition">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-bold text-slate-700">LearnFlow LMS & CBT Platform</span>
          <span className="text-slate-400"> • Arsitektur Multi-Peran & Ujian Online Berkinerja Tinggi</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Laravel 12</span>
          <span>•</span>
          <span>React 19</span>
          <span>•</span>
          <span>PostgreSQL 18</span>
          <span>•</span>
          <span className="text-sky-600 font-semibold">Sprint 1</span>
        </div>
      </div>
    </footer>
  );
};
