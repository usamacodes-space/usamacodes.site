import { createHash, createHmac } from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'fun_admin_session';

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, 'base64').toString('utf8');
}

function sha256Hex(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

function hmacHex(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('hex');
}

function adminPassword(): string | null {
  const p = process.env.FUN_ADMIN_PASSWORD;
  return typeof p === 'string' && p.trim() ? p : null;
}

function adminSecret(): string | null {
  const s = process.env.FUN_ADMIN_SECRET;
  const fallback = adminPassword();
  const secret = typeof s === 'string' && s.trim() ? s : fallback;
  return secret ?? null;
}

export function createAdminSessionCookie(password: string): string {
  const secret = adminSecret();
  if (!secret) throw new Error('FUN_ADMIN_PASSWORD/FUN_ADMIN_SECRET not configured');

  const payload = {
    v: 1,
    pwHash: sha256Hex(password),
    iat: Date.now(),
  };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const sig = hmacHex(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export function verifyAdminSessionCookie(cookieValue: string): boolean {
  const p = adminPassword();
  const secret = adminSecret();
  if (!p || !secret) return false;

  const [payloadB64, sig] = cookieValue.split('.', 2);
  if (!payloadB64 || !sig) return false;

  // Signature check
  if (hmacHex(payloadB64, secret) !== sig) return false;

  // Payload check
  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64)) as { pwHash?: string; iat?: number };
    if (!payload.pwHash || payload.pwHash !== sha256Hex(p)) return false;
    const maxAgeMs = 1000 * 60 * 60 * 24 * 7; // 7 days
    if (typeof payload.iat !== 'number' || Date.now() - payload.iat > maxAgeMs) return false;
    return true;
  } catch {
    return false;
  }
}

export async function isAdminAuthedFromRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!cookieValue) return false;
  return verifyAdminSessionCookie(cookieValue);
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME;
}

