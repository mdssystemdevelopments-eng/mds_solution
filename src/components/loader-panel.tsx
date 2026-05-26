const LOGO_SRC = "/logo-mds.png";

export function LoaderPanel() {
  return (
    <div className="page-loader__panel">
      <div className="page-loader__row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_SRC} alt="" className="page-loader__logo" width={168} height={168} />
        <div className="page-loader__title">
          <span className="page-loader__kicker">INICIALIZANDO</span>
          <span className="page-loader__name">MDS SOLUÇÕES</span>
        </div>
      </div>
      <div className="page-loader__bar" role="progressbar" aria-label="Carregando" />
      <p className="page-loader__hint">Carregando interface…</p>
    </div>
  );
}
