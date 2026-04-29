'use client';

import { ExternalLink, Github } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FUN_BUILDS } from '@/constants';
import { useTheme } from '@/contexts/ThemeContext';

const statusLabel: Record<NonNullable<(typeof FUN_BUILDS)[0]['status']>, string> = {
  live: 'Live',
  wip: 'WIP',
  idea: 'Idea',
};

export default function FunBuildsPanel() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [builds, setBuilds] = useState(FUN_BUILDS);
  const [isLoading, setIsLoading] = useState(true);
  const liveCount = builds.filter((build) => build.status === 'live').length;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch('/api/fun-builds', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json().catch(() => ({}));
        if (Array.isArray(data.builds) && !cancelled) setBuilds(data.builds);
      } catch {
        // Keep seed data as a safe fallback.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <div
        className="mb-5 rounded-3xl p-4 sm:p-5"
        style={{
          border: `1px solid ${isDark ? 'rgba(93,112,127,0.26)' : 'rgba(93,112,127,0.16)'}`,
          background: isDark
            ? 'linear-gradient(135deg, rgba(22,27,34,0.7), rgba(22,27,34,0.42))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(248,250,252,0.72))',
        }}
      >
        <p className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: 'var(--brand-slate-light)' }}>
          Indie builds
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold leading-tight mb-1" style={{ color: 'var(--brand-light)' }}>
          Projects for fun
        </h2>
        <p className="text-xs sm:text-sm max-w-2xl leading-relaxed mb-3" style={{ color: 'var(--brand-slate-light)' }}>
          Small tools and experiments I ship publicly. Open any project to try it live.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
          <span
            className="px-2.5 py-1 rounded-full font-semibold"
            style={{
              color: '#22c55e',
              backgroundColor: isDark ? 'rgba(34,197,94,0.14)' : 'rgba(34,197,94,0.12)',
              border: `1px solid ${isDark ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.24)'}`,
            }}
          >
            {liveCount} live
          </span>
          <span
            className="px-2.5 py-1 rounded-full font-semibold"
            style={{
              color: 'var(--brand-light)',
              backgroundColor: isDark ? 'rgba(148,163,184,0.14)' : 'rgba(15,23,42,0.06)',
              border: `1px solid ${isDark ? 'rgba(148,163,184,0.26)' : 'rgba(93,112,127,0.18)'}`,
            }}
          >
            {builds.length} total
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 sm:gap-3 list-none p-0 m-0">
        {isLoading ? (
          <li className="bento-animate rounded-2xl p-4" style={{ border: `1px solid ${isDark ? 'rgba(93,112,127,0.22)' : 'rgba(93,112,127,0.14)'}` }}>
            <div className="text-sm font-medium" style={{ color: 'var(--brand-slate-light)' }}>Loading…</div>
          </li>
        ) : null}

        {builds.map((build, i) => (
          <li key={build.id ?? `${build.url}-${build.title}-${i}`} className="bento-animate">
            <div
              className="flex items-stretch gap-1 sm:gap-2 rounded-2xl transition-all duration-200 hover:-translate-y-[1px]"
              style={{
                border: `1px solid ${isDark ? 'rgba(93,112,127,0.26)' : 'rgba(93,112,127,0.16)'}`,
                backgroundColor: isDark ? 'rgba(22,27,34,0.56)' : 'rgba(255,255,255,0.82)',
                boxShadow: isDark ? 'none' : '0 8px 20px rgba(15, 23, 42, 0.06)',
              }}
            >
              <a
                href={build.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 min-w-0 items-stretch gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/55 focus-visible:ring-inset"
                aria-label={`${build.title} — opens primary link in a new tab`}
              >
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl select-none" aria-hidden>
                  {build.imageUrl ? (
                    <img
                      src={build.imageUrl}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="w-full h-full rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: isDark ? 'rgba(249,115,22,0.12)' : 'rgba(249,115,22,0.1)',
                        border: `1px solid ${isDark ? 'rgba(249,115,22,0.2)' : 'rgba(249,115,22,0.15)'}`,
                      }}
                    >
                      {build.emoji ?? '🧪'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-[15px] font-semibold tracking-tight group-hover:text-[#f97316] transition-colors" style={{ color: 'var(--brand-light)' }}>
                      {build.title}
                    </span>
                    {build.status ? (
                      <span
                        className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          color: build.status === 'live' ? '#22c55e' : build.status === 'wip' ? '#f97316' : 'var(--brand-slate-light)',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                        }}
                      >
                        {statusLabel[build.status]}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs sm:text-sm leading-snug line-clamp-2 sm:line-clamp-none mt-0.5" style={{ color: 'var(--brand-slate-light)' }}>
                    {build.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center self-center pr-1">
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors group-hover:bg-[#f97316]/15"
                    style={{ color: 'var(--brand-slate-light)' }}
                    aria-hidden
                  >
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:text-[#f97316]" />
                  </span>
                </div>
              </a>
              {build.githubUrl ? (
                <a
                  href={build.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center justify-center w-11 sm:w-12 rounded-r-2xl border-l transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/55 focus-visible:ring-inset hover:bg-[#f97316]/10"
                  style={{
                    borderColor: isDark ? 'rgba(93,112,127,0.22)' : 'rgba(93,112,127,0.14)',
                    color: 'var(--brand-slate-light)',
                  }}
                  aria-label={`${build.title} — GitHub repository`}
                  title="GitHub"
                >
                  <Github className="w-5 h-5 opacity-80 hover:opacity-100 hover:text-[#f97316]" />
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
