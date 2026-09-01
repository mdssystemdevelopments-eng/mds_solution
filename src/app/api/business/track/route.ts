import { NextResponse } from "next/server";
import { addVisit, getProject } from "@/lib/business/store";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`biz-track:${clientKey(req)}`, 80, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: true });
  }
  const body = (await req.json().catch(() => null)) as {
    projectId?: string;
    kind?: "view" | "click" | "download" | "block";
    meta?: Record<string, string>;
  } | null;
  if (!body?.projectId || !body.kind) return NextResponse.json({ ok: true });
  const project = await getProject(body.projectId);
  if (!project || project.status !== "published") return NextResponse.json({ ok: true });
  await addVisit({
    projectId: project.id,
    kind: body.kind,
    meta: {
      path: String(body.meta?.path ?? "").slice(0, 180),
      label: String(body.meta?.label ?? "").slice(0, 80),
    },
  });
  return NextResponse.json({ ok: true });
}
