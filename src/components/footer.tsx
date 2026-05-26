import { whatsappHref } from "@/lib/whatsapp";
import type { SiteContent } from "@/types/site-content";

export function Footer({ content }: { content: SiteContent }) {
  const { footer: f, contact: c } = content;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="panel glass footer__box">
          <div className="footer__grid">
            <div className="footer__col footer__col--brand">
              <p className="footer__brand">{f.brand}</p>
              <p className="footer__tagline">{f.tagline}</p>
              <p className="footer__code">{"// build / deploy / support"}</p>
            </div>
            <div className="footer__col">
              <p className="footer__heading">{f.contactLabel}</p>
              <ul className="footer__links">
                <li>
                  <a
                    href={whatsappHref(c.whatsappNumber, c.whatsappDefaultMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {f.whatsappLabel}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </li>
              </ul>
            </div>
          </div>
          <p className="footer__copy">
            © {f.copyrightYear} {f.copyrightName}
          </p>
        </div>
      </div>
    </footer>
  );
}
