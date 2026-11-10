import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-session";
import { businessAccessToken, businessCookieName } from "@/lib/business/password";
import { getSiteFile } from "@/lib/business/site-files";
import { getProjectBySlug } from "@/lib/business/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function denied() {
  return new NextResponse("Preview indisponivel.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string; path?: string[] }> }) {
  const { slug, path: parts } = await ctx.params;
  const project = await getProjectBySlug(slug);
  if (!project) return denied();

  const admin = await isAdminSession();
  if (!admin && project.status !== "published") return denied();
  if (!admin && project.visibility === "private" && project.passwordHash) {
    const token = (await cookies()).get(businessCookieName(project.id))?.value;
    const expected = businessAccessToken(project.id, project.passwordHash);
    if (token !== expected) return denied();
  }

  const joined = (parts || []).join("/");
  const candidates = joined
    ? [joined, joined.endsWith("/") ? `${joined}index.html` : `${joined}/index.html`]
    : ["index.html"];
  if (joined && !joined.includes(".")) candidates.push("index.html");

  let file = null;
  for (const candidate of candidates) {
    file = await getSiteFile(project.id, candidate);
    if (file) break;
  }
  if (!file) return denied();

  return new NextResponse(new Uint8Array(file.buf), {
    headers: {
      "Content-Type": file.mime,
      "Cache-Control": "private, max-age=60",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
