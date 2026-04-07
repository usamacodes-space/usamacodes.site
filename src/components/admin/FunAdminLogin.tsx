'use client';

import React, { useState } from 'react';

export default function FunAdminLogin() {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Unauthorized');
        return;
      }
      window.location.href = '/admin';
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-2xl p-5 sm:p-6 shadow-2xl"
        style={{
          border: '1px solid rgba(93,112,127,0.22)',
          backgroundColor: 'rgba(244,246,249,0.55)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}
            aria-hidden
          >
            <span className="text-xl">🧰</span>
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold" style={{ color: 'var(--brand-light)' }}>
              Admin Login
            </div>
            <div className="text-xs" style={{ color: 'var(--brand-slate-light)' }}>
              Manage “Projects for fun”
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
              style={{
                border: '1px solid rgba(93,112,127,0.22)',
                backgroundColor: 'rgba(255,255,255,0.75)',
                color: 'var(--brand-light)',
              }}
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div
              className="rounded-xl px-3 py-2 text-xs"
              style={{ border: '1px solid rgba(239,68,68,0.35)', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl px-3 py-2.5 font-semibold transition-colors"
            style={{ backgroundColor: '#f97316', color: '#fff', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-[11px] mt-4 opacity-80" style={{ color: 'var(--brand-slate-light)' }}>
          Set <code className="px-1 py-0.5 rounded bg-black/10">FUN_ADMIN_PASSWORD</code> on Vercel/production.
        </p>
      </div>
    </div>
  );
}

