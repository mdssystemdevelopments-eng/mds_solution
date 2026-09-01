import { NextResponse } from "next/server";
import { getSiteContent, writeSiteContent, isSiteContent } from "@/lib/site-content";
import { deepMerge } from "@/lib/deep-merge";
import { defaultSiteContent } from "@/lib/default-site-content";
import { requireAdmin } from "@/lib/supabase/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Corpo vazio" }, { status: 400 });
  }
  const merged = deepMerge(defaultSiteContent as unknown as Record<string, unknown>, body as Record<string, unknown>);
  if (!isSiteContent(merged)) {
    return NextResponse.json({ error: "Estrutura do JSON inválida ou incompleta." }, { status: 400 });
  }
  const wrote = await writeSiteContent(
    merged,
    auth.mode === "supabase" ? auth.user.id : undefined,
  );
  if (!wrote.ok) {
    return NextResponse.json(
      {
        error: wrote.error,
        hint: "Não foi possível gravar o conteúdo. Confira DATABASE_URL no ambiente.",
      },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
