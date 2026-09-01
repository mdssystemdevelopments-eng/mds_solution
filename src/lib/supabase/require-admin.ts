import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { assertAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "./env";
import { createSupabaseServerClientOptional } from "./server";

type AdminOk =
  | { ok: true; mode: "supabase"; supabase: SupabaseClient; user: User }
  | { ok: true; mode: "legacy"; supabase: null; user: null };

type AdminFail = { ok: false; status: number; error: string };

export async function requireAdmin(): Promise<AdminOk | AdminFail> {
  if (!isSupabaseConfigured()) {
    const legacy = await assertAdmin();
    if (!legacy.ok) {
      return {
        ok: false,
        status: legacy.status,
        error: legacy.status === 503 ? "Admin não configurado." : "Não autenticado",
      };
    }
    return { ok: true, mode: "legacy", supabase: null, user: null };
  }

  const supabase = await createSupabaseServerClientOptional();
  if (!supabase) {
    return { ok: false, status: 503, error: "Supabase indisponível." };
  }

  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !authData.user) {
    return { ok: false, status: 401, error: "Não autenticado" };
  }

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (profErr) {
    return { ok: false, status: 500, error: "Falha ao validar perfil" };
  }
  if (!profile || profile.role !== "admin") {
    return { ok: false, status: 403, error: "Sem permissão" };
  }

  return { ok: true, mode: "supabase", supabase, user: authData.user };
}

/** Exige admin autenticado e Supabase configurado (posts, produtos, mídias). */
export async function requireSupabaseAdmin(): Promise<
  | { ok: true; supabase: SupabaseClient; user: User }
  | AdminFail
> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (auth.mode === "legacy") {
    return {
      ok: false,
      status: 503,
      error: "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local.",
    };
  }
  return { ok: true, supabase: auth.supabase, user: auth.user };
}
