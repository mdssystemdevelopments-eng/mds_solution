export const PAGE_CTA = "#conversar";
export const MDS_WHATSAPP = "5517996604289";

export function phoneDigits(value: string): string {
  return String(value ?? "").replace(/\D/g, "");
}

export function isPageCta(href?: string): boolean {
  const value = String(href ?? "").trim();
  if (!value || value === "#" || value === PAGE_CTA) return true;
  if (value.startsWith("#conversar")) return true;
  const path = value.startsWith("http")
    ? (() => {
        try {
          return new URL(value).pathname;
        } catch {
          return value;
        }
      })()
    : value.split("?")[0];
  return path === "/contato" || path.startsWith("/contato/") || ["/", "/sobre", "/servicos", "/portfolio", "/area-cliente"].includes(path);
}

export function projectWhatsapp(projectWhatsapp?: string, companyWhatsapp?: string): string {
  return phoneDigits(projectWhatsapp || "") || phoneDigits(companyWhatsapp || "") || MDS_WHATSAPP;
}
