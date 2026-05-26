"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useSiteContent } from "@/components/locale-provider";

export function Navbar() {
  const content = useSiteContent();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ui = content.ui.nav;

  const mainLinks = content.nav.filter((l) => l.href !== "/area-cliente");
  const ctaLink = content.nav.find((l) => l.href === "/area-cliente");

  return (
    <header className="header notranslate" translate="no">
      <div className="wrap header__inner">
        <Link href="/" className="header__brand" aria-label={ui.brandAria}>
          <span className="header__brand-name">
            <span className="header__brand-prefix" aria-hidden>
              {"//"}
            </span>
            <span className="header__brand-main">MDS SOLUÇÕES</span>
            <span className="header__brand-accent">EM TECNOLOGIA</span>
          </span>
        </Link>

        <nav className="header__nav" aria-label="Menu principal">
          <div className="header__nav-pills">
            {mainLinks.map((l) => {
              const active =
                pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`header__link${active ? " header__link--active" : ""}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          {ctaLink && (
            <Link href={ctaLink.href} className="header__cta">
              {ctaLink.label}
            </Link>
          )}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher />
          <button
            type="button"
            className="header__menu-btn"
            aria-expanded={open}
            aria-label={open ? ui.closeMenu : ui.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              {open ? (
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeWidth={2} d="M4 7h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="header__mobile">
          <nav className="wrap header__mobile-nav" aria-label="Menu mobile">
            {content.nav.map((l) => {
              const isCta = l.href === "/area-cliente";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`header__mobile-link${isCta ? " header__mobile-link--cta" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
