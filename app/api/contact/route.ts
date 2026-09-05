import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { name, email, message, website } = body as Record<string, string>;
  if (website) return NextResponse.json({ ok: true });
  if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_EMAIL;
  if (!key || !to) { console.log("[contact] (no RESEND_API_KEY set)", { name, email, message }); return NextResponse.json({ ok: true }); }

  try {
    const { Resend } = await import("resend");
    await new Resend(key).emails.send({
      from: "Portfolio <onboarding@resend.dev>", to, replyTo: email,
      subject: `New inquiry from ${name}`, text: `${name} <${email}>\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) { console.error(err); return NextResponse.json({ error: "Send failed" }, { status: 500 }); }
}
