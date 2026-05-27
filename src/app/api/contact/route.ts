import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/site-content";
import { validateContactInput } from "@/modules/shared/contracts/contact";

export async function POST(req: Request) {
  const { contact, contactPage } = await getSiteContent();

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = validateContactInput((json ?? {}) as Record<string, unknown>);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { name, email, body } = parsed.payload;

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
