import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getProject, listVisits } from "@/lib/business/store";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await ctx.params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  const visits = await listVisits(id);
  const now = Date.now();
  const views = visits.filter((item) => item.kind === "view");
  return NextResponse.json({
    totals: {
      views: views.length,
      views7d: views.filter((item) => now - new Date(item.createdAt).getTime() <= 7 * 86400000).length,
      views30d: views.filter((item) => now - new Date(item.createdAt).getTime() <= 30 * 86400000).length,
      clicks: visits.filter((item) => item.kind === "click").length,
      downloads: visits.filter((item) => item.kind === "download").length,
    },
    recent: visits.slice(0, 30),
  });
}
