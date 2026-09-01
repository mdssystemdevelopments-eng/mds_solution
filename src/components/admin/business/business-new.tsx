"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { AdminPage } from "@/components/admin/admin-page";
import { ImageField } from "@/components/admin/cms/image-field";
import { Field, Input, Textarea } from "@/components/admin/cms/form-fields";
import {
  BUSINESS_TEMPLATES,
  BUSINESS_TYPES,
  TEMPLATE_LABELS,
  TYPE_LABELS,
  type BusinessCompany,
  type BusinessTemplate,
  type BusinessType,
} from "@/lib/business/types";

export function BusinessNewProject() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState<BusinessCompany[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    companyId: "",
    description: "",
    slug: "",
    cover: "",
    type: "apresentacao-comercial" as BusinessType,
    template: "moderno" as BusinessTemplate,
    password: "",
  });

  useEffect(() => {
    apiFetch("/api/admin/business/companies")
      .then((r) => r.json())
      .then((j) => setCompanies(j.companies ?? []))
      .catch(() => setCompanies([]));
  }, []);

  async function create() {
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/business/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao criar");
      toast.success("Projeto criado.");
      router.push(`/admin/business/projetos/${json.project.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao criar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPage
      title="Novo projeto"
      description={`Etapa ${step} de 3`}
      actions={<Link href="/admin/business" className="cms-btn cms-btn--ghost">Voltar</Link>}
    >
      {step === 1 ? (
        <div className="biz-form">
          <Field label="Nome do projeto"><Input value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} /></Field>
          <Field label="Empresa">
            <select className="cms-input" value={form.companyId} onChange={(e) => setForm((p) => ({ ...p, companyId: e.target.value }))}>
              <option value="">Sem empresa</option>
              {companies.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Descricao"><Textarea value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} rows={3} /></Field>
          <Field label="Slug" hint="Deixe em branco para gerar automaticamente.">
            <Input value={form.slug} onChange={(v) => setForm((p) => ({ ...p, slug: v }))} placeholder="empresa-xyz" />
          </Field>
          <ImageField label="Imagem de capa" value={form.cover} onChange={(v) => setForm((p) => ({ ...p, cover: v }))} />
          <button type="button" className="cms-btn cms-btn--primary" disabled={!form.title.trim()} onClick={() => setStep(2)}>
            Continuar
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="biz-choices">
          {BUSINESS_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`biz-choice${form.type === type ? " is-on" : ""}`}
              onClick={() => setForm((p) => ({ ...p, type }))}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
          <div className="biz-actions">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={() => setStep(1)}>Voltar</button>
            <button type="button" className="cms-btn cms-btn--primary" onClick={() => setStep(3)}>Continuar</button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="biz-choices">
          {BUSINESS_TEMPLATES.map((template) => (
            <button
              key={template}
              type="button"
              className={`biz-choice${form.template === template ? " is-on" : ""}`}
              onClick={() => setForm((p) => ({ ...p, template }))}
            >
              {TEMPLATE_LABELS[template]}
            </button>
          ))}
          <Field label="Senha (opcional, deixa o projeto privado)">
            <Input type="password" value={form.password} onChange={(v) => setForm((p) => ({ ...p, password: v }))} />
          </Field>
          <div className="biz-actions">
            <button type="button" className="cms-btn cms-btn--ghost" onClick={() => setStep(2)}>Voltar</button>
            <button type="button" className="cms-btn cms-btn--primary" disabled={saving} onClick={() => void create()}>
              {saving ? "Criando..." : "Criar projeto"}
            </button>
          </div>
        </div>
      ) : null}
    </AdminPage>
  );
}
