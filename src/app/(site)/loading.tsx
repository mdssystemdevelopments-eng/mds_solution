import { LoaderPanel } from "@/components/loader-panel";

/** Mesmo visual do boot-loader — evita tela preta + logo solta antes do painel */
export default function SiteLoading() {
  return (
    <div className="page-loader page-loader--boot" aria-live="polite" aria-busy="true">
      <LoaderPanel />
    </div>
  );
}
