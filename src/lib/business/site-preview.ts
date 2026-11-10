import JSZip from "jszip";
import { replaceSiteFiles, type SiteFile } from "@/lib/business/site-files";

const MAX_FILES = 80;
const MAX_FILE = 2 * 1024 * 1024;
const MAX_TOTAL = 10 * 1024 * 1024;

const SKIP =
  /(^|\/)(node_modules|\.git|\.next|\.turbo|\.cache|coverage)(\/|$)|(^|\/)\.env(\.|$)|(\.pem|\.key|\.map)$/i;

export type PreviewResult =
  | { ok: true; files: number; kind: "static" }
  | { ok: false; error: string; needsBuild?: boolean };

function mimeOf(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "text/javascript; charset=utf-8",
    mjs: "text/javascript; charset=utf-8",
    json: "application/json",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    txt: "text/plain; charset=utf-8",
    xml: "application/xml",
  };
  return map[ext] || "application/octet-stream";
}

function isText(mime: string): boolean {
  return /html|css|javascript|json|svg|xml|text/.test(mime);
}

function stripTopFolder(names: string[]): (p: string) => string {
  const files = names.filter(Boolean);
  if (!files.length) return (p) => p;
  const top = files[0].split("/")[0];
  if (!top) return (p) => p;
  if (files.every((name) => name === top || name.startsWith(`${top}/`))) {
    return (p) => (p.startsWith(`${top}/`) ? p.slice(top.length + 1) : "");
  }
  return (p) => p;
}

function detectRoot(files: string[]): { root: string; kind: "static" | "source" } | null {
  if (files.includes("dist/index.html")) return { root: "dist", kind: "static" };
  if (files.includes("out/index.html")) return { root: "out", kind: "static" };
  if (files.includes("build/index.html")) return { root: "build", kind: "static" };
  const vite =
    files.some((file) => /(^|\/)vite\.config\.(ts|js|mjs)$/.test(file)) ||
    files.includes("src/main.tsx") ||
    files.includes("src/main.jsx") ||
    files.includes("src/main.ts");
  if (files.includes("index.html") && vite) return { root: "", kind: "source" };
  if (files.includes("index.html")) return { root: "", kind: "static" };
  return null;
}

function rewritePublicPaths(content: string, prefix: string): string {
  const base = prefix.replace(/\/$/, "");
  return content
    .replace(/(["'(])\/assets\//g, `$1${base}/assets/`)
    .replace(/(href|src)=["']\/(?!\/|https?:|business\/)/gi, `$1="${base}/`);
}

function underRoot(filePath: string, root: string): string | null {
  if (!root) return filePath;
  if (!filePath.startsWith(`${root}/`)) return null;
  return filePath.slice(root.length + 1);
}

export async function publishPreviewZip(
  projectId: string,
  slug: string,
  zipBuf: Buffer,
): Promise<PreviewResult> {
  if (zipBuf.length > 8 * 1024 * 1024) {
    return { ok: false, error: "O arquivo e grande demais. Envie um zip de ate 8 MB." };
  }
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(zipBuf);
  } catch {
    return { ok: false, error: "Zip invalido." };
  }
  const rawNames = Object.keys(zip.files).filter((name) => !zip.files[name]?.dir);
  const strip = stripTopFolder(rawNames);
  const names = rawNames.map(strip).filter(Boolean);
  const detected = detectRoot(names);
  if (!detected) {
    return {
      ok: false,
      error: "Nao achei um site pronto neste zip. Precisa ter index.html, dist/ ou out/.",
    };
  }
  if (detected.kind === "source") {
    return {
      ok: false,
      needsBuild: true,
      error:
        "Este repositorio e um app (Vite/React). O GitHub privado guarda o codigo, nao o site. No projeto, rode npm run build e envie o zip da pasta dist. O preview abre neste dominio, sem site extra.",
    };
  }

  const prefix = `/business/${encodeURIComponent(slug)}/site`;
  const out: SiteFile[] = [];
  let total = 0;
  for (const raw of rawNames) {
    const rel = strip(raw);
    const stored = underRoot(rel, detected.root);
    if (!stored || SKIP.test(stored)) continue;
    const entry = zip.files[raw];
    if (!entry || entry.dir) continue;
    const buf = Buffer.from(await entry.async("uint8array"));
    if (buf.length > MAX_FILE) continue;
    total += buf.length;
    if (total > MAX_TOTAL || out.length >= MAX_FILES) {
      return { ok: false, error: "O site passou do limite de preview (10 MB ou 80 arquivos)." };
    }
    const mime = mimeOf(stored);
    const body = isText(mime) ? Buffer.from(rewritePublicPaths(buf.toString("utf8"), prefix), "utf8") : buf;
    out.push({ path: stored, mime, buf: body });
  }

  if (!out.some((file) => file.path === "index.html")) {
    return { ok: false, error: "O build nao tem index.html." };
  }

  await replaceSiteFiles(projectId, out);
  return { ok: true, files: out.length, kind: "static" };
}
