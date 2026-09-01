import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getProject, saveProject, slugTaken } from "@/lib/business/store";
import { newBusinessId } from "@/lib/business/helpers";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await ctx.params;
  const current = await getProject(id);
  if (!current) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });

  let slug = `${current.slug}-copia`;
  if (await slugTaken(slug)) slug = `${slug}-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  const copy = {
    ...current,
    id: newBusinessId("prj"),
    title: `${current.title} (copia)`,
    slug,
    status: "draft" as const,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
    blocks: current.blocks.map((block) => ({ ...block, id: newBusinessId("block"), content: { ...block.content } })),
  };
  await saveProject(copy);
  return NextResponse.json({ project: { ...copy, passwordHash: copy.passwordHash ? "set" : "" } });
}
