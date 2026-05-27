"use client";

import { useEffect, useRef, useState } from "react";
import { FlagIcon } from "@/components/flag-icon";
import { LOCALES, type Locale } from "@/i18n/config";
import { useLocaleContext } from "@/components/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale, content } = useLocaleContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const ui = content.ui.nav;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function pick(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div className="lang-switch" ref={rootRef}>
      <button
        type="button"
        className="lang-switch__btn"
        aria-label={ui.languageLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="lang-switch__flag" aria-hidden>
          <FlagIcon iso={current.flagIso} emoji={current.flag} label={current.label} />
        </span>
      </button>

      {open && (
        <ul className="lang-switch__menu" role="listbox" aria-label={ui.chooseLanguage}>
          {LOCALES.map((item) => {
            const active = item.code === locale;
            return (
              <li key={item.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`lang-switch__option${active ? " lang-switch__option--active" : ""}`}
                  onClick={() => pick(item.code)}
                >
                  <span className="lang-switch__flag" aria-hidden>
                    <FlagIcon iso={item.flagIso} emoji={item.flag} label={item.label} size={20} />
                  </span>
                  <span className="lang-switch__label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
