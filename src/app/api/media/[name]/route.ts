import { NextResponse } from "next/server";
import { readUpload } from "@/lib/db/site-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeName(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const decoded = decodeURIComponent(name);
  if (!safeName(decoded)) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }

  const file = await readUpload(decoded);
  if (!file) {
    return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file.buf), {
    headers: {
      "Content-Type": file.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
