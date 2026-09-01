export const DEFAULT_ADMIN_HOST = "adminplus.mdssolution.com.br";

export const ADMIN_PAGE_PREFIXES = [
  "/admin",
  "/loginsolution",
  "/login",
  "/cms",
  "/painel",
  "/~login",
] as const;

export function getAdminHost(): string {
  return (process.env.ADMIN_HOST || process.env.NEXT_PUBLIC_ADMIN_HOST || DEFAULT_ADMIN_HOST)
    .trim()
    .toLowerCase();
}

export function normalizeHost(hostHeader: string | null | undefined): string {
  return (hostHeader ?? "").split(":")[0].trim().toLowerCase();
}

export function isLocalAdminHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

export function isAllowedAdminHost(hostHeader: string | null | undefined): boolean {
  const host = normalizeHost(hostHeader);
  if (!host) return false;
  if (isLocalAdminHost(host)) return true;
  return host === getAdminHost();
}

export function isAdminSurfacePath(pathname: string): boolean {
  return (
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/") ||
    ADMIN_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}
