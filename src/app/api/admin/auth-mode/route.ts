import { NextResponse } from "next/server";
import { isNeonConfigured } from "@/lib/db/neon";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (isNeonConfigured()) return NextResponse.json({ mode: "neon" });
  if (isSupabaseConfigured()) return NextResponse.json({ mode: "supabase" });
  return NextResponse.json({ mode: "legacy" });
}
