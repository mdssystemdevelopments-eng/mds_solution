import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  getAdminCredentials,
  setAdminCookie,
} from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClientOptional } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { isAllowedAdminHost } from "@/lib/admin-host";
import { clientKey, rateLimit } from "@/lib/rate-limit";

function safeCompare(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!isAllowedAdminHost(req.headers.get("host"))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!rateLimit(`login:${clientKey(req)}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde 15 minutos." }, { status: 429 });
  }

  let body: { email?: string; username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const password = String(body.password ?? "");
  if (!password) {
    return NextResponse.json({ error: "Informe a senha." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    const { username: u, password: p } = getAdminCredentials();
    const inUser = String(body.username ?? body.email ?? "").trim().toLowerCase();
    const expectedUser = u.trim().toLowerCase();
    if (!safeCompare(inUser, expectedUser) || !safeCompare(password, p)) {
      return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
    }
    await setAdminCookie();
    return NextResponse.json({ ok: true, mode: "legacy" });
  }

  const email = String(body.email ?? "").trim();
  if (!email) {
    return NextResponse.json({ error: "Informe o email." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClientOptional();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase indisponível." }, { status: 503 });
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: "Falha no login." }, { status: 401 });
  }

  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Sem permissão de admin." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, mode: "supabase" });
}
