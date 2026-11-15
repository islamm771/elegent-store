import { NextResponse } from "next/server";
import { legal } from "@/lib/legal";
import { sendPlainEmail } from "@/lib/mail";
import { isEmail } from "@/lib/validation";

// Three messages per hour per address. In memory, so it resets on restart and isn't shared between serverless instances.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t > 3_600_000)) hits.delete(k);
  return recent.length > 3;
}
const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

/** POST /api/legal/inquiry — the "legal inquiry" form on the Terms page. Emails the legal secretariat. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: bots fill this in, people never see it

  const name = clean(body.name, 120), patronId = clean(body.patronId, 40), email = clean(body.email, 254), nature = clean(body.nature, 80);
  const statement = String(body.statement ?? "").trim().slice(0, 2000);
  if (name.length < 2 || !isEmail(email) || statement.length < 20) return NextResponse.json({ error: "validation" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  try {
    const sent = await sendPlainEmail({
      to: legal.emails.inquiryTo, replyTo: email, subject: `[Legal inquiry] ${nature || "General"} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPatron ID: ${patronId || "-"}\nNature: ${nature}\n\n${statement}\n`,
    });
    return sent ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "unavailable" }, { status: 503 });
  } catch (e) {
    console.error("legal inquiry failed", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
