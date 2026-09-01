import type { ReactNode } from "react";

/** Mantido por compatibilidade. O editor Neon não depende mais do Supabase. */
export function SupabaseRequired({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
