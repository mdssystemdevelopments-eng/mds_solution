import { LoaderPanel } from "@/components/loader-panel";

/** Overlay no HTML — cobre a página antes do React hidratar */
export function BootLoader() {
  return (
    <>
      <div id="boot-loader" className="page-loader page-loader--boot" aria-live="polite" aria-busy="true">
        <LoaderPanel />
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){setTimeout(function(){var b=document.getElementById("boot-loader");var r=document.querySelector(".site-root");if(b){b.classList.add("page-loader--hide");setTimeout(function(){try{b.remove()}catch(e){}},320)}if(r)r.classList.remove("is-booting")},3500)})();`,
        }}
      />
    </>
  );
}
