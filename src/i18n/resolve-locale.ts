import type { Locale } from "@/i18n/config";
import { DEFAULT_LOCALE, getLocaleMeta } from "@/i18n/config";
import { LOCALE_PATCHES } from "@/i18n/patches";

type TranslatedLocale = Exclude<Locale, "pt-BR">;

function hasPatch(code: Locale): code is TranslatedLocale {
  return code !== DEFAULT_LOCALE && Boolean(LOCALE_PATCHES[code as TranslatedLocale]);
}

/** Idioma efetivo para carregar traduções (considera fallback) */
export function resolveTranslationLocale(locale: Locale): Locale {
  if (locale === DEFAULT_LOCALE) return DEFAULT_LOCALE;
  if (hasPatch(locale)) return locale;

  const fallback = getLocaleMeta(locale).fallback;
  if (fallback && hasPatch(fallback)) return fallback;

  if (LOCALE_PATCHES.en) return "en";
  return DEFAULT_LOCALE;
}
