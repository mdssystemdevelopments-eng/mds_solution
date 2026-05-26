import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSupabaseAdmin } from "@/lib/supabase/require-admin";

const CreateSchema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(200),
  excerpt: z.string().max(600).optional().nullable(),
  content_html: z.string().max(200_000).optional().default(""),
  cover_image_url: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});

export async function GET() {
  const auth = await requireSupabaseAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data, error } = await auth.supabase
    .from("posts")
    .select("id,title,slug,status,updated_at,published_at")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  const auth = await requireSupabaseAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  const payload = {
    ...parsed.data,
    author_id: auth.user.id,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await auth.supabase.from("posts").insert(payload).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}

