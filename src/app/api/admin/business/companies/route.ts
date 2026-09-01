import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { deleteCompany, listCompanies, saveCompany } from "@/lib/business/store";
import { newBusinessId, sanitizePlain } from "@/lib/business/helpers";
import type { BusinessCompany } from "@/lib/business/types";

export const dynamic = "force-dynamic";

function fromBody(body: Record<string, unknown>, current?: BusinessCompany): BusinessCompany {
  const now = new Date().toISOString();
  return {
    id: current?.id ?? newBusinessId("emp"),
    name: sanitizePlain(body.name, 120),
    tradeName: sanitizePlain(body.tradeName, 120),
    logo: sanitizePlain(body.logo, 400),
    description: sanitizePlain(body.description, 2000),
    site: sanitizePlain(body.site, 300),
    phone: sanitizePlain(body.phone, 40),
    whatsapp: sanitizePlain(body.whatsapp, 40),
    email: sanitizePlain(body.email, 120),
    address: sanitizePlain(body.address, 240),
    instagram: sanitizePlain(body.instagram, 200),
    linkedin: sanitizePlain(body.linkedin, 200),
    notes: sanitizePlain(body.notes, 2000),
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  };
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json({ companies: await listCompanies() });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  const company = fromBody(body);
  if (!company.name.trim()) return NextResponse.json({ error: "Informe o nome da empresa." }, { status: 400 });
  return NextResponse.json({ company: await saveCompany(company) });
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.id) return NextResponse.json({ error: "ID obrigatorio" }, { status: 400 });
  const companies = await listCompanies();
  const current = companies.find((item) => item.id === String(body.id));
  if (!current) return NextResponse.json({ error: "Empresa nao encontrada." }, { status: 404 });
  const company = fromBody(body, current);
  if (!company.name.trim()) return NextResponse.json({ error: "Informe o nome da empresa." }, { status: 400 });
  return NextResponse.json({ company: await saveCompany(company) });
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await req.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "ID obrigatorio" }, { status: 400 });
  const ok = await deleteCompany(body.id);
  if (!ok) return NextResponse.json({ error: "Remova ou realoque os projetos desta empresa antes de excluir." }, { status: 409 });
  return NextResponse.json({ ok: true });
}
