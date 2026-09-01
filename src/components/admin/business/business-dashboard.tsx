"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { AdminPage } from "@/components/admin/admin-page";
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
  };
  top: { id: string; title: string; views: number }[];
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
    return <AdminPage title="Business" description="Carregando o painel."><p className="biz-muted">Aguarde.</p></AdminPage>;
  }

  const cards = [
    ["Total de projetos", data.totals.projects],
    ["Publicados", data.totals.published],
    ["Rascunhos", data.totals.drafts],
    ["Privados", data.totals.private],
    ["Empresas", data.totals.companies],
    ["Visualizacoes", data.totals.views],
  ] as const;

  return (
    <AdminPage
      title="Business"
      description="Apresentacoes, propostas e paginas exclusivas para clientes."
      actions={
        <>
          <Link href="/admin/business/empresas" className="cms-btn cms-btn--ghost">
            Empresas
          </Link>
          <Link href="/admin/business/projetos/novo" className="cms-btn cms-btn--primary">
            Novo projeto
          </Link>
        </>
      }
    >
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
          <h2 className="biz-h2">Projetos recentes</h2>
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
                  <div className="biz-row__cover">
                    {item.cover ? <img src={item.cover} alt="" /> : <span />}
                  </div>
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
          <h2 className="biz-h2">Mais acessados</h2>
          {data.top.length === 0 ? (
            <p className="biz-muted">Ainda nao ha visualizacoes.</p>
          ) : (
            <ul className="biz-bars">
              {data.top.map((item) => (
                <li key={item.id}>
                  <span>{item.title}</span>
                  <b>{item.views}</b>
                  <i style={{ width: `${Math.min(100, item.views * 8)}%` }} />
                </li>
              ))}
            </ul>
          )}
          <p className="biz-muted">7 dias: {data.totals.views7d} · 30 dias: {data.totals.views30d}</p>
        </section>
      </div>
    </AdminPage>
  );
}
