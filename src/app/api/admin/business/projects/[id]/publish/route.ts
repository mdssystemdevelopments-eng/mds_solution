import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getProject, saveProject } from "@/lib/business/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await ctx.params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { action?: string };
  const publish = body.action !== "unpublish";
  project.status = publish ? "published" : "draft";
  project.publishedAt = publish ? new Date().toISOString() : null;
  if (publish && project.seo.robots === "noindex" && project.visibility === "public") {
    project.seo.robots = "index";
  }
  await saveProject(project);
  return NextResponse.json({ project: { ...project, passwordHash: project.passwordHash ? "set" : "" } });
}
