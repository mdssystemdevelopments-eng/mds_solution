import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { parseGithubRepo } from "@/lib/business/github";
import {
  getGithubToken,
  githubLatestBuildZip,
  githubRepoMeta,
  githubZipball,
} from "@/lib/business/github-api";
import { publishPreviewZip } from "@/lib/business/site-preview";
import { getProject, saveProject } from "@/lib/business/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function keepExternalSite(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (!host || host === "github.com" || host.endsWith(".github.io")) return "";
    return url;
  } catch {
    return "";
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!rateLimit(`gh-sync:${clientKey(req)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas sincronizacoes. Aguarde alguns minutos." }, { status: 429 });
  }

  const { id } = await ctx.params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  const ref = parseGithubRepo(project.githubRepo);
  if (!ref) {
    return NextResponse.json({ error: "Informe o repositorio GitHub neste projeto." }, { status: 400 });
  }

  const token = await getGithubToken();
  if (!token) {
    return NextResponse.json({ error: "Conecte um token do GitHub na aba Site." }, { status: 400 });
  }

  const meta = await githubRepoMeta(token, ref.owner, ref.repo);
  if ("error" in meta) {
    return NextResponse.json({ error: meta.error }, { status: meta.status || 400 });
  }

  let zip: Buffer | null = null;
  let usedRelease = false;
  try {
    zip = await githubLatestBuildZip(token, ref.owner, ref.repo);
    usedRelease = Boolean(zip);
    if (!zip) zip = await githubZipball(token, ref.owner, ref.repo, meta.defaultBranch);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao baixar o repositorio." },
      { status: 400 },
    );
  }

  if (!zip) {
    return NextResponse.json({ error: "Nao foi possivel baixar o repositorio." }, { status: 400 });
  }

  const published = await publishPreviewZip(project.id, project.slug, zip);
  if (!published.ok) {
    if (published.needsBuild) {
      return NextResponse.json(
        {
          error: published.error,
          needsBuild: true,
          private: meta.private,
          loginOk: true,
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: published.error }, { status: 400 });
  }

  const next = {
    ...project,
    githubPreviewAt: new Date().toISOString(),
    githubPreviewFiles: published.files,
    githubSite: keepExternalSite(project.githubSite || ""),
  };
  await saveProject(next);
  return NextResponse.json({
    project: { ...next, passwordHash: next.passwordHash ? "set" : "" },
    files: published.files,
    private: meta.private,
    usedRelease,
  });
}
