import { neon } from "@neondatabase/serverless";

export function isNeonConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.startsWith("postgres"));
}

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definido.");
  return neon(url);
}

let schemaReady = false;

export async function ensureSiteTables() {
  if (schemaReady || !isNeonConfigured()) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      locale TEXT PRIMARY KEY,
      content JSONB NOT NULL,
      updated_by TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS site_uploads (
      name TEXT PRIMARY KEY,
      mime TEXT NOT NULL,
      bytes TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  schemaReady = true;
}
