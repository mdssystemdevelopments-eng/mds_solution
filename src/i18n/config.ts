export const LOCALE_COOKIE = "mds-locale";
export const DEFAULT_LOCALE = "pt-BR" as const;

export type Locale =
  | "pt-BR"
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "zh"
  | "ja"
  | "ko"
  | "ar"
  | "ru"
  | "hi"
  | "nl"
  | "pl"
  | "tr";

export type LocaleMeta = {
  code: Locale;
  label: string;
  flag: string;
  dir: "ltr" | "rtl";
  /** Idioma usado quando não há tradução dedicada */
  fallback?: Locale;
};

export const LOCALES: LocaleMeta[] = [
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷", dir: "ltr" },
  { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "it", label: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "zh", label: "中文", flag: "🇨🇳", dir: "ltr", fallback: "en" },
  { code: "ja", label: "日本語", flag: "🇯🇵", dir: "ltr", fallback: "en" },
  { code: "ko", label: "한국어", flag: "🇰🇷", dir: "ltr", fallback: "en" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl", fallback: "en" },
  { code: "ru", label: "Русский", flag: "🇷🇺", dir: "ltr", fallback: "en" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", dir: "ltr", fallback: "en" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", dir: "ltr", fallback: "en" },
  { code: "pl", label: "Polski", flag: "🇵🇱", dir: "ltr", fallback: "en" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr", fallback: "en" },
];

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.some((l) => l.code === value);
}

export function parseLocale(value: string | undefined | null): Locale {
  if (isLocale(value)) return value;
  return DEFAULT_LOCALE;
}

export function getLocaleMeta(code: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function localeToHtmlLang(code: Locale): string {
  return code;
}
