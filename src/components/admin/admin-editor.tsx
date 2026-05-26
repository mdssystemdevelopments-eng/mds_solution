"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import type { SiteContent } from "@/types/site-content";
import { ADMIN_SECTIONS } from "@/lib/admin-sections";
import { AdminPage } from "@/components/admin/admin-page";

type EditMode = "sections" | "full";

export function AdminEditor({ embedded = false }: { embedded?: boolean }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [fullRaw, setFullRaw] = useState("");
  const [mode, setMode] = useState<EditMode>("sections");
  const [sectionKey, setSectionKey] = useState<keyof SiteContent>("hero");
  const [sectionDraft, setSectionDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving">("idle");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await apiFetch("/api/admin/content");
      if (!res.ok) {
        setMessage({ type: "err", text: "Não foi possível carregar o conteúdo." });
        return;
      }
      const data = (await res.json()) as SiteContent;
      setContent(data);
      setFullRaw(JSON.stringify(data, null, 2));
    } finally {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (content && mode === "sections") {
      setSectionDraft(JSON.stringify(content[sectionKey], null, 2));
    }
  }, [content, sectionKey, mode]);

  function mergeSectionIntoContent(): SiteContent | null {
    if (!content) {
      setMessage({ type: "err", text: "Sem conteúdo carregado." });
      return null;
    }
    try {
      const parsed = JSON.parse(sectionDraft);
      return { ...content, [sectionKey]: parsed };
    } catch {
      setMessage({ type: "err", text: "JSON da seção inválido." });
      return null;
    }
  }

  async function save() {
    setMessage(null);
    let payload: SiteContent;

    if (mode === "full") {
      try {
        payload = JSON.parse(fullRaw) as SiteContent;
      } catch {
        setMessage({ type: "err", text: "JSON inválido." });
        return;
      }
    } else {
      const merged = mergeSectionIntoContent();
      if (!merged) return;
      setContent(merged);
      payload = merged;
    }

    setStatus("saving");
    try {
      const res = await apiFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json.error || json.hint || "Erro ao salvar";
        setMessage({ type: "err", text: msg });
        toast.error(msg);
        return;
      }
      setMessage({ type: "ok", text: "Alterações salvas." });
      toast.success("Alterações salvas.");
      await load();
    } finally {
      setStatus("idle");
    }
  }

  function syncMode(next: EditMode) {
    if (next === mode) return;
    if (mode === "sections" && next === "full") {
      const merged = mergeSectionIntoContent();
      if (!merged) return;
      setContent(merged);
      setFullRaw(JSON.stringify(merged, null, 2));
    }
    if (mode === "full" && next === "sections") {
      try {
        setContent(JSON.parse(fullRaw) as SiteContent);
      } catch {
        setMessage({ type: "err", text: "Corrija o JSON antes de trocar o modo." });
        return;
      }
    }
    setMessage(null);
    setMode(next);
  }

  const currentHint = ADMIN_SECTIONS.find((s) => s.key === sectionKey)?.hint;

  const body = (
    <>
      {message && (
        <p className={`mb-4 rounded-lg px-4 py-3 text-sm ${message.type === "ok" ? "bg-emerald-950/50 text-emerald-200" : "bg-red-950/50 text-red-200"}`}>
          {message.text}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => syncMode("sections")} className={`rounded-lg border px-4 py-2 text-sm ${mode === "sections" ? "border-neon-blue bg-neon-blue/10 text-neon-blue" : "border-zinc-600"}`}>
          Por seções
        </button>
        <button type="button" onClick={() => syncMode("full")} className={`rounded-lg border px-4 py-2 text-sm ${mode === "full" ? "border-neon-blue bg-neon-blue/10 text-neon-blue" : "border-zinc-600"}`}>
          JSON completo
        </button>
        <button type="button" onClick={load} disabled={status === "loading"} className="rounded-lg border border-zinc-600 px-4 py-2 text-sm">
          Recarregar
        </button>
        <button type="button" onClick={save} disabled={status === "saving"} className="rounded-lg bg-neon-blue px-4 py-2 text-sm font-bold text-ink">
          {status === "saving" ? "Salvando…" : "Salvar"}
        </button>
      </div>

      {mode === "sections" && (
        <div className="mb-4">
          <select value={sectionKey} onChange={(e) => setSectionKey(e.target.value as keyof SiteContent)} className="cms-input w-full max-w-md">
            {ADMIN_SECTIONS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          {currentHint && <p className="mt-1 text-xs text-zinc-500">{currentHint}</p>}
        </div>
      )}

      <textarea
        value={mode === "sections" ? sectionDraft : fullRaw}
        onChange={(e) => (mode === "sections" ? setSectionDraft(e.target.value) : setFullRaw(e.target.value))}
        spellCheck={false}
        className="h-[55vh] w-full rounded-xl border border-zinc-700 bg-ink-muted p-4 font-mono text-sm text-zinc-200 outline-none focus:border-neon-blue"
      />
    </>
  );

  if (embedded) {
    return <div className="rounded-2xl border border-zinc-800 bg-ink p-6">{body}</div>;
  }

  return (
    <AdminPage title="Conteúdo (JSON)" description="Modo avançado para edição bruta.">
      {body}
    </AdminPage>
  );
}
