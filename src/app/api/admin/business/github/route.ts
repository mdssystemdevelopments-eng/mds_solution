import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import {
  deleteGithubToken,
  githubConnection,
  githubUser,
  saveGithubToken,
} from "@/lib/business/github-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json(await githubConnection());
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await req.json().catch(() => null)) as { token?: string } | null;
  const token = String(body?.token || "").trim();
  if (!token || token.length > 200) {
    return NextResponse.json({ error: "Informe o token do GitHub." }, { status: 400 });
  }
  if (!/^(ghp_|github_pat_|gho_)/.test(token)) {
    return NextResponse.json({ error: "Este token nao parece do GitHub." }, { status: 400 });
  }
  const user = await githubUser(token);
  if (!user) {
    return NextResponse.json({ error: "Token recusado pelo GitHub. Gere um token com permissao repo." }, { status: 400 });
  }
  await saveGithubToken(token);
  return NextResponse.json({ connected: true, login: user.login, source: "saved" });
}

export async function DELETE() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  await deleteGithubToken();
  return NextResponse.json(await githubConnection());
}
