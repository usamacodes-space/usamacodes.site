'use client';

import { Sparkles } from 'lucide-react';

/** Minimal above-the-fold content while SearchTerminal chunk loads (better mobile LCP than blank). */
export function StartTabPlaceholder() {
  return (
    <div className="w-full flex flex-col flex-1 items-center justify-start pt-[10vh] sm:pt-[12vh] pb-2 px-4" aria-busy>
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden border animate-pulse"
        style={{
          borderColor: 'var(--panel-border)',
          backgroundColor: 'var(--panel-surface)',
          boxShadow: 'var(--panel-shell-shadow)',
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 border-b"
          style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-header-bg)' }}
        >
          <span className="flex gap-1" aria-hidden>
            <span className="w-2 h-2 rounded-full bg-[#f97316]/70" />
            <span className="w-2 h-2 rounded-full bg-[#5d707f]/40" />
            <span className="w-2 h-2 rounded-full bg-[#5d707f]/30" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider flex-1" style={{ color: 'var(--brand-slate-light)' }}>
            Portfolio Assistant
          </span>
          <Sparkles className="w-3 h-3 text-[#f97316]/80" aria-hidden />
        </div>
        <div className="p-4 sm:p-5">
          <h1 className="text-center text-lg sm:text-xl font-semibold mb-2 flex items-center justify-center gap-2" style={{ color: 'var(--brand-light)' }}>
            Ask me anything
            <Sparkles className="w-5 h-5 text-[#f97316]" aria-hidden />
          </h1>
          <p className="text-center text-[11px] sm:text-xs mb-5 max-w-md mx-auto" style={{ color: 'var(--brand-slate-light)' }}>
            Instant answers about my work, projects, and experience.
          </p>
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[88px] sm:h-[100px] rounded-2xl border border-transparent" style={{ backgroundColor: 'var(--bento-skeleton)' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
