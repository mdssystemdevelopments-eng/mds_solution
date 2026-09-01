"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LOCALE_COOKIE,
  getLocaleMeta,
  localeToHtmlLang,
  type Locale,
} from "@/i18n/config";
import type { SiteContent } from "@/types/site-content";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LocaleContextValue = {
  locale: Locale;
  content: SiteContent;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  content,
  children,
}: {
  locale: Locale;
  content: SiteContent;
  children: ReactNode;
}) {
  const router = useRouter();
  const meta = getLocaleMeta(locale);

  useEffect(() => {
    document.documentElement.lang = localeToHtmlLang(locale);
    document.documentElement.dir = meta.dir;
  }, [locale, meta.dir]);

  // Realtime: sempre que o admin salva, o site se atualiza automaticamente.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const channel = supabase
      .channel("realtime:site_content")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content" },
        () => router.refresh(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  function setLocale(next: Locale) {
    if (next === locale) return;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(next)};path=/;max-age=${maxAge};SameSite=Lax`;
    router.refresh();
  }

  return (
    <LocaleContext.Provider value={{ locale, content, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return ctx;
}

export function useSiteContent(): SiteContent {
  return useLocaleContext().content;
}

export function useOptionalSiteContent(): SiteContent | null {
  return useContext(LocaleContext)?.content ?? null;
}
