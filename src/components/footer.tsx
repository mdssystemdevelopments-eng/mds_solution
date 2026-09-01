import { whatsappHref } from "@/lib/whatsapp";
import type { SiteContent } from "@/types/site-content";

export function Footer({ content }: { content: SiteContent }) {
  const { footer: f, contact: c, nav } = content;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="panel glass footer__box">
          <div className="footer__grid">
            <div className="footer__col footer__col--brand">
              <p className="footer__brand">{f.brand}</p>
              <p className="footer__tagline">{f.tagline}</p>
            </div>
            <div className="footer__col">
              <p className="footer__heading">{f.quickLinksLabel}</p>
              <ul className="footer__links">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
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
            {f.socials.length > 0 ? (
              <div className="footer__col">
                <p className="footer__heading">{f.socialsLabel}</p>
                <ul className="footer__links">
                  {f.socials.map((social) => (
                    <li key={social.href}>
                      <a href={social.href} target="_blank" rel="noopener noreferrer">
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <p className="footer__copy">
            © {f.copyrightYear} {f.copyrightName}
          </p>
        </div>
      </div>
    </footer>
  );
}
