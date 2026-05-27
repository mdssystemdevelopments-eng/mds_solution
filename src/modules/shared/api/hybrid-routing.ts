/**
 * Fronteira Next BFF ↔ Express (Render).
 * Preferir rotas relativas `/api/*` (BFF no mesmo domínio via rewrites).
 * Use `resolveApiPath` apenas quando `NEXT_PUBLIC_API_URL` apontar para subdomínio externo.
 */

export { apiUrl as resolveApiPath } from "@/lib/api-client";

/** Rotas que existem no BFF Next (fonte primária em produção Vercel). */
export const NEXT_BFF_ROUTES = {
  contact: "/api/contact",
  adminContent: "/api/admin/content",
  adminPosts: "/api/admin/posts",
  adminProducts: "/api/admin/products",
  adminLogin: "/api/admin/login",
  adminLogout: "/api/admin/logout",
  adminAuthMode: "/api/admin/auth-mode",
} as const;

/** Rotas espelhadas no Express — usadas quando rewrites encaminham para Render. */
export const EXPRESS_MIRROR_ROUTES = {
  contact: "/api/contact",
  adminContent: "/api/admin/content",
  adminLogin: "/api/admin/login",
  adminLogout: "/api/admin/logout",
  adminAuthMode: "/api/admin/auth-mode",
  health: "/health",
} as const;

export function usesExternalApiBase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
}
