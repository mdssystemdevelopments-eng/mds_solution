import fs from "fs";
import path from "path";
import { ensureSiteTables, getSql, isNeonConfigured } from "@/lib/db/neon";
import type { BusinessCompany, BusinessProject, BusinessVisit } from "@/lib/business/types";
import { newBusinessId } from "@/lib/business/helpers";

const FILE_PATH = path.join(process.cwd(), "data", "business-store.json");

type FileStore = {
  companies: BusinessCompany[];
  projects: BusinessProject[];
  visits: BusinessVisit[];
};

let schemaReady = false;

export async function ensureBusinessTables() {
  if (schemaReady || !isNeonConfigured()) return;
  await ensureSiteTables();
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS business_companies (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS business_projects (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      company_id TEXT,
      status TEXT NOT NULL,
      visibility TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      published_at TIMESTAMPTZ
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS business_visits (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      meta JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS business_visits_project_idx ON business_visits (project_id, created_at)`;
  schemaReady = true;
}

function emptyStore(): FileStore {
  return { companies: [], projects: [], visits: [] };
}

function readFileStore(): FileStore {
  try {
    if (!fs.existsSync(FILE_PATH)) return emptyStore();
    const parsed = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8")) as FileStore;
    return {
      companies: parsed.companies ?? [],
      projects: parsed.projects ?? [],
      visits: parsed.visits ?? [],
    };
  } catch {
    return emptyStore();
  }
}

function writeFileStore(store: FileStore) {
  const dir = path.dirname(FILE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function listCompanies(): Promise<BusinessCompany[]> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = (await getSql()`SELECT data FROM business_companies ORDER BY updated_at DESC`) as { data: BusinessCompany }[];
    return rows.map((row) => row.data);
  }
  return readFileStore().companies.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getCompany(id: string): Promise<BusinessCompany | null> {
  const all = await listCompanies();
  return all.find((item) => item.id === id) ?? null;
}

export async function saveCompany(company: BusinessCompany): Promise<BusinessCompany> {
  await ensureBusinessTables();
  const next = { ...company, updatedAt: new Date().toISOString() };
  if (isNeonConfigured()) {
    await getSql()`
      INSERT INTO business_companies (id, data, created_at, updated_at)
      VALUES (${next.id}, ${JSON.stringify(next)}::jsonb, ${next.createdAt}::timestamptz, NOW())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `;
    return next;
  }
  const store = readFileStore();
  const index = store.companies.findIndex((item) => item.id === next.id);
  if (index >= 0) store.companies[index] = next;
  else store.companies.unshift(next);
  writeFileStore(store);
  return next;
}

export async function deleteCompany(id: string): Promise<boolean> {
  const projects = await listProjects();
  if (projects.some((item) => item.companyId === id)) return false;
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = (await getSql()`DELETE FROM business_companies WHERE id = ${id} RETURNING id`) as { id: string }[];
    return rows.length > 0;
  }
  const store = readFileStore();
  const before = store.companies.length;
  store.companies = store.companies.filter((item) => item.id !== id);
  writeFileStore(store);
  return store.companies.length < before;
}

export async function listProjects(): Promise<BusinessProject[]> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = (await getSql()`SELECT data FROM business_projects ORDER BY updated_at DESC`) as { data: BusinessProject }[];
    return rows.map((row) => row.data);
  }
  return readFileStore().projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string): Promise<BusinessProject | null> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = (await getSql()`SELECT data FROM business_projects WHERE id = ${id} LIMIT 1`) as { data: BusinessProject }[];
    return rows[0]?.data ?? null;
  }
  return readFileStore().projects.find((item) => item.id === id) ?? null;
}

export async function getProjectBySlug(slug: string): Promise<BusinessProject | null> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = (await getSql()`SELECT data FROM business_projects WHERE slug = ${slug} LIMIT 1`) as { data: BusinessProject }[];
    return rows[0]?.data ?? null;
  }
  return readFileStore().projects.find((item) => item.slug === slug) ?? null;
}

export async function slugTaken(slug: string, exceptId?: string): Promise<boolean> {
  const existing = await getProjectBySlug(slug);
  if (!existing) return false;
  return existing.id !== exceptId;
}

export async function saveProject(project: BusinessProject): Promise<BusinessProject> {
  await ensureBusinessTables();
  const next = { ...project, updatedAt: new Date().toISOString() };
  if (isNeonConfigured()) {
    await getSql()`
      INSERT INTO business_projects (id, slug, company_id, status, visibility, data, created_at, updated_at, published_at)
      VALUES (
        ${next.id}, ${next.slug}, ${next.companyId || null}, ${next.status}, ${next.visibility},
        ${JSON.stringify(next)}::jsonb, ${next.createdAt}::timestamptz, NOW(), ${next.publishedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        company_id = EXCLUDED.company_id,
        status = EXCLUDED.status,
        visibility = EXCLUDED.visibility,
        data = EXCLUDED.data,
        updated_at = NOW(),
        published_at = EXCLUDED.published_at
    `;
    return next;
  }
  const store = readFileStore();
  const index = store.projects.findIndex((item) => item.id === next.id);
  if (index >= 0) store.projects[index] = next;
  else store.projects.unshift(next);
  writeFileStore(store);
  return next;
}

export async function deleteProject(id: string): Promise<boolean> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    await getSql()`DELETE FROM business_visits WHERE project_id = ${id}`;
    const rows = (await getSql()`DELETE FROM business_projects WHERE id = ${id} RETURNING id`) as { id: string }[];
    return rows.length > 0;
  }
  const store = readFileStore();
  const before = store.projects.length;
  store.projects = store.projects.filter((item) => item.id !== id);
  store.visits = store.visits.filter((item) => item.projectId !== id);
  writeFileStore(store);
  return store.projects.length < before;
}

export async function addVisit(input: Omit<BusinessVisit, "id" | "createdAt">): Promise<void> {
  const visit: BusinessVisit = {
    id: newBusinessId("vis"),
    createdAt: new Date().toISOString(),
    ...input,
  };
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    await getSql()`
      INSERT INTO business_visits (id, project_id, kind, meta, created_at)
      VALUES (${visit.id}, ${visit.projectId}, ${visit.kind}, ${JSON.stringify(visit.meta)}::jsonb, NOW())
    `;
    return;
  }
  const store = readFileStore();
  store.visits.unshift(visit);
  store.visits = store.visits.slice(0, 4000);
  writeFileStore(store);
}

export async function listVisits(projectId?: string): Promise<BusinessVisit[]> {
  await ensureBusinessTables();
  if (isNeonConfigured()) {
    const rows = projectId
      ? ((await getSql()`SELECT id, project_id, kind, meta, created_at FROM business_visits WHERE project_id = ${projectId} ORDER BY created_at DESC LIMIT 2000`) as { id: string; project_id: string; kind: BusinessVisit["kind"]; meta: Record<string, string>; created_at: string }[])
      : ((await getSql()`SELECT id, project_id, kind, meta, created_at FROM business_visits ORDER BY created_at DESC LIMIT 4000`) as { id: string; project_id: string; kind: BusinessVisit["kind"]; meta: Record<string, string>; created_at: string }[]);
    return rows.map((row) => ({
      id: row.id,
      projectId: row.project_id,
      kind: row.kind,
      meta: row.meta ?? {},
      createdAt: row.created_at,
    }));
  }
  const visits = readFileStore().visits;
  return projectId ? visits.filter((item) => item.projectId === projectId) : visits;
}
