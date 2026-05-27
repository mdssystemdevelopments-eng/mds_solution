"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ProductPayload, ProductRow } from "@/modules/admin/products/types";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "@/modules/admin/products/services/products-api";
import { AdminListToolbar } from "@/modules/admin/ui/admin-list-toolbar";
import { slugify } from "@/modules/shared/utils/slugify";

function moneyFromCents(cents: number | null, currency: string) {
  if (cents == null) return "—";
  const value = cents / 100;
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function ProductsAdmin() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s));
  }, [items, q]);

  async function load() {
    setLoading(true);
    try {
      setItems(await listProducts());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function resetForm() {
    setEditing(null);
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setActive(true);
  }

  function startCreate() {
    resetForm();
    setOpen(true);
  }

  function startEdit(p: ProductRow) {
    setEditing(p);
    setName(p.name);
    setSlug(p.slug);
    setDescription("");
    setPrice(p.price_cents != null ? String(p.price_cents / 100) : "");
    setActive(p.active);
    setOpen(true);
  }

  async function save() {
    const s = slug.trim() || slugify(name, { maxLength: 140 });
    if (!name.trim()) return toast.error("Nome é obrigatório");
    if (!s) return toast.error("Slug inválido");
    const hasPrice = Boolean(price.trim());
    const priceNumber = hasPrice ? Math.round(Number(price.replace(",", ".")) * 100) : null;
    if (hasPrice) {
      const n = Number(price.replace(",", "."));
      if (!Number.isFinite(n) || priceNumber == null || priceNumber < 0) return toast.error("Preço inválido");
    }

    try {
      const body: ProductPayload = {
        name: name.trim(),
        slug: s,
        description: description.trim(),
        price_cents: priceNumber,
        currency: "BRL",
        active,
        images: [],
      };

      if (editing) {
        await updateProduct(editing.id, body);
        toast.success("Produto atualizado");
      } else {
        await createProduct(body);
        toast.success("Produto criado");
      }
      setOpen(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao salvar");
    }
  }

  async function remove(p: ProductRow) {
    const ok = window.confirm(`Excluir "${p.name}"? Esta ação não pode ser desfeita.`);
    if (!ok) return;
    try {
      await deleteProduct(p.id);
      toast.success("Excluído");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao excluir");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-ink p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Produtos/Serviços</h1>
        <p className="mt-1 text-sm text-zinc-400">CRUD básico (pronto para evoluir com imagens e categorias).</p>
      </div>

      <div className="mt-4">
        <AdminListToolbar
          query={q}
          onQueryChange={setQ}
          queryPlaceholder="Buscar por nome ou slug…"
          onReload={load}
          onCreate={startCreate}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-800">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-900/40 text-zinc-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Preço</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-400">
                  Carregando…
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((p) => (
                <tr key={p.id} className="bg-ink">
                  <td className="px-4 py-3 text-white">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-300">{p.slug}</td>
                  <td className="px-4 py-3 text-zinc-200">{moneyFromCents(p.price_cents, p.currency)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${
                        p.active ? "bg-emerald-950/50 text-emerald-200" : "bg-zinc-900/50 text-zinc-300"
                      }`}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-200 hover:bg-red-950/30"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-400">
                  Nenhum item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-ink-muted p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neon-blue">
                  {editing ? "Editar" : "Novo"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">Produto/Serviço</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-900/40"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="text-sm text-zinc-200">
                Nome
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editing) setSlug(slugify(e.target.value, { maxLength: 140 }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-ink px-4 py-3 text-white outline-none focus:border-neon-blue"
                />
              </label>
              <label className="text-sm text-zinc-200">
                Slug
                <input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value, { maxLength: 140 }))}
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-ink px-4 py-3 font-mono text-sm text-white outline-none focus:border-neon-blue"
                />
              </label>
              <label className="text-sm text-zinc-200">
                Descrição
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 h-28 w-full rounded-xl border border-zinc-700 bg-ink px-4 py-3 text-white outline-none focus:border-neon-blue"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-zinc-200">
                  Preço (R$)
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    inputMode="decimal"
                    className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-ink px-4 py-3 text-white outline-none focus:border-neon-blue"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-ink px-4 py-3 text-sm text-zinc-200">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="h-4 w-4 accent-neon-blue"
                  />
                  Ativo
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-xl bg-neon-blue px-4 py-2 text-sm font-bold text-ink hover:brightness-110"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

