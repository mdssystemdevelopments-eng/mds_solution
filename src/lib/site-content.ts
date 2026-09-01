import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import fs from "fs";
import path from "path";
import { localizeSiteContent } from "@/i18n/apply-locale";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getRequestLocale } from "@/i18n/get-locale";
import { deepMerge } from "@/lib/deep-merge";
import { defaultSiteContent } from "@/lib/default-site-content";
import { isNeonConfigured, getSql, ensureSiteTables } from "@/lib/db/neon";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClientOptional } from "@/lib/supabase/server";
import type { SiteContent } from "@/types/site-content";

const DATA_PATH = path.join(process.cwd(), "data", "site-content.json");

function readBaseContentFromFile(): SiteContent | null {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return deepMerge(
        defaultSiteContent as unknown as Record<string, unknown>,
        parsed,
      ) as SiteContent;
    }
  } catch (e) {
    console.error("[site-content] Erro ao ler data/site-content.json:", e);
  }
  return null;
}

async function readBaseContentFromNeon(): Promise<SiteContent | null> {
  try {
    await ensureSiteTables();
    const sql = getSql();
    const rows = await sql`SELECT content FROM site_content WHERE locale = ${DEFAULT_LOCALE} LIMIT 1`;
    const row = rows[0] as { content?: unknown } | undefined;
    if (!row?.content || typeof row.content !== "object") return null;
    return deepMerge(
      defaultSiteContent as unknown as Record<string, unknown>,
      row.content as Record<string, unknown>,
    ) as SiteContent;
  } catch (e) {
    console.error("[site-content] Erro ao ler Neon:", e);
    return null;
  }
}

async function readBaseContentFromDb(): Promise<SiteContent | null> {
  noStore();
  if (isNeonConfigured()) {
    const neon = await readBaseContentFromNeon();
    if (neon) return neon;
  }
  if (!isSupabaseConfigured()) return readBaseContentFromFile();

  try {
    const supabase = await createSupabaseServerClientOptional();
    if (!supabase) return readBaseContentFromFile();
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("locale", DEFAULT_LOCALE)
      .maybeSingle();
    if (error) {
      console.error("[site-content] Erro ao ler site_content:", error);
      return null;
    }
    if (!data?.content || typeof data.content !== "object") return null;
    return deepMerge(
      defaultSiteContent as unknown as Record<string, unknown>,
      data.content as Record<string, unknown>,
    ) as SiteContent;
  } catch (e) {
    console.error("[site-content] Falha ao ler Supabase:", e);
    return readBaseContentFromFile();
  }
}

export const getSiteContentForLocale = cache(async (locale: Locale): Promise<SiteContent> => {
  const base = (await readBaseContentFromDb()) ?? defaultSiteContent;
  return localizeSiteContent(base, locale);
});

/** Conteúdo padrão pt-BR (admin, APIs) */
export const getSiteContent = cache(async (): Promise<SiteContent> => getSiteContentForLocale(DEFAULT_LOCALE));

/** Conteúdo do site conforme cookie de idioma */
export async function getSiteContentAsync(): Promise<SiteContent> {
  const locale = await getRequestLocale();
  return getSiteContentForLocale(locale);
}

export async function writeSiteContent(
  content: SiteContent,
  updatedBy?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (isNeonConfigured()) {
    try {
      await ensureSiteTables();
      const sql = getSql();
      await sql`
        INSERT INTO site_content (locale, content, updated_by, updated_at)
        VALUES (${DEFAULT_LOCALE}, ${JSON.stringify(content)}::jsonb, ${updatedBy ?? null}, NOW())
        ON CONFLICT (locale) DO UPDATE SET
          content = EXCLUDED.content,
          updated_by = EXCLUDED.updated_by,
          updated_at = NOW()
      `;
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao gravar no Neon.";
      return { ok: false, error: msg };
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClientOptional();
      if (supabase) {
        const { error } = await supabase.from("site_content").upsert({
          locale: DEFAULT_LOCALE,
          content,
          updated_by: updatedBy ?? null,
          updated_at: new Date().toISOString(),
        });
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao gravar no Supabase.";
      return { ok: false, error: msg };
    }
  }

  try {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(content, null, 2), "utf-8");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Falha ao gravar arquivo.";
    return { ok: false, error: msg };
  }
}

export function isSiteContent(obj: unknown): obj is SiteContent {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  const seo = o.seo as Record<string, unknown> | undefined;
  const contact = o.contact as Record<string, unknown> | undefined;
  const hero = o.hero as Record<string, unknown> | undefined;
  const services = o.services as Record<string, unknown> | undefined;
  const about = o.about as Record<string, unknown> | undefined;
  const ui = o.ui as Record<string, unknown> | undefined;
  return (
    typeof seo?.siteTitle === "string" &&
    typeof seo?.siteDescription === "string" &&
    typeof contact?.whatsappNumber === "string" &&
    typeof contact?.email === "string" &&
    Array.isArray(o.nav) &&
    typeof hero?.headlineBefore === "string" &&
    Array.isArray(services?.digital) &&
    Array.isArray(services?.tech) &&
    Array.isArray(about?.paragraphs) &&
    typeof ui?.skipToContent === "string"
  );
}
