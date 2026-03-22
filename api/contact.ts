import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const RATE_LIMIT_MS = 5000;
const TO_EMAIL =
  process.env.CONTACT_TO_EMAIL?.trim() || "ilove300ak47@gmail.com";

const ipLastRequest = new Map<string, number>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    if (first) return first.trim();
  }
  const real = req.headers["x-real-ip"];
  if (real && typeof real === "string") return real;
  return (req.socket?.remoteAddress as string) || "unknown";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Email service not configured" });
    return;
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const last = ipLastRequest.get(ip);
  if (last != null && now - last < RATE_LIMIT_MS) {
    res.status(429).json({ error: "Please wait a moment before sending another message." });
    return;
  }
  ipLastRequest.set(ip, now);

  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || name.trim().length < 2) {
    res.status(400).json({ error: "Name is required (at least 2 characters)." });
    return;
  }
  if (!email || !isValidEmail(email.trim())) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }
  if (!message || message.trim().length < 10) {
    res.status(400).json({ error: "Message is required (at least 10 characters)." });
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <noreply@usamacodes.space>",
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `Portfolio Contact from ${name.trim()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="margin: 0; color: #fff; font-size: 20px;">New Portfolio Message</h2>
          </div>
          <div style="background: #fff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 80px; vertical-align: top;"><strong>Name</strong></td>
                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;"><strong>Email</strong></td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email.trim()}" style="color: #f97316;">${email.trim()}</a></td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <div style="color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Sent from your portfolio at usamacodes.space</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to send message.",
    });
  }
}
