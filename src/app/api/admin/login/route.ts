import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionCookie, getAdminCookieName } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const expected = process.env.FUN_ADMIN_PASSWORD;
  if (typeof expected !== 'string' || !expected.trim()) {
    return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });
  if (password !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cookieName = getAdminCookieName();
  const cookieValue = createAdminSessionCookie(password);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

