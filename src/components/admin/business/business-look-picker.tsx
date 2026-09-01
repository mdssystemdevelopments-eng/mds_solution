"use client";

import { BUSINESS_PALETTES, lookTheme, type LookTheme } from "@/lib/business/palettes";

function toColorInput(value: string): string {
  const v = (value || "").trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return "#111111";
}

export function BusinessLookPicker({
  theme,
  palette,
  coverColor,
  onChange,
  onCoverColor,
  compact = false,
}: {
  theme: string;
  palette: string;
  coverColor?: string;
  onChange: (next: { theme: LookTheme; palette: string }) => void;
  onCoverColor?: (value: string) => void;
  compact?: boolean;
}) {
  const currentTheme = lookTheme(theme);
  const currentPalette = palette || "mds";

  return (
    <div className={`biz-look${compact ? " biz-look--bar" : ""}`}>
      <div className="biz-look__themes">
        <button
          type="button"
          className={currentTheme === "light" ? "is-on" : ""}
          onClick={() => onChange({ theme: "light", palette: currentPalette })}
        >
          <span className="biz-look__swatch biz-look__swatch--light" />
          Claro
        </button>
        <button
          type="button"
          className={currentTheme === "dark" ? "is-on" : ""}
          onClick={() => onChange({ theme: "dark", palette: currentPalette })}
        >
          <span className="biz-look__swatch biz-look__swatch--dark" />
          Escuro
        </button>
      </div>

      <div className="biz-palettes">
        {BUSINESS_PALETTES.map((item) => {
          const colors = item[currentTheme];
          return (
            <button
              key={item.id}
              type="button"
              className={`biz-palette${currentPalette === item.id ? " is-on" : ""}`}
              onClick={() => onChange({ theme: currentTheme, palette: item.id })}
              title={item.label}
            >
              <span
                className="biz-palette__preview"
                style={{
                  background: `linear-gradient(135deg, ${colors.background} 0 42%, ${colors.primary} 42% 72%, ${colors.text} 72% 100%)`,
                }}
              />
              <strong>{item.label}</strong>
            </button>
          );
        })}
      </div>

      {onCoverColor ? (
        <label className="biz-look__cover">
          <span>Capa</span>
          <input
            type="color"
            value={toColorInput(coverColor || "")}
            onChange={(e) => onCoverColor(e.target.value)}
          />
        </label>
      ) : null}
    </div>
  );
}
