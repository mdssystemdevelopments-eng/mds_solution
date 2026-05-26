import Link from "next/link";
import { ADMIN_PAGES } from "@/lib/admin-pages";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-ink p-6">
        <h1 className="text-2xl font-bold text-white">Bem-vindo ao painel</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Escolha o que deseja configurar. O editor visual permite editar textos, cards e containers sem JSON.
        </p>
        <Link
          href="/admin/conteudo"
          className="mt-4 inline-flex rounded-xl bg-neon-blue px-5 py-2.5 text-sm font-bold text-ink hover:brightness-110"
        >
          Abrir editor do site
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_PAGES.map((page) => (
          <Link
            key={page.id}
            href="/admin/conteudo"
            className="group rounded-2xl border border-zinc-800 bg-ink p-5 transition hover:border-neon-blue/40 hover:bg-zinc-900/30"
          >
            <p className="text-lg font-semibold text-white group-hover:text-neon-blue">{page.label}</p>
            <p className="mt-1 text-xs text-zinc-500">{page.previewPath}</p>
            <p className="mt-2 text-sm text-zinc-400">{page.description}</p>
            <p className="mt-3 text-xs text-neon-blue">{page.sections.length} seções editáveis →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
