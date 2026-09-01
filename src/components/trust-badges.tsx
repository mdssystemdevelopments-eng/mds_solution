function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.6A3.2 3.2 0 0 0 4.8 4.8V6H4a1.2 1.2 0 0 0-1.2 1.2v6A1.2 1.2 0 0 0 4 14.4h8a1.2 1.2 0 0 0 1.2-1.2v-6A1.2 1.2 0 0 0 12 6h-.8V4.8A3.2 3.2 0 0 0 8 1.6zm0 1.6A1.6 1.6 0 0 1 9.6 4.8V6H6.4V4.8A1.6 1.6 0 0 1 8 3.2z"
      />
    </svg>
  );
}

const SEALS = [
  { id: "ssl", label: "SSL" },
  { id: "https", label: "HTTPS" },
  { id: "lgpd", label: "LGPD" },
] as const;

export function TrustBadges() {
  return (
    <section className="trust-seals" aria-label="Selos">
      <div className="wrap">
        <ul className="trust-seals__list">
          {SEALS.map((seal) => (
            <li key={seal.id}>
              <span className="trust-seals__badge">
                <LockIcon />
                {seal.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
