import Link from "next/link";

export default function AdminConfiguracoesPage() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-ink p-6">
      <h1 className="text-2xl font-bold text-white">Configurações</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Contatos, imagens, rodapé e textos do sistema ficam no Editor do site, separados por página.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/conteudo" className="cms-btn cms-btn--primary">
          Abrir editor do site
        </Link>
        <Link href="/admin/midias" className="cms-btn cms-btn--ghost">
          Biblioteca de mídias
        </Link>
      </div>
    </div>
  );
}
