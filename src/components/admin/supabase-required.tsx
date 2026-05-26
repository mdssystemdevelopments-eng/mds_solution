"use client";

import { useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api-fetch";

export function SupabaseRequired({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/api/admin/auth-mode")
      .then((r) => r.json())
      .then((j: { mode?: string }) => setMode(j.mode ?? "legacy"))
      .catch(() => setMode("legacy"));
  }, []);

  const ready = mode === "supabase";

  if (mode === null) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-ink p-6">
        <div className="h-24 animate-pulse rounded-xl bg-zinc-800/50" />
      </div>
    );
  }

  if (!ready) {
    const neonHint =
      mode === "neon"
        ? "Com Neon ativo, use Conteúdo do site para textos e seções. Posts e produtos via Supabase serão habilitados em atualização futura."
        : "Posts, produtos e mídias exigem Supabase. No modo local, use Conteúdo do site (salva em data/site-content.json).";
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-zinc-100">
        <h2 className="text-lg font-bold text-amber-100">Recurso indisponível neste modo</h2>
        <p className="mt-2 text-sm text-zinc-300">{neonHint}</p>
      </div>
    );
  }

  return <>{children}</>;
}
