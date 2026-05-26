import { LoaderPanel } from "@/components/loader-panel";

/** Overlay no HTML — cobre a página antes do React hidratar */
export function BootLoader() {
  return (
    <div id="boot-loader" className="page-loader page-loader--boot" aria-live="polite" aria-busy="true">
      <LoaderPanel />
    </div>
  );
}
