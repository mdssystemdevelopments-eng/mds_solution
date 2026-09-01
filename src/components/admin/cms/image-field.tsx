"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { Field, Input } from "@/components/admin/cms/form-fields";

export function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await apiFetch("/api/admin/upload", { method: "POST", body: form });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        toast.error(json.error || "Falha no upload");
        return;
      }
      onChange(json.url);
      toast.success("Imagem enviada. Salve o conteúdo para aplicar no site.");
    } catch {
      toast.error("Falha no upload");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label} hint={hint ?? "JPG, PNG, GIF, WEBP, AVIF ou SVG. Até 3,5 MB."}>
      <div className="cms-image-field">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="cms-image-field__preview" />
        ) : (
          <div className="cms-image-field__empty">Sem imagem</div>
        )}
        <Input value={value} onChange={onChange} placeholder="/uploads/arquivo.jpg" />
        <label className="cms-image-field__pick">
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
          {busy ? "Enviando…" : "Enviar arquivo"}
        </label>
      </div>
    </Field>
  );
}

export function GalleryField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");

  async function uploadMany(files: File[]) {
    if (!files.length) return;
    setBusy(true);
    const added: string[] = [];
    try {
      for (let i = 0; i < files.length; i += 1) {
        setProgress(`Enviando ${i + 1}/${files.length}…`);
        const form = new FormData();
        form.append("file", files[i]);
        const res = await apiFetch("/api/admin/upload", { method: "POST", body: form });
        const json = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !json.url) {
          toast.error(json.error || `Falha no arquivo ${files[i].name}`);
          continue;
        }
        added.push(json.url);
      }
      if (added.length) {
        onChange([...values, ...added]);
        toast.success(
          added.length === 1 ? "Imagem adicionada. Salve o conteúdo." : `${added.length} imagens adicionadas. Salve o conteúdo.`,
        );
      }
    } catch {
      toast.error("Falha no envio das imagens.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="cms-field">
      <span className="cms-field__label">{label}</span>
      <span className="cms-field__hint">
        Selecione várias fotos de uma vez. Elas abrem ao clicar na capa do projeto no site.
      </span>
      <div className="cms-gallery">
        {values.length > 0 ? (
          <ul className="cms-gallery__list">
            {values.map((url, i) => (
              <li key={`${url}-${i}`} className="cms-gallery__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
                <button type="button" className="cms-gallery__remove" onClick={() => removeAt(i)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cms-gallery__empty">Nenhuma foto extra ainda.</p>
        )}
        <label className="cms-image-field__pick">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/svg+xml"
            multiple
            disabled={busy}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              void uploadMany(files);
            }}
          />
          {busy ? progress || "Enviando…" : "Adicionar fotos"}
        </label>
      </div>
    </div>
  );
}
