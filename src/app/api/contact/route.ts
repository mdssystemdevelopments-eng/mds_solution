import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/site-content";

type Body = { name?: string; email?: string; body?: string };

export async function POST(req: Request) {
  const { contact, contactPage } = await getSiteContent();

  let json: Body;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const name = String(json.name || "").trim().slice(0, 120);
  const email = String(json.email || "").trim().slice(0, 200);
  const body = String(json.body || "").trim().slice(0, 8000);

  if (!name || !email || !body) {
    return NextResponse.json({ error: "Preencha nome, e-mail e mensagem." }, { status: 400 });
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const line = `[contato site] ${new Date().toISOString()} | ${name} <${email}> | ${body.replace(/\s+/g, " ")}`;
  console.info(line);

  if (process.env.CONTACT_WEBHOOK_URL) {
    try {
      await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: body, to: contact.email }),
      });
    } catch {
      /* webhook opcional */
    }
  }

  return NextResponse.json({
    ok: true,
    message: contactPage.successHint,
  });
}
