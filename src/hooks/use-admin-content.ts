"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
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
      if (!res.ok) throw new Error("Falha ao carregar");
      const data = (await res.json()) as SiteContent;
      setContent(data);
      setDirty(false);
    } catch {
      toast.error("Não foi possível carregar o conteúdo.");
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
