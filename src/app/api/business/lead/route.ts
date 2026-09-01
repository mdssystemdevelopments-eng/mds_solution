import { NextResponse } from "next/server";
import { addVisit, getProject, getCompany } from "@/lib/business/store";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { sanitizePlain } from "@/lib/business/helpers";
import { projectWhatsapp } from "@/lib/business/cta";
import { whatsappHref } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`biz-lead:${clientKey(req)}`, 12, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Aguarde um pouco e tente de novo." }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as {
    projectId?: string;
    name?: string;
    phone?: string;
    message?: string;
  } | null;
  const projectId = sanitizePlain(body?.projectId, 80);
  const name = sanitizePlain(body?.name, 120).trim();
  const phone = sanitizePlain(body?.phone, 40).trim();
  const message = sanitizePlain(body?.message, 2000).trim();
  if (!projectId || !name || !phone || !message) {
    return NextResponse.json({ error: "Preencha nome, WhatsApp e mensagem." }, { status: 400 });
  }
  const project = await getProject(projectId);
  if (!project) {
    return NextResponse.json({ error: "Projeto indisponivel." }, { status: 404 });
  }
  const company = project.companyId ? await getCompany(project.companyId) : null;
  await addVisit({
    projectId: project.id,
    kind: "lead",
    meta: { name, phone, message, path: `/business/${project.slug}` },
  });
  const text = `Projeto: ${project.title}\nNome: ${name}\nWhatsApp: ${phone}\n${message}`;
  const whatsappUrl = whatsappHref(projectWhatsapp(project.design.whatsapp, company?.whatsapp), text);
  return NextResponse.json({ ok: true, whatsappUrl });
}
