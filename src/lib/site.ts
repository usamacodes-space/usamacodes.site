/**
 * Canonical production URL — must match your Vercel **primary** custom domain & Google Search Console.
 *
 * Set `NEXT_PUBLIC_SITE_URL` in Vercel (and `.env.local`) to e.g. `https://usamacodes.site` or
 * `https://usamacodes.space` so metadata, sitemap, and JSON-LD stay aligned after you change DNS.
 */
function normalizeSiteUrl(url: string): string {
  const t = url.trim().replace(/\/$/, '');
  return t.startsWith('http') ? t : `https://${t}`;
}

const resolvedSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://usamacodes.space'
);

export const SITE_URL = resolvedSiteUrl;

export const SITE_HOST = new URL(resolvedSiteUrl).hostname;

/** Public inbox (schema + copy). Override if you use a different mailbox. */
export const SITE_EMAIL =
  (typeof process.env.NEXT_PUBLIC_CONTACT_EMAIL === 'string' && process.env.NEXT_PUBLIC_CONTACT_EMAIL.trim()) ||
  `hello@${SITE_HOST}`;
