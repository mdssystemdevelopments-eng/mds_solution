const stats = [
  { value: "8+", label: "Projetos entregues" },
  { value: "27+", label: "Serviços disponíveis" },
  { value: "100%", label: "Atendimento direto" },
  { value: "24h", label: "Resposta no WhatsApp" },
];

export function HeroStats() {
  return (
    <section className="hero-stats" aria-label="Números">
      <div className="site-container">
        <div className="hero-stats__grid">
          {stats.map((s) => (
            <div key={s.label} className="hero-stats__item">
              <span className="hero-stats__value">{s.value}</span>
              <span className="hero-stats__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
