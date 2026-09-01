"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { defaultSiteContent } from "@/lib/default-site-content";
import { deepMerge } from "@/lib/deep-merge";
import type { SiteContent } from "@/types/site-content";

export function useAdminContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/admin/content");
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || json.hint || `Falha ao carregar (${res.status})`);
      }
      const merged = deepMerge(
        defaultSiteContent as unknown as Record<string, unknown>,
        json as Record<string, unknown>,
      ) as SiteContent;
      setContent(merged);
      setDirty(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Não foi possível carregar o conteúdo.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(updater: (prev: SiteContent) => SiteContent) {
    setContent((prev) => {
      setDirty(true);
      return updater(prev);
    });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.hint || "Erro ao salvar");
      setError("");
      toast.success("Alterações salvas. Atualize o site para ver o resultado.");
      setDirty(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return { content, loading, saving, dirty, error, load, patch, save, setContent };
}
