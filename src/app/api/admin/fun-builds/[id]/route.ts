import { NextRequest, NextResponse } from 'next/server';
import { getFunBuilds, setFunBuilds } from '@/lib/funBuildsStore';
import { isAdminAuthedFromRequest } from '@/lib/adminAuth';
import type { FunBuild } from '@/types';

function isValidAbsoluteHttpUrl(u: unknown): u is string {
  return typeof u === 'string' && /^https?:\/\//.test(u.trim());
}

export async function PUT(req: NextRequest, context: any) {
  if (!(await isAdminAuthedFromRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = context?.params?.id as string | undefined;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

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
  if (body.githubUrl != null && body.githubUrl !== '' && !isValidAbsoluteHttpUrl(body.githubUrl)) {
    return NextResponse.json({ error: 'githubUrl must be an absolute https/http link when set' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const builds = await getFunBuilds();
  const existing = builds.find((b) => b.id === id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated: FunBuild = {
    ...existing,
    title: body.title.trim(),
    description: body.description.trim(),
    url: body.url.trim(),
    githubUrl:
      typeof body.githubUrl === 'string' && body.githubUrl.trim() ? body.githubUrl.trim() : undefined,
    emoji: typeof body.emoji === 'string' ? body.emoji : undefined,
    status: body.status,
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : undefined,
    demoUsername: typeof body.demoUsername === 'string' ? body.demoUsername : undefined,
    demoPassword: typeof body.demoPassword === 'string' ? body.demoPassword : undefined,
    demoNotes: typeof body.demoNotes === 'string' ? body.demoNotes : undefined,
    updatedAt: now,
  };

  await setFunBuilds(builds.map((b) => (b.id === id ? updated : b)));
  return NextResponse.json({ ok: true, build: updated });
}

export async function DELETE(req: NextRequest, context: any) {
  if (!(await isAdminAuthedFromRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = context?.params?.id as string | undefined;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const builds = await getFunBuilds();
  const next = builds.filter((b) => b.id !== id);
  await setFunBuilds(next);
  return NextResponse.json({ ok: true, deletedId: id });
}

