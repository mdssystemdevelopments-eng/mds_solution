import { whatsappHref } from "@/lib/whatsapp";
import type { SiteContent } from "@/types/site-content";

export function CtaBanner({ content }: { content: SiteContent }) {
  const c = content.cta;
  const wa = content.contact.whatsappNumber;
  const msg = content.contact.whatsappDefaultMessage;

  return (
    <section className="py-12 lg:py-16">
      <div className="site-container">
        <div className="card flex flex-col items-start gap-6 px-8 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-12">
          <div className="max-w-lg">
            <h2 className="font-display text-2xl font-semibold text-white">{c.title}</h2>
            <p className="mt-3 text-white">{c.text}</p>
          </div>
          <a href={whatsappHref(wa, msg)} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
            {c.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}
