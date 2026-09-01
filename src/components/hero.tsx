import Link from "next/link";
import { whatsappHref } from "@/lib/whatsapp";
import type { SiteContent } from "@/types/site-content";

export function Hero({ content }: { content: SiteContent }) {
  const h = content.hero;
  const wa = content.contact.whatsappNumber;
  const msg = content.contact.whatsappDefaultMessage;

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero__grid hero__grid--text">
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
              <Link href={h.primaryCtaHref || "/area-cliente"} className="btn">
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
        </div>
      </div>
    </section>
  );
}
