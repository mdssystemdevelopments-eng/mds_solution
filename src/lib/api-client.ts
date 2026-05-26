/**
 * Preferência: RENDER_API_URL no servidor + rewrites em next.config.ts (mesmo domínio).
 * Alternativa: NEXT_PUBLIC_API_URL=https://api.mdssolution.com.br (API em subdomínio).
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
