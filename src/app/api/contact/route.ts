import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientIp } from '@/lib/getClientIp';
import { SITE_EMAIL, SITE_HOST } from '@/lib/site';

const RATE_LIMIT_MS = 5000;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim() || SITE_EMAIL;
/** Must use an address on a domain verified in Resend (defaults to @{SITE_HOST}). */
const RESEND_FROM =
  process.env.RESEND_FROM?.trim() || `Portfolio Contact <noreply@${SITE_HOST}>`;

const ipLastRequest = new Map<string, number>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const last = ipLastRequest.get(ip);
  if (last != null && now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'Please wait a moment before sending another message.' }, { status: 429 });
  }
  ipLastRequest.set(ip, now);

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: 'Name is required (at least 2 characters).' }, { status: 400 });
  }
  if (!email || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  if (!message || message.trim().length < 10) {
    return NextResponse.json({ error: 'Message is required (at least 10 characters).' }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const safeName = name.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeEmail = email.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeMessage = message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const submittedAt = new Date().toISOString();

  try {
    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `[Portfolio] Message from ${name.trim()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="margin: 0; color: #fff; font-size: 20px;">New visitor message</h2>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 13px;">${SITE_HOST} contact form</p>
          </div>
          <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="margin: 0 0 16px; color: #374151; font-size: 14px;"><strong>Visitor details</strong></p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px; vertical-align: top;"><strong>Name</strong></td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Email</strong></td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #f97316;">${safeEmail}</a> <span style="color:#9ca3af;font-size:12px;">(Reply goes here)</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Submitted</strong></td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 13px;">${submittedAt}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;"><strong>Message</strong></p>
            <div style="color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Sent from the contact form at ${SITE_HOST} · Delivered to ${TO_EMAIL}</p>
          </div>
        </div>
      `,
      text: `New visitor message (${SITE_HOST})\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nSubmitted: ${submittedAt}\n\n---\n\n${message.trim()}\n`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send message.' },
      { status: 500 }
    );
  }
}
