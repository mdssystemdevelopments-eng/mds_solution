import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { ensureBusinessTables } from "@/lib/business/store";
import { getSql, isNeonConfigured } from "@/lib/db/neon";

const ROOT = path.join(process.cwd(), "data", "business-sites");

export type SiteFile = { path: string; mime: string; buf: Buffer };

export function safeSitePath(input: string): string {
  const clean = String(input || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
  if (!clean || clean.includes("..") || clean.includes("\0")) return "";
  return clean.slice(0, 240);
}

export async function replaceSiteFiles(projectId: string, files: SiteFile[]): Promise<number> {
  await deleteSiteFiles(projectId);
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const sql = getSql();
    for (const file of files) {
      const filePath = safeSitePath(file.path);
      if (!filePath) continue;
      await sql`
        INSERT INTO business_site_files (project_id, path, mime, bytes)
        VALUES (${projectId}, ${filePath}, ${file.mime}, ${file.buf.toString("base64")})
      `;
    }
    return files.length;
  }
  const dir = path.join(ROOT, projectId);
  await mkdir(dir, { recursive: true });
  for (const file of files) {
    const filePath = safeSitePath(file.path);
    if (!filePath) continue;
    const full = path.join(dir, filePath);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, file.buf);
    await writeFile(`${full}.mime`, file.mime, "utf8");
  }
  return files.length;
}

export async function getSiteFile(projectId: string, filePath: string): Promise<SiteFile | null> {
  const clean = safeSitePath(filePath) || "index.html";
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = (await getSql()`
      SELECT path, mime, bytes FROM business_site_files
      WHERE project_id = ${projectId} AND path = ${clean}
      LIMIT 1
    `) as { path: string; mime: string; bytes: string }[];
    const row = rows[0];
    if (!row?.bytes) return null;
    return { path: row.path, mime: row.mime, buf: Buffer.from(row.bytes, "base64") };
  }
  try {
    const full = path.join(ROOT, projectId, clean);
    const buf = await readFile(full);
    let mime = "application/octet-stream";
    try {
      mime = (await readFile(`${full}.mime`, "utf8")).trim() || mime;
    } catch {
      /* ignore */
    }
    return { path: clean, mime, buf };
  } catch {
    return null;
  }
}

export async function deleteSiteFiles(projectId: string): Promise<void> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    await getSql()`DELETE FROM business_site_files WHERE project_id = ${projectId}`;
    return;
  }
  await rm(path.join(ROOT, projectId), { recursive: true, force: true });
}
