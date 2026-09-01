"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { AdminPage } from "@/components/admin/admin-page";
import { BusinessNav } from "@/components/admin/business/business-nav";
import { mediaSrc } from "@/lib/business/helpers";
import { STATUS_LABELS, VISIBILITY_LABELS } from "@/lib/business/types";

type Dash = {
  totals: {
    projects: number;
    published: number;
    drafts: number;
    private: number;
    companies: number;
    views: number;
    views7d: number;
    views30d: number;
    leads: number;
  };
  top: { id: string; title: string; views: number }[];
  leads: { id: string; projectId: string; title: string; name: string; phone: string; message: string; createdAt: string }[];
  recent: {
    id: string;
    title: string;
    cover: string;
    status: keyof typeof STATUS_LABELS;
    visibility: keyof typeof VISIBILITY_LABELS;
    updatedAt: string;
    views: number;
    companyName: string;
  }[];
};

export function BusinessDashboard() {
  const [data, setData] = useState<Dash | null>(null);

  async function load() {
    const res = await apiFetch("/api/admin/business/dashboard");
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(json.error || "Nao foi possivel carregar o Business.");
      return;
    }
    setData(json as Dash);
  }

  useEffect(() => {
    void load();
  }, []);

  if (!data) {
    return (
      <AdminPage title="Business" description="Carregando o painel.">
        <BusinessNav />
        <p className="biz-muted">Aguarde.</p>
      </AdminPage>
    );
  }

  const cards = [
    ["Projetos", data.totals.projects],
    ["Publicados", data.totals.published],
    ["Rascunhos", data.totals.drafts],
    ["Empresas", data.totals.companies],
    ["Pedidos", data.totals.leads],
    ["Views", data.totals.views],
    ["7 dias", data.totals.views7d],
  ] as const;

  return (
    <AdminPage
      title="Business"
      description="Apresentacoes, propostas e paginas exclusivas para clientes."
      actions={
        <Link href="/admin/business/projetos/novo" className="cms-btn cms-btn--primary">
          Novo projeto
        </Link>
      }
    >
      <BusinessNav />
      <div className="biz-stats">
        {cards.map(([label, value]) => (
          <div key={label} className="biz-stat">
            <span className="biz-stat__value">{value}</span>
            <span className="biz-stat__label">{label}</span>
          </div>
        ))}
      </div>

      <div className="biz-split">
        <section>
          <div className="biz-section-head">
            <h2 className="biz-h2">Projetos recentes</h2>
            <Link href="/admin/business/projetos" className="biz-link">
              Ver todos
            </Link>
          </div>
          {data.recent.length === 0 ? (
            <div className="biz-empty">
              <p>Voce ainda nao possui projetos Business.</p>
              <Link href="/admin/business/projetos/novo" className="cms-btn cms-btn--primary">
                Criar primeiro projeto
              </Link>
            </div>
          ) : (
            <ul className="biz-list">
              {data.recent.map((item) => (
                <li key={item.id} className="biz-row">
                  <div className="biz-row__cover">{mediaSrc(item.cover) ? <img src={mediaSrc(item.cover)} alt="" /> : <span />}</div>
                  <div className="biz-row__body">
                    <strong>{item.title}</strong>
                    <p>
                      {item.companyName || "Sem empresa"} · {STATUS_LABELS[item.status]} · {VISIBILITY_LABELS[item.visibility]} · {item.views} views
                    </p>
                  </div>
                  <Link href={`/admin/business/projetos/${item.id}`} className="cms-btn cms-btn--ghost">
                    Editar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="biz-h2">Pedidos</h2>
          {data.leads.length === 0 ? (
            <p className="biz-muted">Quando o cliente pedir contato, o recado aparece aqui.</p>
          ) : (
            <ul className="biz-list">
              {data.leads.map((item) => (
                <li key={item.id} className="biz-row">
                  <div className="biz-row__body">
                    <strong>{item.name}</strong>
                    <p>
                      {item.title} · {item.phone} · {new Date(item.createdAt).toLocaleString("pt-BR")}
                    </p>
                    {item.message ? <p>{item.message}</p> : null}
                  </div>
                  <Link href={`/admin/business/projetos/${item.projectId}`} className="cms-btn cms-btn--ghost">
                    Ver
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminPage>
  );
}
