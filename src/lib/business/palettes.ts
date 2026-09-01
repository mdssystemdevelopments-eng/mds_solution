import type { BusinessDesign } from "@/lib/business/types";
import { DEFAULT_DESIGN } from "@/lib/business/types";

export type LookTheme = "dark" | "light";

export type PaletteColors = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  onPrimary: string;
};

export type BusinessPalette = {
  id: string;
  label: string;
  hint: string;
  dark: PaletteColors;
  light: PaletteColors;
};

export const BUSINESS_PALETTES: BusinessPalette[] = [
  {
    id: "mds",
    label: "MDS",
    hint: "Ciano da marca.",
    dark: { primary: "#00d4ff", secondary: "#00a8cc", background: "#030508", text: "#f4f7fa", onPrimary: "#031018" },
    light: { primary: "#0b6b82", secondary: "#0a5366", background: "#F6F4EF", text: "#101010", onPrimary: "#ffffff" },
  },
  {
    id: "grafite",
    label: "Grafite",
    hint: "Neutro, sem cor forte.",
    dark: { primary: "#d8d8d8", secondary: "#9a9a9a", background: "#111214", text: "#f2f2f2", onPrimary: "#111214" },
    light: { primary: "#2a2a2a", secondary: "#5a5a5a", background: "#f6f6f4", text: "#1a1a1a", onPrimary: "#ffffff" },
  },
  {
    id: "ouro",
    label: "Ouro",
    hint: "Proposta e premium.",
    dark: { primary: "#d4b36a", secondary: "#a4843f", background: "#100e0a", text: "#f5efe4", onPrimary: "#1a1408" },
    light: { primary: "#8a6a24", secondary: "#6e541c", background: "#f6f1e6", text: "#2a2418", onPrimary: "#ffffff" },
  },
  {
    id: "oceano",
    label: "Oceano",
    hint: "Azul corporativo.",
    dark: { primary: "#3dd6ff", secondary: "#1a8fb3", background: "#071018", text: "#e8f4f8", onPrimary: "#041018" },
    light: { primary: "#0a6b8a", secondary: "#08556e", background: "#eef6fa", text: "#102028", onPrimary: "#ffffff" },
  },
  {
    id: "floresta",
    label: "Floresta",
    hint: "Verde e calmo.",
    dark: { primary: "#7dd3c7", secondary: "#3d9a8c", background: "#08110f", text: "#e8f4f0", onPrimary: "#08110f" },
    light: { primary: "#1f7a68", secondary: "#165c50", background: "#eef6f3", text: "#12201c", onPrimary: "#ffffff" },
  },
  {
    id: "vinho",
    label: "Vinho",
    hint: "Quente e fechado.",
    dark: { primary: "#e07a8f", secondary: "#a84d5e", background: "#14080c", text: "#f7ecef", onPrimary: "#1a080c" },
    light: { primary: "#9a3048", secondary: "#7a2438", background: "#f8f1f3", text: "#2a1418", onPrimary: "#ffffff" },
  },
  {
    id: "areia",
    label: "Areia",
    hint: "Bege e madeira.",
    dark: { primary: "#e0c8a0", secondary: "#b89a6c", background: "#16130e", text: "#f3ece3", onPrimary: "#1a1510" },
    light: { primary: "#8a6a3a", secondary: "#6a5028", background: "#f6f0e6", text: "#2a241c", onPrimary: "#ffffff" },
  },
  {
    id: "noite",
    label: "Noite",
    hint: "Azul indigo.",
    dark: { primary: "#8ea2ff", secondary: "#5c6fd6", background: "#0a0c18", text: "#edf0ff", onPrimary: "#0a0c18" },
    light: { primary: "#3a4db8", secondary: "#2c3a8a", background: "#f0f2fb", text: "#141628", onPrimary: "#ffffff" },
  },
];

export function getPalette(id?: string): BusinessPalette {
  return BUSINESS_PALETTES.find((item) => item.id === id) ?? BUSINESS_PALETTES[0];
}

export function lookTheme(theme?: string): LookTheme {
  return theme === "light" ? "light" : "dark";
}

export function applyLook(
  current: BusinessDesign,
  next: { theme?: string; palette?: string },
): BusinessDesign {
  const palette = getPalette(next.palette ?? current.palette);
  const theme = lookTheme(next.theme ?? current.theme);
  const colors = palette[theme];
  return {
    ...current,
    ...colors,
    theme,
    palette: palette.id,
    whatsapp: current.whatsapp || "",
    coverColor: current.coverColor || current.background || "",
  };
}

export function designFromLook(theme: LookTheme, paletteId: string): BusinessDesign {
  const d = applyLook(DEFAULT_DESIGN, { theme, palette: paletteId });
  return { ...d, coverColor: d.background };
}
