"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { AdminPage } from "@/components/admin/admin-page";
import { BusinessNav } from "@/components/admin/business/business-nav";
import { ImageField } from "@/components/admin/cms/image-field";
import { Field, Input, Textarea } from "@/components/admin/cms/form-fields";
import type { BusinessCompany } from "@/lib/business/types";

const empty: Omit<BusinessCompany, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  tradeName: "",
  logo: "",
  description: "",
  site: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  instagram: "",
  linkedin: "",
  notes: "",
};

export function BusinessCompanies() {
  const [companies, setCompanies] = useState<BusinessCompany[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [extra, setExtra] = useState(false);

  async function load() {
    const res = await apiFetch("/api/admin/business/companies");
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Falha ao carregar empresas.");
    setCompanies(json.companies ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  function set<K extends keyof typeof empty>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Informe o nome da empresa.");
    setSaving(true);
    try {
      const res = await apiFetch("/api/admin/business/companies", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing, ...form } : form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao salvar");
      toast.success("Empresa salva.");
      setForm(empty);
      setEditing(null);
      setExtra(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir esta empresa?")) return;
    const res = await apiFetch("/api/admin/business/companies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Nao foi possivel excluir.");
    toast.success("Empresa removida.");
    await load();
  }

  return (
    <AdminPage
      title="Empresas"
      description="Cadastre clientes para vincular aos projetos Business."
    >
      <BusinessNav />
      <div className="biz-grid">
        <div className="biz-form">
          <h2 className="biz-h2">{editing ? "Editar empresa" : "Nova empresa"}</h2>
          <Field label="Nome">
            <Input value={form.name} onChange={(v) => set("name", v)} />
          </Field>
          <Field label="Nome fantasia">
            <Input value={form.tradeName} onChange={(v) => set("tradeName", v)} />
          </Field>
          <ImageField label="Logo" value={form.logo} onChange={(v) => set("logo", v)} />
          <Field label="WhatsApp">
            <Input value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
          </Field>
          <Field label="E-mail">
            <Input value={form.email} onChange={(v) => set("email", v)} />
          </Field>
          {extra ? (
            <>
              <Field label="Descricao">
                <Textarea value={form.description} onChange={(v) => set("description", v)} rows={3} />
              </Field>
              <Field label="Site">
                <Input value={form.site} onChange={(v) => set("site", v)} />
              </Field>
              <Field label="Telefone">
                <Input value={form.phone} onChange={(v) => set("phone", v)} />
              </Field>
              <Field label="Endereco">
                <Input value={form.address} onChange={(v) => set("address", v)} />
              </Field>
              <Field label="Instagram">
                <Input value={form.instagram} onChange={(v) => set("instagram", v)} />
              </Field>
              <Field label="LinkedIn">
                <Input value={form.linkedin} onChange={(v) => set("linkedin", v)} />
              </Field>
              <Field label="Observacoes">
                <Textarea value={form.notes} onChange={(v) => set("notes", v)} rows={3} />
              </Field>
            </>
          ) : (
            <button type="button" className="cms-btn cms-btn--ghost" onClick={() => setExtra(true)}>
              Mais campos
            </button>
          )}
          <div className="biz-actions">
            <button type="button" className="cms-btn cms-btn--primary" disabled={saving} onClick={() => void save()}>
              {saving ? "Salvando..." : "Salvar empresa"}
            </button>
            {editing ? (
              <button
                type="button"
                className="cms-btn cms-btn--ghost"
                onClick={() => {
                  setEditing(null);
                  setForm(empty);
                  setExtra(false);
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </div>
        <div>
          <h2 className="biz-h2">Cadastradas</h2>
          {companies.length === 0 ? (
            <div className="biz-empty">
              <p>Nenhuma empresa cadastrada.</p>
            </div>
          ) : (
            <ul className="biz-list">
              {companies.map((item) => (
                <li key={item.id} className="biz-row">
                  <div className="biz-row__cover">{item.logo ? <img src={item.logo} alt="" /> : <span />}</div>
                  <div className="biz-row__body">
                    <strong>{item.name}</strong>
                    <p>{item.tradeName || item.email || "Sem contato"}</p>
                  </div>
                  <button
                    type="button"
                    className="cms-btn cms-btn--ghost"
                    onClick={() => {
                      setEditing(item.id);
                      setForm(item);
                      setExtra(true);
                    }}
                  >
                    Editar
                  </button>
                  <button type="button" className="cms-btn cms-btn--ghost" onClick={() => void remove(item.id)}>
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
