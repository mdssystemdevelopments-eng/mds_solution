import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { listCompanies, listProjects, listVisits } from "@/lib/business/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const [projects, companies, visits] = await Promise.all([listProjects(), listCompanies(), listVisits()]);
  const now = Date.now();
  const week = now - 7 * 24 * 60 * 60 * 1000;
  const month = now - 30 * 24 * 60 * 60 * 1000;
  const views = visits.filter((item) => item.kind === "view");

  const byProject = new Map<string, number>();
  for (const visit of views) {
    byProject.set(visit.projectId, (byProject.get(visit.projectId) ?? 0) + 1);
  }

  const top = [...byProject.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const project = projects.find((item) => item.id === id);
      return { id, title: project?.title ?? id, views: count };
    });

  return NextResponse.json({
    totals: {
      projects: projects.length,
      published: projects.filter((item) => item.status === "published").length,
      drafts: projects.filter((item) => item.status === "draft").length,
      private: projects.filter((item) => item.visibility === "private").length,
      companies: companies.length,
      views: views.length,
      views7d: views.filter((item) => new Date(item.createdAt).getTime() >= week).length,
      views30d: views.filter((item) => new Date(item.createdAt).getTime() >= month).length,
    },
    top,
    recent: projects.slice(0, 8).map((item) => ({
      ...item,
      passwordHash: item.passwordHash ? "set" : "",
      views: byProject.get(item.id) ?? 0,
      companyName: companies.find((c) => c.id === item.companyId)?.name ?? "",
    })),
  });
}
