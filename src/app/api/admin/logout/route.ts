import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClientOptional } from "@/lib/supabase/server";

export async function POST() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClientOptional();
    if (supabase) await supabase.auth.signOut();
  }
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
