"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";

type FileItem = { name: string; url: string };

export function MediaLibrary() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await apiFetch("/api/admin/upload");
    const json = (await res.json()) as { files?: FileItem[]; error?: string };
    if (!res.ok) {
      toast.error(json.error || "Não foi possível listar as mídias.");
      return;
    }
    setFiles(json.files ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload(file: File) {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiFetch("/api/admin/upload", { method: "POST", body: form });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(json.error || "Falha no upload");
        return;
      }
      toast.success("Arquivo enviado.");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(name: string) {
    if (!window.confirm(`Excluir ${name}?`)) return;
    const res = await apiFetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      toast.error("Não foi possível excluir.");
      return;
    }
    await load();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("Caminho copiado.");
  }

  return (
    <div className="media-lib">
      <header className="media-lib__head">
        <div>
          <h1>Mídias</h1>
          <p>Envie imagens reais. Depois use o caminho no Editor do site ou cole no campo da seção.</p>
        </div>
        <label className="cms-btn cms-btn--primary media-lib__upload">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/svg+xml"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void upload(file);
            }}
          />
          {busy ? "Enviando…" : "Enviar imagem"}
        </label>
      </header>

      {files.length === 0 ? (
        <p className="media-lib__empty">Nenhuma imagem enviada ainda.</p>
      ) : (
        <ul className="media-lib__grid">
          {files.map((file) => (
            <li key={file.name} className="media-lib__card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.url} alt="" />
              <code>{file.url}</code>
              <div className="media-lib__actions">
                <button type="button" className="cms-btn cms-btn--ghost" onClick={() => void copy(file.url)}>
                  Copiar caminho
                </button>
                <button type="button" className="cms-btn cms-btn--ghost" onClick={() => void remove(file.name)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
