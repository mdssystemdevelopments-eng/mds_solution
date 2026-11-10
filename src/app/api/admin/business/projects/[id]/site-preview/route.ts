import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { publishPreviewZip } from "@/lib/business/site-preview";
import { deleteSiteFiles } from "@/lib/business/site-files";
import { getProject, saveProject } from "@/lib/business/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!rateLimit(`site-prev:${clientKey(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitos envios. Aguarde alguns minutos." }, { status: 429 });
  }

  const { id } = await ctx.params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Envio invalido." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Envie o zip da pasta dist." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "O zip deve ter ate 8 MB." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const published = await publishPreviewZip(project.id, project.slug, buf);
  if (!published.ok) {
    return NextResponse.json({ error: published.error, needsBuild: published.needsBuild }, { status: published.needsBuild ? 409 : 400 });
  }

  const next = {
    ...project,
    githubPreviewAt: new Date().toISOString(),
    githubPreviewFiles: published.files,
  };
  await saveProject(next);
  return NextResponse.json({
    project: { ...next, passwordHash: next.passwordHash ? "set" : "" },
    files: published.files,
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await ctx.params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  await deleteSiteFiles(project.id);
  const next = { ...project, githubPreviewAt: null, githubPreviewFiles: 0 };
  await saveProject(next);
  return NextResponse.json({ project: { ...next, passwordHash: next.passwordHash ? "set" : "" } });
}
