import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { slugify } from "@/modules/shared/utils/slugify";
import { deleteProject, getProject, saveProject, slugTaken } from "@/lib/business/store";
import { hashBusinessPassword } from "@/lib/business/password";
import { mediaSrc, sanitizeHtml, sanitizePlain } from "@/lib/business/helpers";
import { lookTheme } from "@/lib/business/palettes";
import {
  BLOCK_TYPES,
  BUSINESS_STATUSES,
  BUSINESS_TEMPLATES,
  BUSINESS_TYPES,
  BUSINESS_VISIBILITIES,
  DEFAULT_DESIGN,
  type BusinessBlock,
  type BusinessProject,
} from "@/lib/business/types";

export const dynamic = "force-dynamic";

function cleanBlocks(input: unknown): BusinessBlock[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 80).map((raw) => {
    const item = raw as Record<string, unknown>;
    const type = BLOCK_TYPES.includes(item.type as BusinessBlock["type"]) ? (item.type as BusinessBlock["type"]) : "text";
    const content = item.content && typeof item.content === "object" ? (item.content as Record<string, unknown>) : {};
    if ((type === "html" || type === "text") && typeof content.html === "string") {
      content.html = sanitizeHtml(content.html, type === "html" ? 80000 : 20000, false);
    }
    if (typeof content.text === "string") content.text = sanitizePlain(content.text, 8000);
    for (const key of ["image", "src", "thumb", "logo", "ogImage"]) {
      if (typeof content[key] === "string") content[key] = mediaSrc(content[key]);
    }
    if (Array.isArray(content.images)) content.images = content.images.map(mediaSrc);
    if (Array.isArray(content.items)) {
      content.items = content.items.map((item) => {
        if (!item || typeof item !== "object") return item;
        const row = item as Record<string, unknown>;
        if (typeof row.image === "string") row.image = mediaSrc(row.image);
        return row;
      });
    }
    return {
      id: sanitizePlain(item.id || `block_${Math.random().toString(36).slice(2, 8)}`, 60),
      type,
      hidden: Boolean(item.hidden),
      content,
    };
  });
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await ctx.params;
  const project = await getProject(id);
  if (!project) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  return NextResponse.json({ project: { ...project, passwordHash: project.passwordHash ? "set" : "" } });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await ctx.params;
  const current = await getProject(id);
  if (!current) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "JSON invalido" }, { status: 400 });

  const title = sanitizePlain(body.title ?? current.title, 160).trim();
  if (!title) return NextResponse.json({ error: "Informe o nome do projeto." }, { status: 400 });

  let slug = slugify(String(body.slug || current.slug || title), { maxLength: 80 });
  if (!slug) slug = current.slug;
  if (await slugTaken(slug, current.id)) {
    return NextResponse.json({ error: "Este slug ja esta em uso." }, { status: 409 });
  }

  const next: BusinessProject = {
    ...current,
    title,
    slug,
    description: sanitizePlain(body.description ?? current.description, 2000),
    companyId: sanitizePlain(body.companyId ?? current.companyId, 80),
    cover: mediaSrc(sanitizePlain(body.cover ?? current.cover, 500)),
    type: BUSINESS_TYPES.includes(body.type as BusinessProject["type"]) ? (body.type as BusinessProject["type"]) : current.type,
    template: BUSINESS_TEMPLATES.includes(body.template as BusinessProject["template"])
      ? (body.template as BusinessProject["template"])
      : current.template,
    status: BUSINESS_STATUSES.includes(body.status as BusinessProject["status"])
      ? (body.status as BusinessProject["status"])
      : current.status,
    visibility: BUSINESS_VISIBILITIES.includes(body.visibility as BusinessProject["visibility"])
      ? (body.visibility as BusinessProject["visibility"])
      : current.visibility,
    design: {
      ...DEFAULT_DESIGN,
      ...(typeof body.design === "object" && body.design ? body.design : current.design),
      theme: lookTheme(
        typeof body.design === "object" && body.design
          ? (body.design as { theme?: string }).theme
          : current.design.theme,
      ),
      palette: sanitizePlain(
        typeof body.design === "object" && body.design
          ? (body.design as { palette?: string }).palette
          : current.design.palette,
        40,
      ) || current.design.palette || "mds",
      logo: mediaSrc(
        (typeof body.design === "object" && body.design
          ? (body.design as { logo?: string }).logo
          : current.design.logo) ?? current.design.logo,
      ),
      coverColor: sanitizePlain(
        (typeof body.design === "object" && body.design
          ? (body.design as { coverColor?: string }).coverColor
          : current.design.coverColor) || current.design.coverColor || "",
        24,
      ),
    },
    seo: {
      title: sanitizePlain((body.seo as { title?: string } | undefined)?.title ?? current.seo.title, 160),
      description: sanitizePlain((body.seo as { description?: string } | undefined)?.description ?? current.seo.description, 220),
      ogImage: mediaSrc(sanitizePlain((body.seo as { ogImage?: string } | undefined)?.ogImage ?? current.seo.ogImage, 500)),
      robots: (body.seo as { robots?: "index" | "noindex" } | undefined)?.robots === "index" ? "index" : "noindex",
    },
    blocks: body.blocks ? cleanBlocks(body.blocks) : current.blocks,
  };

  if (typeof body.password === "string") {
    next.passwordHash = body.password.trim() ? hashBusinessPassword(body.password.trim()) : "";
  }

  if (next.status === "published" && !next.publishedAt) next.publishedAt = new Date().toISOString();
  if (next.status !== "published") next.publishedAt = next.status === "draft" ? null : next.publishedAt;

  await saveProject(next);
  return NextResponse.json({ project: { ...next, passwordHash: next.passwordHash ? "set" : "" } });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await ctx.params;
  const ok = await deleteProject(id);
  if (!ok) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
