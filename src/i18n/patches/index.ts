import type { Locale } from "@/i18n/config";
import { dePatch } from "@/i18n/patches/de";
import { enPatch } from "@/i18n/patches/en";
import { esPatch } from "@/i18n/patches/es";
import { frPatch } from "@/i18n/patches/fr";
import { itPatch } from "@/i18n/patches/it";
import type { LocalePatch } from "@/i18n/patches/types";

export type { LocalePatch } from "@/i18n/patches/types";

export const LOCALE_PATCHES: Partial<Record<Exclude<Locale, "pt-BR">, LocalePatch>> = {
  en: enPatch,
  es: esPatch,
  fr: frPatch,
  de: dePatch,
  it: itPatch,
};
