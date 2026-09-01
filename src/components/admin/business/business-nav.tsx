"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin/business", label: "Painel", exact: true },
  { href: "/admin/business/projetos", label: "Projetos", match: "/admin/business/projetos" },
  { href: "/admin/business/empresas", label: "Empresas", match: "/admin/business/empresas" },
] as const;

export function BusinessNav() {
  const pathname = usePathname();

  return (
    <nav className="biz-nav" aria-label="Business">
      {ITEMS.map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} className={active ? "is-on" : ""}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
