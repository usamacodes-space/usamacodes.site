import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getFunBuilds, setFunBuilds } from '@/lib/funBuildsStore';
import { isAdminAuthedFromRequest } from '@/lib/adminAuth';
import type { FunBuild } from '@/types';

function isValidAbsoluteHttpUrl(u: unknown): u is string {
  return typeof u === 'string' && /^https?:\/\//.test(u.trim());
}

export async function GET() {
  if (!(await isAdminAuthedFromRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const builds = await getFunBuilds();
  return NextResponse.json({ builds });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthedFromRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Partial<FunBuild>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.title || typeof body.title !== 'string') return NextResponse.json({ error: 'title is required' }, { status: 400 });
  if (!body.description || typeof body.description !== 'string')
    return NextResponse.json({ error: 'description is required' }, { status: 400 });
  if (!isValidAbsoluteHttpUrl(body.url)) return NextResponse.json({ error: 'url must be an absolute https/http link' }, { status: 400 });

  const now = new Date().toISOString();
  const id = body.id && typeof body.id === 'string' ? body.id : randomUUID();

  const next: FunBuild = {
    id,
    title: body.title.trim(),
    description: body.description.trim(),
    url: body.url.trim(),
    emoji: typeof body.emoji === 'string' ? body.emoji : undefined,
    status: body.status,
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : undefined,
    demoUsername: typeof body.demoUsername === 'string' ? body.demoUsername : undefined,
    demoPassword: typeof body.demoPassword === 'string' ? body.demoPassword : undefined,
    demoNotes: typeof body.demoNotes === 'string' ? body.demoNotes : undefined,
    createdAt: now,
    updatedAt: now,
  };

  const builds = await getFunBuilds();
  const filtered = builds.filter((b) => b.id !== id);
  filtered.unshift(next);
  await setFunBuilds(filtered);

  return NextResponse.json({ ok: true, build: next });
}

