"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fetch";
import { ADMIN_LOGIN_PATH } from "@/lib/admin-routes";
import { ADMIN_PAGES } from "@/lib/admin-pages";

const NAV = [
  { href: "/admin", label: "Início" },
  { href: "/admin/conteudo", label: "Editor do site" },
  { href: "/admin/midias", label: "Mídias" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/configuracoes", label: "Configurações" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditor = pathname.startsWith("/admin/conteudo");

  async function logout() {
    const res = await apiFetch("/api/admin/logout", { method: "POST" });
    if (!res.ok) toast.error("Falha ao sair");
    router.push(ADMIN_LOGIN_PATH);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      <div className={`mx-auto flex gap-0 ${isEditor ? "max-w-[1600px]" : "max-w-7xl gap-6 px-4 py-6"}`}>
        <aside className="hidden w-56 shrink-0 border-r border-zinc-800 bg-ink-muted/50 p-4 md:block md:min-h-screen">
          <div className="px-2 py-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neon-blue">MDS CMS</p>
            <p className="mt-1 text-sm font-bold text-white">Painel</p>
          </div>
          <nav className="mt-4 space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                    active ? "bg-neon-blue/10 text-neon-blue" : "text-zinc-300 hover:bg-zinc-900/40"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {!isEditor && (
            <div className="mt-6">
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-zinc-500">Atalhos</p>
              <div className="space-y-1">
                {ADMIN_PAGES.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href="/admin/conteudo"
                    className="block rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 space-y-2 border-t border-zinc-800 pt-4">
            <Link href="/" target="_blank" className="block rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/40">
              Ver site
            </Link>
            <button type="button" onClick={logout} className="w-full rounded-xl border border-red-500/40 px-3 py-2 text-left text-sm text-red-200 hover:bg-red-950/30">
              Sair
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-4 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  );
}
