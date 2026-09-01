"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { defaultSiteContent } from "@/lib/default-site-content";
import { deepMerge } from "@/lib/deep-merge";
import type { SiteContent } from "@/types/site-content";

export function useAdminContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
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
      toast.error(msg);
      setContent(defaultSiteContent);
      setDirty(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function patch(updater: (prev: SiteContent) => SiteContent) {
    setContent((prev) => {
      if (!prev) return prev;
      setDirty(true);
      return updater(prev);
    });
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.hint || "Erro ao salvar");
      toast.success("Alterações salvas!");
      setDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return { content, loading, saving, dirty, load, patch, save, setContent };
}
