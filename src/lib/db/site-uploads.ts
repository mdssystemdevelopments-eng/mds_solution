import { mkdir, readdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { ensureSiteTables, getSql, isNeonConfigured } from "@/lib/db/neon";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type UploadItem = { name: string; url: string; mime?: string };

function publicUrl(name: string): string {
  return `/api/media/${encodeURIComponent(name)}`;
}

export async function listUploads(): Promise<UploadItem[]> {
  if (isNeonConfigured()) {
    await ensureSiteTables();
    const sql = getSql();
    const rows = (await sql`
      SELECT name, mime FROM site_uploads ORDER BY created_at DESC
    `) as { name: string; mime: string }[];
    return rows.map((row) => ({
      name: row.name,
      mime: row.mime,
      url: publicUrl(row.name),
    }));
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const files = await readdir(UPLOAD_DIR);
  return files
    .filter((name) => name !== ".gitkeep")
    .reverse()
    .map((name) => ({ name, url: publicUrl(name) }));
}

export async function saveUpload(name: string, mime: string, buf: Buffer): Promise<{ url: string }> {
  if (isNeonConfigured()) {
    await ensureSiteTables();
    const sql = getSql();
    const bytes = buf.toString("base64");
    await sql`
      INSERT INTO site_uploads (name, mime, bytes, created_at)
      VALUES (${name}, ${mime}, ${bytes}, NOW())
      ON CONFLICT (name) DO UPDATE SET
        mime = EXCLUDED.mime,
        bytes = EXCLUDED.bytes,
        created_at = NOW()
    `;
    return { url: publicUrl(name) };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), buf);
  return { url: publicUrl(name) };
}

export async function deleteUpload(name: string): Promise<boolean> {
  if (isNeonConfigured()) {
    await ensureSiteTables();
    const sql = getSql();
    const rows = (await sql`
      DELETE FROM site_uploads WHERE name = ${name} RETURNING name
    `) as { name: string }[];
    return rows.length > 0;
  }

  try {
    await unlink(path.join(UPLOAD_DIR, name));
    return true;
  } catch {
    return false;
  }
}

export async function readUpload(name: string): Promise<{ mime: string; buf: Buffer } | null> {
  if (isNeonConfigured()) {
    await ensureSiteTables();
    const sql = getSql();
    const rows = (await sql`
      SELECT mime, bytes FROM site_uploads WHERE name = ${name} LIMIT 1
    `) as { mime: string; bytes: string }[];
    const row = rows[0];
    if (row?.bytes) {
      return { mime: row.mime, buf: Buffer.from(row.bytes, "base64") };
    }
  }

  try {
    const buf = await readFile(path.join(UPLOAD_DIR, name));
    const ext = path.extname(name).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".gif"
          ? "image/gif"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".avif"
              ? "image/avif"
              : ext === ".svg"
                ? "image/svg+xml"
                : ext === ".pdf"
                  ? "application/pdf"
                  : "image/jpeg";
    return { mime, buf };
  } catch {
    return null;
  }
}
