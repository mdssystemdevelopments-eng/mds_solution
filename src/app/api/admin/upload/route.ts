import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { deleteUpload, listUploads, saveUpload } from "@/lib/db/site-uploads";

export const runtime = "nodejs";

const MAX_BYTES = 3.5 * 1024 * 1024;
const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
};

function sniffMime(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "image/png";
  }
  const gif = buf.subarray(0, 6).toString("ascii");
  if (gif === "GIF87a" || gif === "GIF89a") return "image/gif";
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  const head = buf.subarray(0, 256).toString("utf8").trimStart().toLowerCase();
  if (head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"))) {
    if (/(<script|javascript:|onerror\s*=|onload\s*=)/i.test(head)) return null;
    return "image/svg+xml";
  }
  if (buf.includes(Buffer.from("ftypavif")) || buf.includes(Buffer.from("ftypavis"))) {
    return "image/avif";
  }
  return null;
}

function safeName(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const files = await listUploads();
  return NextResponse.json({ files });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!rateLimit(`upload:${clientKey(req)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitos envios. Aguarde alguns minutos." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Envio inválido." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Selecione um arquivo de imagem." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Imagem deve ter até 3,5 MB." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(buf);
  if (!mime || !MIME_EXT[mime]) {
    return NextResponse.json(
      { error: "Arquivo não reconhecido. Use JPG, PNG, GIF, WEBP, AVIF ou SVG." },
      { status: 400 },
    );
  }

  const name = `${Date.now()}-${randomBytes(6).toString("hex")}${MIME_EXT[mime]}`;
  try {
    const saved = await saveUpload(name, mime, buf);
    return NextResponse.json({ ok: true, url: saved.url, name });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Falha ao gravar imagem.";
    return NextResponse.json(
      { error: msg, hint: "Confira DATABASE_URL no ambiente da Vercel." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  let body: { name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const name = String(body.name ?? "");
  if (!safeName(name) || name === ".gitkeep") {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 });
  }

  const removed = await deleteUpload(name);
  if (!removed) {
    return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
