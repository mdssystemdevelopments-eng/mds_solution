import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProjectBySlug } from "@/lib/business/store";
import { businessAccessToken, businessCookieName, verifyBusinessPassword } from "@/lib/business/password";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`biz-unlock:${clientKey(req)}`, 12, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as { slug?: string; password?: string } | null;
  if (!body?.slug || !body.password) {
    return NextResponse.json({ error: "Informe a senha." }, { status: 400 });
  }
  const project = await getProjectBySlug(body.slug);
  if (!project || !project.passwordHash) {
    return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  }
  if (!verifyBusinessPassword(body.password, project.passwordHash)) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }
  (await cookies()).set(businessCookieName(project.id), businessAccessToken(project.id, project.passwordHash), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return NextResponse.json({ ok: true });
}
