import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null | undefined;

function transport(): Transporter | null {
  if (cached !== undefined) return cached;
  const host = process.env.SMTP_HOST || (process.env.SMTP_USER ? "smtp.gmail.com" : "");
  if (!host) return (cached = null);
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const { SMTP_USER: user, SMTP_PASS: pass } = process.env;
  return (cached = nodemailer.createTransport({ host, port, secure, auth: user && pass ? { user, pass } : undefined }));
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendPasswordResetEmail({ to, name, url }: { to: string; name: string; url: string }) {
  const t = transport();
  if (!t) {
    // No SMTP configured: in development print the link so the flow can still be tried; never print it in production.
    if (process.env.NODE_ENV === "production") console.error("SMTP is not configured — password reset email was NOT sent.");
    else console.log(`[dev] password reset link for ${to}: ${url}`);
    return;
  }

  const first = name.trim().split(/\s+/)[0] || "there";
  const text = `Hi ${first},\n\nWe received a request to reset your Elegent password. Use the link below to choose a new one. It expires in 1 hour.\n\n${url}\n\nIf you didn't ask for this, you can safely ignore this email — your password won't change.\n\nElegent`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#fff8f1;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff8f1;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="max-width:480px;background:#fbf3e6;border-radius:8px;padding:32px;font-family:Helvetica,Arial,sans-serif;color:#1e1b14;">
        <tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:4px;font-weight:bold;text-transform:uppercase;padding-bottom:24px;">Elegent</td></tr>
        <tr><td style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:36px;padding-bottom:12px;">Reset your password</td></tr>
        <tr><td style="font-size:15px;line-height:24px;color:#444748;padding-bottom:24px;">Hi ${esc(first)}, we received a request to reset your password. Choose a new one with the button below — the link expires in 1 hour.</td></tr>
        <tr><td style="padding-bottom:24px;"><a href="${esc(url)}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;padding:16px 28px;border-radius:2px;">Choose a new password</a></td></tr>
        <tr><td style="font-size:13px;line-height:20px;color:#747878;">Or paste this link into your browser:<br><a href="${esc(url)}" style="color:#745940;word-break:break-all;">${esc(url)}</a></td></tr>
        <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="font-size:13px;line-height:20px;color:#747878;padding-top:20px;border-top:1px solid #e9e1d5;">If you didn’t ask for this, you can ignore this email — your password won’t change.</td></tr>
      </table>
    </td></tr>
  </table></body></html>`;

  await t.sendMail({ from: process.env.MAIL_FROM || `Elegent <${process.env.SMTP_USER ?? "no-reply@localhost"}>`, to, subject: "Reset your Elegent password", text, html });
}
