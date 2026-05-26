import { apiUrl } from "@/lib/api-client";

/** Fetch para API (local, Vercel rewrite ou Render externo). */
export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
  });
}
