"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { AdminPage } from "@/components/admin/admin-page";
import { BusinessNav } from "@/components/admin/business/business-nav";
import { Input } from "@/components/admin/cms/form-fields";
import { mediaSrc } from "@/lib/business/helpers";
import { STATUS_LABELS, VISIBILITY_LABELS, type BusinessStatus } from "@/lib/business/types";

type Row = {
  id: string;
  title: string;
  slug: string;
  cover: string;
  status: BusinessStatus;
  visibility: keyof typeof VISIBILITY_LABELS;
  updatedAt: string;
  views: number;
  companyName: string;
};

const FILTERS: { id: "all" | BusinessStatus; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "draft", label: "Rascunhos" },
  { id: "published", label: "Publicados" },
  { id: "archived", label: "Arquivados" },
];

export function BusinessProjects() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  useEffect(() => {
    apiFetch("/api/admin/business/projects")
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Falha ao carregar projetos.");
        setRows(json.projects ?? []);
      })
      .catch((err: unknown) => {
        toast.error(err instanceof Error ? err.message : "Falha ao carregar projetos.");
        setRows([]);
      });
  }, []);

  const visible = useMemo(() => {
    const list = rows ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!q) return true;
      return [item.title, item.slug, item.companyName].some((value) => value.toLowerCase().includes(q));
    });
  }, [rows, query, filter]);

  return (
    <AdminPage
      title="Projetos"
      description="Apresentacoes, propostas e paginas de cliente."
      actions={
        <Link href="/admin/business/projetos/novo" className="cms-btn cms-btn--primary">
          Novo projeto
        </Link>
      }
    >
      <BusinessNav />
      <div className="biz-toolbar-row">
        <div className="biz-filters">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={filter === item.id ? "is-on" : ""}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="biz-search">
          <Input value={query} onChange={setQuery} placeholder="Buscar por nome, slug ou empresa" />
        </div>
      </div>

      {rows === null ? (
        <p className="biz-muted">Carregando projetos...</p>
      ) : visible.length === 0 ? (
        <div className="biz-empty">
          <p>{rows.length === 0 ? "Nenhum projeto ainda." : "Nenhum projeto neste filtro."}</p>
          <Link href="/admin/business/projetos/novo" className="cms-btn cms-btn--primary">
            Criar projeto
          </Link>
        </div>
      ) : (
        <ul className="biz-list">
          {visible.map((item) => (
            <li key={item.id} className="biz-row">
              <div className="biz-row__cover">{mediaSrc(item.cover) ? <img src={mediaSrc(item.cover)} alt="" /> : <span />}</div>
              <div className="biz-row__body">
                <strong>{item.title}</strong>
                <p>
                  /business/{item.slug} · {item.companyName || "Sem empresa"} · {STATUS_LABELS[item.status]} ·{" "}
                  {VISIBILITY_LABELS[item.visibility]} · {item.views} views
                </p>
              </div>
              <Link href={`/admin/business/projetos/${item.id}`} className="cms-btn cms-btn--ghost">
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  );
}
