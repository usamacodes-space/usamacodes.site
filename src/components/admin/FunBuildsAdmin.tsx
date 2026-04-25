'use client';

import React, { useEffect, useState } from 'react';
import type { FunBuild } from '@/types';

type FunBuildStatus = NonNullable<FunBuild['status']>;
const STATUS_OPTIONS: FunBuildStatus[] = ['live', 'wip', 'idea'];
const statusLabel: Record<FunBuildStatus, string> = {
  live: 'Live',
  wip: 'WIP',
  idea: 'Idea',
};

type FunBuildDraft = Omit<FunBuild, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

function isValidAbsoluteHttpUrl(u: string): boolean {
  return /^https?:\/\//.test(u.trim());
}

const seed: FunBuildDraft = {
  title: '',
  description: '',
  url: '',
  githubUrl: '',
  emoji: '✨',
  status: 'live',
  imageUrl: '',
  demoUsername: '',
  demoPassword: '',
  demoNotes: '',
};

export default function FunBuildsAdmin() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [builds, setBuilds] = useState<FunBuild[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FunBuildDraft>(seed);
  const [saving, setSaving] = useState(false);

  const loadBuilds = async () => {
    setLoadError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/fun-builds', { cache: 'no-store' });
      if (!res.ok) {
        setBuilds([]);
        setLoadError(res.status === 401 ? 'Unauthorized. Please login again.' : 'Failed to load.');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data.builds)) setBuilds(data.builds);
    } catch {
      setLoadError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBuilds();
  }, []);

  const onEdit = (b: FunBuild) => {
    setEditingId(b.id ?? null);
    setDraft({
      title: b.title,
      description: b.description,
      url: b.url,
      githubUrl: b.githubUrl ?? '',
      emoji: b.emoji ?? '🧪',
      status: b.status ?? 'idea',
      imageUrl: b.imageUrl ?? '',
      demoUsername: b.demoUsername ?? '',
      demoPassword: b.demoPassword ?? '',
      demoNotes: b.demoNotes ?? '',
      id: b.id,
    });
  };

  const onNew = () => {
    setEditingId(null);
    setDraft(seed);
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm('Delete this entry?');
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/fun-builds/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed');
      await loadBuilds();
      onNew();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const title = draft.title.trim();
    const description = draft.description.trim();
    const url = draft.url.trim();
    const githubUrl = draft.githubUrl?.trim() ?? '';

    if (!title) return setLoadError('Title is required.');
    if (!description) return setLoadError('Description is required.');
    if (!isValidAbsoluteHttpUrl(url)) return setLoadError('URL must start with http:// or https://');
    if (githubUrl && !isValidAbsoluteHttpUrl(githubUrl))
      return setLoadError('GitHub URL must start with http:// or https:// when set.');

    setLoadError(null);
    setSaving(true);

    const payload: Partial<FunBuild> = {
      id: draft.id,
      title,
      description,
      url,
      githubUrl: githubUrl || undefined,
      emoji: typeof draft.emoji === 'string' ? draft.emoji : undefined,
      status: draft.status,
      imageUrl: draft.imageUrl ? draft.imageUrl.trim() : undefined,
      demoUsername: draft.demoUsername ? draft.demoUsername : undefined,
      demoPassword: draft.demoPassword ? draft.demoPassword : undefined,
      demoNotes: draft.demoNotes ? draft.demoNotes : undefined,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/fun-builds/${encodeURIComponent(editingId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed');
      } else {
        const res = await fetch('/api/admin/fun-builds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed');
      }

      await loadBuilds();
      onNew();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh px-4 sm:px-6 py-5">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{
            backgroundColor: 'rgba(244,246,249,0.55)',
            border: '1px solid rgba(93,112,127,0.18)',
            backdropFilter: 'blur(18px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--brand-light)' }}>
                Projects for fun — Admin
              </div>
              <div className="text-xs sm:text-sm mt-1" style={{ color: 'var(--brand-slate-light)' }}>
                Create/edit demo entries and their thumbnail image URLs.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                style={{ backgroundColor: 'rgba(93,112,127,0.12)', color: 'var(--brand-light)' }}
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={onNew}
                className="rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                style={{ backgroundColor: '#f97316', color: '#fff', opacity: saving ? 0.7 : 1 }}
                disabled={saving}
              >
                New entry
              </button>
            </div>
          </div>

          {loadError ? (
            <div className="mt-4 rounded-xl px-3 py-2 text-xs" style={{ border: '1px solid rgba(239,68,68,0.35)', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
              {loadError}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 auto-rows-min">
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-4 sm:p-5"
              style={{ border: '1px solid rgba(93,112,127,0.18)', backgroundColor: 'rgba(255,255,255,0.6)' }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-sm font-semibold" style={{ color: 'var(--brand-light)' }}>
                  Entries
                </div>
                <div className="text-[11px] font-mono opacity-80" style={{ color: 'var(--brand-slate-light)' }}>
                  {builds.length} total
                </div>
              </div>

              {loading ? (
                <div className="text-xs" style={{ color: 'var(--brand-slate-light)' }}>Loading…</div>
              ) : builds.length === 0 ? (
                <div className="text-xs" style={{ color: 'var(--brand-slate-light)' }}>No entries yet.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {builds.map((b) => (
                    <div
                      key={b.id ?? `${b.url}-${b.title}`}
                      className="rounded-2xl p-3"
                      style={{ border: '1px solid rgba(93,112,127,0.18)', backgroundColor: 'rgba(255,255,255,0.7)' }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.22)' }}
                        >
                          {b.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={b.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <span className="text-xl">{b.emoji ?? '🧪'}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-semibold" style={{ color: 'var(--brand-light)' }}>
                              {b.title}
                            </div>
                            {b.status ? (
                              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  color: b.status === 'live' ? '#22c55e' : b.status === 'wip' ? '#f97316' : 'var(--brand-slate-light)',
                                  backgroundColor: 'rgba(15,23,42,0.06)',
                                }}
                              >
                                {statusLabel[b.status]}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs mt-1 opacity-80 truncate" style={{ color: 'var(--brand-slate-light)' }}>
                            {b.url}
                          </div>
                          {b.githubUrl ? (
                            <div className="text-[11px] mt-0.5 opacity-80 truncate font-mono" style={{ color: 'var(--brand-slate-light)' }}>
                              gh: {b.githubUrl}
                            </div>
                          ) : null}
                          <div className="text-[11px] mt-2" style={{ color: 'var(--brand-slate-light)' }}>
                            <span className="font-mono opacity-90">id:</span> {b.id ?? '—'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => onEdit(b)}
                          className="rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                          style={{ backgroundColor: 'rgba(93,112,127,0.12)', color: 'var(--brand-light)' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(b.id ?? '')}
                          className="rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                          style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
                          disabled={!b.id}
                          title={!b.id ? 'Missing id' : 'Delete'}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div
              className="rounded-2xl p-4 sm:p-5"
              style={{ border: '1px solid rgba(93,112,127,0.18)', backgroundColor: 'rgba(255,255,255,0.6)' }}
            >
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--brand-light)' }}>
                {editingId ? 'Edit entry' : 'Create new entry'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <div
                    className="rounded-2xl p-3"
                    style={{ border: '1px solid rgba(93,112,127,0.18)', backgroundColor: 'rgba(255,255,255,0.75)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.22)' }}
                      >
                        {draft.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={draft.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span className="text-xl">{draft.emoji ?? '🧪'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-sm font-semibold" style={{ color: 'var(--brand-light)' }}>
                            {draft.title || '—'}
                          </div>
                          {draft.status ? (
                            <span
                              className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                color: draft.status === 'live' ? '#22c55e' : draft.status === 'wip' ? '#f97316' : 'var(--brand-slate-light)',
                                backgroundColor: 'rgba(15,23,42,0.06)',
                              }}
                            >
                              {statusLabel[draft.status]}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs mt-1 opacity-80 truncate" style={{ color: 'var(--brand-slate-light)' }}>
                          {draft.url || '—'}
                        </div>
                        <div className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--brand-slate-light)' }}>
                          {draft.description || 'Add a short description for the public list.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-3 col-span-5">
                  <div className="text-[11px] opacity-80 font-mono mb-2" style={{ color: 'var(--brand-slate-light)' }}>
                    Admin-only fields: demoUsername/demoPassword/demoNotes
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[11px]" style={{ color: 'var(--brand-slate-light)' }}>
                      Public thumbnail: <span className="font-mono">{draft.imageUrl ? 'imageUrl set' : 'emoji fallback'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                      Title
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                      value={draft.title}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                      Status
                    </label>
                    <select
                      className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                      value={draft.status ?? 'live'}
                      onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as FunBuildStatus }))}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option value={s} key={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                    Live URL (public link)
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                    style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                    value={draft.url}
                    onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                    placeholder="https://your-app.vercel.app"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                    GitHub URL (optional — shows repo icon on the public list)
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                    style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                    value={draft.githubUrl ?? ''}
                    onChange={(e) => setDraft((d) => ({ ...d, githubUrl: e.target.value }))}
                    placeholder="https://github.com/you/your-repo"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                    Description (public)
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                    style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                      Emoji (fallback)
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                      value={draft.emoji ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, emoji: e.target.value }))}
                      placeholder="✨"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                      Image URL (thumbnail)
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                      value={draft.imageUrl ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
                      placeholder="https://.../screenshot.png"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                      Demo username (admin-only)
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                      value={draft.demoUsername ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, demoUsername: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                      Demo password (admin-only)
                    </label>
                    <input
                      type="password"
                      className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                      value={draft.demoPassword ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, demoPassword: e.target.value }))}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--brand-slate-light)' }}>
                      Demo notes (admin-only)
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl px-3 py-2 outline-none"
                      style={{ border: '1px solid rgba(93,112,127,0.22)', backgroundColor: 'rgba(255,255,255,0.85)', color: 'var(--brand-light)' }}
                      value={draft.demoNotes ?? ''}
                      onChange={(e) => setDraft((d) => ({ ...d, demoNotes: e.target.value }))}
                      placeholder="e.g. try settings tab"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onNew}
                    className="rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                    style={{ backgroundColor: 'rgba(93,112,127,0.12)', color: 'var(--brand-light)' }}
                    disabled={saving}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                    style={{ backgroundColor: '#f97316', color: '#fff', opacity: saving ? 0.7 : 1 }}
                  >
                    {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

