import { cookies } from "next/headers";
import { isValidAdminCookie } from "@/lib/admin-auth";
import { createSupabaseServerClientOptional } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

/** Usuário autenticado no painel (Supabase ou cookie legado). */
export async function isAdminSession(): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClientOptional();
    if (!supabase) return false;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return false;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();
    return profile?.role === "admin";
  }

  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return isValidAdminCookie(token);
}
