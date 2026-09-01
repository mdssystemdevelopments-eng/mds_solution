"use client";

import { BUSINESS_PALETTES, lookTheme, type LookTheme } from "@/lib/business/palettes";

export function BusinessLookPicker({
  theme,
  palette,
  onChange,
}: {
  theme: string;
  palette: string;
  onChange: (next: { theme: LookTheme; palette: string }) => void;
}) {
  const currentTheme = lookTheme(theme);
  const currentPalette = palette || "mds";

  return (
    <div className="biz-look">
      <p className="biz-look__label">Tema</p>
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

      <p className="biz-look__label">Paleta deste projeto</p>
      <div className="biz-palettes">
        {BUSINESS_PALETTES.map((item) => {
          const colors = item[currentTheme];
          return (
            <button
              key={item.id}
              type="button"
              className={`biz-palette${currentPalette === item.id ? " is-on" : ""}`}
              onClick={() => onChange({ theme: currentTheme, palette: item.id })}
            >
              <span className="biz-palette__dots" aria-hidden="true">
                <i style={{ background: colors.background }} />
                <i style={{ background: colors.primary }} />
                <i style={{ background: colors.text }} />
              </span>
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
