import Link from "next/link";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteContent } from "@/types/site-content";
import { HeroLogoVideo } from "@/components/hero-logo-video";

const stats = [
  { value: "29+", label: "Projetos entregues" },
  { value: "91+", label: "Serviços" },
  { value: "100%", label: "Atendimento direto" },
  { value: "24h", label: "Resposta WhatsApp" },
];

export function Hero({ content }: { content: SiteContent }) {
  const h = content.hero;
  const wa = content.contact.whatsappNumber;
  const msg = content.contact.whatsappDefaultMessage;

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero__grid">
          <div className="panel glass">
            <p className="eyebrow hero__badge">{h.badge}</p>
            <h1 className="h1" style={{ marginTop: "0.75rem" }}>
              {h.headlineBefore}{" "}
              <span className="text-accent">{h.headlineAccent}</span>
              {h.headlineAfter ? ` ${h.headlineAfter}` : ""}
            </h1>
            <p className="lead" style={{ marginTop: "1.25rem", maxWidth: "32rem" }}>
              {h.subheadline}
            </p>
            <div className="hero__actions">
              <Link href="/area-cliente" className="btn">
                {h.primaryCtaLabel}
              </Link>
              <a
                href={whatsappHref(wa, msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn--ghost"
              >
                {h.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <div className="hero__preview hero__preview--logo">
            <HeroLogoVideo />
          </div>
        </div>

        <div className="hero__stats">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat__value">{s.value}</span>
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
