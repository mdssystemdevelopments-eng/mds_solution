import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { slugify } from "@/modules/shared/utils/slugify";
import { mediaSrc, newBusinessId, sanitizePlain } from "@/lib/business/helpers";
import { hashBusinessPassword } from "@/lib/business/password";
import { listCompanies, listProjects, listVisits, saveProject, slugTaken } from "@/lib/business/store";
import { applyLook } from "@/lib/business/palettes";
import { templateBlocks, templateDesign } from "@/lib/business/templates";
import {
  BUSINESS_TEMPLATES,
  BUSINESS_TYPES,
  type BusinessProject,
  type BusinessTemplate,
  type BusinessType,
} from "@/lib/business/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const [projects, companies, visits] = await Promise.all([listProjects(), listCompanies(), listVisits()]);
  const viewMap = new Map<string, number>();
  for (const visit of visits.filter((item) => item.kind === "view")) {
    viewMap.set(visit.projectId, (viewMap.get(visit.projectId) ?? 0) + 1);
  }
  return NextResponse.json({
    projects: projects.map((item) => ({
      ...item,
      passwordHash: item.passwordHash ? "set" : "",
      views: viewMap.get(item.id) ?? 0,
      companyName: companies.find((c) => c.id === item.companyId)?.name ?? "",
    })),
    companies,
  });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "JSON invalido" }, { status: 400 });

  const title = sanitizePlain(body.title, 160).trim();
  if (!title) return NextResponse.json({ error: "Informe o nome do projeto." }, { status: 400 });

  let slug = slugify(String(body.slug || title), { maxLength: 80 });
  if (!slug) slug = `projeto-${Date.now()}`;
  if (await slugTaken(slug)) slug = `${slug}-${Date.now().toString(36)}`;

  const type = BUSINESS_TYPES.includes(body.type as BusinessType) ? (body.type as BusinessType) : "personalizado";
  const template = BUSINESS_TEMPLATES.includes(body.template as BusinessTemplate)
    ? (body.template as BusinessTemplate)
    : "moderno";

  const now = new Date().toISOString();
  const project: BusinessProject = {
    id: newBusinessId("prj"),
    title,
    slug,
    description: sanitizePlain(body.description, 2000),
    companyId: sanitizePlain(body.companyId, 80),
    cover: mediaSrc(sanitizePlain(body.cover, 500)),
    type,
    template,
    status: "draft",
    visibility: "unlisted",
    passwordHash: "",
    author: auth.mode === "supabase" ? auth.user.email ?? "admin" : "admin",
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    design: applyLook(templateDesign(template), {
      theme: typeof body.theme === "string" ? body.theme : undefined,
      palette: typeof body.palette === "string" ? body.palette : undefined,
    }),
    seo: {
      title,
      description: sanitizePlain(body.description, 180),
      ogImage: mediaSrc(sanitizePlain(body.cover, 500)),
      robots: "noindex",
    },
    blocks: templateBlocks(template, title),
  };

  if (typeof body.password === "string" && body.password.trim()) {
    project.passwordHash = hashBusinessPassword(body.password.trim());
    project.visibility = "private";
  }

  await saveProject(project);
  return NextResponse.json({ project: { ...project, passwordHash: project.passwordHash ? "set" : "" } });
}
