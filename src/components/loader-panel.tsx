export function LoaderPanel() {
  return (
    <div className="mds-loader" role="status" aria-live="polite" aria-label="Carregando">
      <div className="mds-loader__bars" aria-hidden>
        <span className="mds-loader__bar" style={{ height: 14, animationDelay: "0s" }} />
        <span className="mds-loader__bar" style={{ height: 34, animationDelay: "0.1s" }} />
        <span className="mds-loader__bar" style={{ height: 54, animationDelay: "0.2s" }} />
        <span className="mds-loader__bar" style={{ height: 34, animationDelay: "0.3s" }} />
        <span className="mds-loader__bar" style={{ height: 14, animationDelay: "0.4s" }} />
      </div>
      <p className="mds-loader__text">
        CARREGANDO
        <span className="mds-loader__dot" style={{ animationDelay: "0s" }}>
          .
        </span>
        <span className="mds-loader__dot" style={{ animationDelay: "0.2s" }}>
          .
        </span>
        <span className="mds-loader__dot" style={{ animationDelay: "0.4s" }}>
          .
        </span>
      </p>
    </div>
  );
}
