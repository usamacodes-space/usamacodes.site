'use client';

/** Lightweight placeholder while a tab panel chunk loads (mobile TBT / perceived perf). */
export function TabPanelSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-3 py-2 animate-pulse" aria-hidden>
      <div className="h-6 w-40 rounded-md bg-[var(--bento-skeleton)]" />
      <div className="h-3 w-64 rounded bg-[var(--chip-muted-bg)]" />
      <div className="grid gap-3 mt-4">
        <div className="h-28 rounded-2xl bg-[var(--chip-muted-bg)]" />
        <div className="h-28 rounded-2xl bg-[var(--chip-muted-bg)]" />
      </div>
    </div>
  );
}
