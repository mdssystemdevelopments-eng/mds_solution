"use client";

import { useState } from "react";
import { toast } from "sonner";
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
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
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
    <Field label={label} hint={hint ?? "JPG, PNG, GIF, WEBP, AVIF ou SVG. Até 8 MB."}>
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
