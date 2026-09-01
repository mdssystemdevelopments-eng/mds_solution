import type { PortfolioItem, ServiceItem, SiteContent } from "@/types/site-content";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { LocalePatch } from "@/i18n/patches/types";
import { LOCALE_PATCHES } from "@/i18n/patches";
import { resolveTranslationLocale } from "@/i18n/resolve-locale";
import { deepMerge } from "@/lib/deep-merge";

function mergeByIndex<T extends Record<string, unknown>>(
  base: T[],
  patch: Partial<T>[] | undefined,
): T[] {
  if (!patch?.length) return base;
  return base.map((item, index) => {
    const override = patch[index];
    return override ? ({ ...item, ...override } as T) : item;
  });
}

function applyPatch(base: SiteContent, patch: LocalePatch): SiteContent {
  const { services, portfolio, ui, ...rest } = patch;

  let result = deepMerge(
    base as unknown as Record<string, unknown>,
    rest as Record<string, unknown>,
  ) as SiteContent;

  if (services) {
    const { digital, tech, request, ...serviceRest } = services;
    result = {
      ...result,
      services: {
        ...result.services,
        ...serviceRest,
        request: {
          ...result.services.request,
          ...(request ?? {}),
        },
        digital: mergeByIndex(result.services.digital, digital as Partial<ServiceItem>[]),
        tech: mergeByIndex(result.services.tech, tech as Partial<ServiceItem>[]),
      },
    };
  }

  if (portfolio) {
    result = {
      ...result,
      portfolio: {
        ...result.portfolio,
        ...portfolio,
        items: mergeByIndex(
          result.portfolio.items,
          portfolio.items as Partial<PortfolioItem>[],
        ),
      },
    };
  }

  if (ui) {
    result = {
      ...result,
      ui: deepMerge(
        result.ui as unknown as Record<string, unknown>,
        ui as Record<string, unknown>,
      ) as SiteContent["ui"],
    };
  }

  return result;
}

export function localizeSiteContent(base: SiteContent, locale: Locale): SiteContent {
  if (locale === DEFAULT_LOCALE) return base;

  const translationLocale = resolveTranslationLocale(locale);
  if (translationLocale === DEFAULT_LOCALE) return base;

  const patch = LOCALE_PATCHES[translationLocale as Exclude<Locale, "pt-BR">];
  if (!patch) return base;

  return applyPatch(base, patch);
}
