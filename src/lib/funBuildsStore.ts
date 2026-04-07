import { kv } from '@vercel/kv';
import { FUN_BUILDS } from '@/data/portfolio';
import type { FunBuild } from '@/types';

const KV_KEY = 'portfolio:fun-builds:v1';

function kvConfigured(): boolean {
  // Vercel KV uses these env vars by convention.
  // If they are missing, we gracefully fall back to the repo seed data.
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getFunBuilds(): Promise<FunBuild[]> {
  if (!kvConfigured()) return FUN_BUILDS;
  try {
    const value = await kv.get<unknown>(KV_KEY);
    if (value == null) return FUN_BUILDS;
    if (Array.isArray(value)) return value as FunBuild[];
    if (typeof value === 'string') {
      // Backward/defensive fallback in case something stored a JSON string.
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed as FunBuild[];
    }
    return FUN_BUILDS;
  } catch {
    return FUN_BUILDS;
  }
}

export async function setFunBuilds(builds: FunBuild[]): Promise<void> {
  if (!kvConfigured()) return;
  try {
    await kv.set(KV_KEY, builds);
  } catch {
    // Admin changes will not persist if KV is misconfigured; keep app functional.
  }
}

