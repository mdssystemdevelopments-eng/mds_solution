"use client";

import type { SiteContent, HomeCard, NavItem, DifferentialItem } from "@/types/site-content";
import { defaultSiteContent } from "@/lib/default-site-content";
import type { AdminSectionId } from "@/lib/admin-pages";
import {
  AddButton,
  CardBox,
  Field,
  Input,
  SectionBlock,
  Textarea,
} from "@/components/admin/cms/form-fields";
import { ImageField } from "@/components/admin/cms/image-field";

type PatchFn = (updater: (prev: SiteContent) => SiteContent) => void;

export function SectionEditor({
  sectionId,
  content,
  patch,
}: {
  sectionId: AdminSectionId;
  content: SiteContent;
  patch: PatchFn;
}) {
  switch (sectionId) {
    case "media":
      return <MediaEditor content={content} patch={patch} />;
    case "seo":
      return <SeoEditor content={content} patch={patch} />;
    case "nav":
      return <NavEditor content={content} patch={patch} />;
    case "contact":
      return <ContactEditor content={content} patch={patch} />;
    case "footer":
      return <FooterEditor content={content} patch={patch} />;
    case "hero":
      return <HeroEditor content={content} patch={patch} />;
    case "home":
      return <HomeCardsEditor content={content} patch={patch} />;
    case "about":
      return <AboutEditor content={content} patch={patch} />;
    case "services":
      return <ServicesEditor content={content} patch={patch} />;
    case "portfolio":
      return <PortfolioEditor content={content} patch={patch} />;
    case "differentials":
      return <DifferentialsEditor content={content} patch={patch} />;
    case "trust":
      return <TrustEditor content={content} patch={patch} />;
    case "cta":
      return <CtaEditor content={content} patch={patch} />;
    case "contactPage":
      return <ContactPageEditor content={content} patch={patch} />;
    case "ui.homeServices":
      return <HomeServicesEditor content={content} patch={patch} />;
    case "ui.homeProcess":
      return <HomeProcessEditor content={content} patch={patch} />;
    case "ui.homeCta":
      return <HomeCtaEditor content={content} patch={patch} />;
    case "ui.homeFeatured":
      return <HomeFeaturedEditor content={content} patch={patch} />;
    case "trustBadges":
      return <TrustBadgesEditor content={content} patch={patch} />;
    case "ui.system":
      return <SystemUiEditor content={content} patch={patch} />;
    default:
      return <p className="text-sm text-zinc-400">Seção não configurada.</p>;
  }
}

function MediaEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const m = content.media ?? defaultSiteContent.media;
  return (
    <div className="space-y-6">
      <SectionBlock title="Identidade">
        <ImageField
          label="Logo"
          value={m.logo}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, logo: v } }))}
        />
        <ImageField
          label="Favicon"
          value={m.favicon}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, favicon: v } }))}
        />
        <ImageField
          label="Fundo da página inicial"
          value={m.homeWallpaper}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, homeWallpaper: v } }))}
        />
      </SectionBlock>
      <SectionBlock title="Fundos das páginas">
        <ImageField
          label="Sobre"
          value={m.backgrounds.sobre}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, backgrounds: { ...c.media.backgrounds, sobre: v } } }))}
        />
        <ImageField
          label="Serviços"
          value={m.backgrounds.servicos}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, backgrounds: { ...c.media.backgrounds, servicos: v } } }))}
        />
        <ImageField
          label="Projetos"
          value={m.backgrounds.portfolio}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, backgrounds: { ...c.media.backgrounds, portfolio: v } } }))}
        />
        <ImageField
          label="Contato"
          value={m.backgrounds.contato}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, backgrounds: { ...c.media.backgrounds, contato: v } } }))}
        />
        <ImageField
          label="Área do cliente"
          value={m.backgrounds.areaCliente}
          onChange={(v) => patch((c) => ({ ...c, media: { ...c.media, backgrounds: { ...c.media.backgrounds, areaCliente: v } } }))}
        />
      </SectionBlock>
    </div>
  );
}

function SeoEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const s = content.seo;
  const set = (key: keyof typeof s, val: string | string[]) =>
    patch((c) => ({ ...c, seo: { ...c.seo, [key]: val } }));

  return (
    <SectionBlock title="SEO & metadados">
      <Field label="Título do site">
        <Input value={s.siteTitle} onChange={(v) => set("siteTitle", v)} />
      </Field>
      <Field label="Descrição">
        <Textarea value={s.siteDescription} onChange={(v) => set("siteDescription", v)} rows={3} />
      </Field>
      <Field label="Palavras-chave" hint="Separadas por vírgula">
        <Input value={s.keywords.join(", ")} onChange={(v) => set("keywords", v.split(",").map((k) => k.trim()).filter(Boolean))} />
      </Field>
      <Field label="Título Open Graph">
        <Input value={s.ogTitle} onChange={(v) => set("ogTitle", v)} />
      </Field>
      <Field label="Descrição Open Graph">
        <Textarea value={s.ogDescription} onChange={(v) => set("ogDescription", v)} rows={2} />
      </Field>
      <Field label="Nome da organização">
        <Input value={s.organizationName} onChange={(v) => set("organizationName", v)} />
      </Field>
      <Field label="Descrição JSON-LD">
        <Textarea value={s.jsonLdDescription} onChange={(v) => set("jsonLdDescription", v)} rows={2} />
      </Field>
      <Field label="Assuntos (JSON-LD)" hint="Separados por vírgula">
        <Input value={s.knowsAbout.join(", ")} onChange={(v) => set("knowsAbout", v.split(",").map((k) => k.trim()).filter(Boolean))} />
      </Field>
    </SectionBlock>
  );
}

function NavEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const items = content.nav;

  function update(i: number, field: keyof NavItem, val: string) {
    patch((c) => {
      const nav = [...c.nav];
      nav[i] = { ...nav[i], [field]: val };
      return { ...c, nav };
    });
  }

  function add() {
    patch((c) => ({ ...c, nav: [...c.nav, { href: "/", label: "Novo link" }] }));
  }

  function remove(i: number) {
    patch((c) => ({ ...c, nav: c.nav.filter((_, idx) => idx !== i) }));
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <CardBox key={i} title="Item do menu" index={i} onRemove={() => remove(i)}>
          <Field label="Texto">
            <Input value={item.label} onChange={(v) => update(i, "label", v)} />
          </Field>
          <Field label="Link (URL)">
            <Input value={item.href} onChange={(v) => update(i, "href", v)} />
          </Field>
        </CardBox>
      ))}
      <AddButton label="Adicionar link ao menu" onClick={add} />
    </div>
  );
}

function ContactEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const c = content.contact;
  const set = (key: keyof typeof c, val: string) =>
    patch((prev) => ({ ...prev, contact: { ...prev.contact, [key]: val } }));

  return (
    <SectionBlock title="Contatos globais">
      <Field label="WhatsApp (com DDI, só números)" hint="Ex: 5517999999999">
        <Input value={c.whatsappNumber} onChange={(v) => set("whatsappNumber", v)} />
      </Field>
      <Field label="Mensagem padrão WhatsApp">
        <Textarea value={c.whatsappDefaultMessage} onChange={(v) => set("whatsappDefaultMessage", v)} rows={2} />
      </Field>
      <Field label="E-mail">
        <Input value={c.email} onChange={(v) => set("email", v)} type="email" />
      </Field>
    </SectionBlock>
  );
}

function FooterEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const f = content.footer;

  return (
    <div className="space-y-6">
      <SectionBlock title="Informações">
        <Field label="Marca">
          <Input value={f.brand} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, brand: v } }))} />
        </Field>
        <Field label="Tagline">
          <Textarea value={f.tagline} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, tagline: v } }))} rows={2} />
        </Field>
        <Field label="Ano copyright">
          <Input value={f.copyrightYear} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, copyrightYear: v } }))} />
        </Field>
        <Field label="Nome no copyright">
          <Input value={f.copyrightName} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, copyrightName: v } }))} />
        </Field>
        <Field label="Título dos links rápidos">
          <Input value={f.quickLinksLabel} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, quickLinksLabel: v } }))} />
        </Field>
        <Field label="Título do contato">
          <Input value={f.contactLabel} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, contactLabel: v } }))} />
        </Field>
        <Field label="Título das redes">
          <Input value={f.socialsLabel} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, socialsLabel: v } }))} />
        </Field>
        <Field label="Texto do WhatsApp">
          <Input value={f.whatsappLabel} onChange={(v) => patch((c) => ({ ...c, footer: { ...c.footer, whatsappLabel: v } }))} />
        </Field>
      </SectionBlock>
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-300">Redes sociais</p>
        {f.socials.map((s, i) => (
          <CardBox key={i} title="Rede social" index={i} onRemove={() => patch((c) => ({ ...c, footer: { ...c.footer, socials: c.footer.socials.filter((_, idx) => idx !== i) } }))}>
            <Field label="Nome">
              <Input value={s.label} onChange={(v) => patch((c) => { const socials = [...c.footer.socials]; socials[i] = { ...socials[i], label: v }; return { ...c, footer: { ...c.footer, socials } }; })} />
            </Field>
            <Field label="URL">
              <Input value={s.href} onChange={(v) => patch((c) => { const socials = [...c.footer.socials]; socials[i] = { ...socials[i], href: v }; return { ...c, footer: { ...c.footer, socials } }; })} />
            </Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar rede social" onClick={() => patch((c) => ({ ...c, footer: { ...c.footer, socials: [...c.footer.socials, { href: "https://", label: "Nova rede" }] } }))} />
      </div>
    </div>
  );
}

function HeroEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const h = content.hero;
  const set = (key: keyof typeof h, val: typeof h[typeof key]) =>
    patch((c) => ({ ...c, hero: { ...c.hero, [key]: val } }));

  return (
    <div className="space-y-6">
      <SectionBlock title="Textos principais">
        <Field label="Badge">
          <Input value={h.badge} onChange={(v) => set("badge", v)} />
        </Field>
        <Field label="Título (antes do destaque)">
          <Input value={h.headlineBefore} onChange={(v) => set("headlineBefore", v)} />
        </Field>
        <Field label="Título (destaque colorido)">
          <Input value={h.headlineAccent} onChange={(v) => set("headlineAccent", v)} />
        </Field>
        <Field label="Título (depois do destaque)">
          <Input value={h.headlineAfter} onChange={(v) => set("headlineAfter", v)} />
        </Field>
        <Field label="Subtítulo">
          <Textarea value={h.subheadline} onChange={(v) => set("subheadline", v)} rows={3} />
        </Field>
      </SectionBlock>
      <SectionBlock title="Botões">
        <Field label="Botão principal, texto">
          <Input value={h.primaryCtaLabel} onChange={(v) => set("primaryCtaLabel", v)} />
        </Field>
        <Field label="Botão principal, link">
          <Input value={h.primaryCtaHref} onChange={(v) => set("primaryCtaHref", v)} />
        </Field>
        <Field label="Botão secundário, texto">
          <Input value={h.secondaryCtaLabel} onChange={(v) => set("secondaryCtaLabel", v)} />
        </Field>
      </SectionBlock>
      <SectionBlock title="Card lateral">
        <Field label="Rótulo do card">
          <Input value={h.cardSummaryLabel} onChange={(v) => set("cardSummaryLabel", v)} />
        </Field>
        <Field label="Ano">
          <Input value={h.cardYear} onChange={(v) => set("cardYear", v)} />
        </Field>
        <Field label="Rodapé do card, kicker">
          <Input value={h.cardFooterKicker} onChange={(v) => set("cardFooterKicker", v)} />
        </Field>
        <Field label="Rodapé do card, texto">
          <Input value={h.cardFooterText} onChange={(v) => set("cardFooterText", v)} />
        </Field>
      </SectionBlock>
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-300">Bullets do card</p>
        {h.cardBullets.map((b, i) => (
          <CardBox key={i} title="Bullet" index={i} onRemove={() => set("cardBullets", h.cardBullets.filter((_, idx) => idx !== i))}>
            <Input value={b} onChange={(v) => set("cardBullets", h.cardBullets.map((x, idx) => (idx === i ? v : x)))} />
          </CardBox>
        ))}
        <AddButton label="Adicionar bullet" onClick={() => set("cardBullets", [...h.cardBullets, "Novo item"])} />
      </div>
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-300">Números da capa</p>
        {(h.stats ?? []).map((stat, i) => (
          <CardBox key={i} title="Número" index={i} onRemove={() => set("stats", (h.stats ?? []).filter((_, idx) => idx !== i))}>
            <Field label="Valor"><Input value={stat.value} onChange={(v) => set("stats", (h.stats ?? []).map((x, idx) => (idx === i ? { ...x, value: v } : x)))} /></Field>
            <Field label="Rótulo"><Input value={stat.label} onChange={(v) => set("stats", (h.stats ?? []).map((x, idx) => (idx === i ? { ...x, label: v } : x)))} /></Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar número" onClick={() => set("stats", [...(h.stats ?? []), { value: "0", label: "Novo" }])} />
      </div>
    </div>
  );
}

function HomeCardsEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const home = content.home;
  const cards = home.cards;

  function updateCard(i: number, field: keyof HomeCard, val: string) {
    patch((c) => {
      const next = [...c.home.cards];
      next[i] = { ...next[i], [field]: val };
      return { ...c, home: { ...c.home, cards: next } };
    });
  }

  return (
    <div className="space-y-6">
      <SectionBlock title="Cabeçalho da seção">
        <Field label="Eyebrow (kicker)">
          <Input value={home.sectionKicker} onChange={(v) => patch((c) => ({ ...c, home: { ...c.home, sectionKicker: v } }))} />
        </Field>
        <Field label="Título">
          <Input value={home.sectionTitle} onChange={(v) => patch((c) => ({ ...c, home: { ...c.home, sectionTitle: v } }))} />
        </Field>
        <Field label="Subtítulo">
          <Textarea value={home.sectionSubtitle} onChange={(v) => patch((c) => ({ ...c, home: { ...c.home, sectionSubtitle: v } }))} rows={2} />
        </Field>
      </SectionBlock>
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-300">Cards / containers</p>
        {cards.map((card, i) => (
          <CardBox key={i} title="Card" index={i} onRemove={() => patch((c) => ({ ...c, home: { ...c.home, cards: c.home.cards.filter((_, idx) => idx !== i) } }))}>
            <Field label="Título">
              <Input value={card.title} onChange={(v) => updateCard(i, "title", v)} />
            </Field>
            <Field label="Descrição">
              <Textarea value={card.description} onChange={(v) => updateCard(i, "description", v)} rows={2} />
            </Field>
            <Field label="Texto do botão">
              <Input value={card.cta} onChange={(v) => updateCard(i, "cta", v)} />
            </Field>
            <Field label="Link">
              <Input value={card.href} onChange={(v) => updateCard(i, "href", v)} />
            </Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar card" onClick={() => patch((c) => ({ ...c, home: { ...c.home, cards: [...c.home.cards, { href: "/", title: "Novo card", description: "", cta: "Saiba mais" }] } }))} />
      </div>
    </div>
  );
}

function AboutEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const a = content.about;
  return (
    <div className="space-y-6">
      <SectionBlock title="Sobre">
        <Field label="Eyebrow">
          <Input value={a.sectionKicker} onChange={(v) => patch((c) => ({ ...c, about: { ...c.about, sectionKicker: v } }))} />
        </Field>
        <Field label="Título">
          <Input value={a.title} onChange={(v) => patch((c) => ({ ...c, about: { ...c.about, title: v } }))} />
        </Field>
        <Field label="Destaque">
          <Textarea value={a.highlight} onChange={(v) => patch((c) => ({ ...c, about: { ...c.about, highlight: v } }))} rows={3} />
        </Field>
      </SectionBlock>
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-300">Parágrafos</p>
        {a.paragraphs.map((p, i) => (
          <CardBox key={i} title="Parágrafo" index={i} onRemove={() => patch((c) => ({ ...c, about: { ...c.about, paragraphs: c.about.paragraphs.filter((_, idx) => idx !== i) } }))}>
            <Textarea value={p} onChange={(v) => patch((c) => ({ ...c, about: { ...c.about, paragraphs: c.about.paragraphs.map((x, idx) => (idx === i ? v : x)) } }))} rows={4} />
          </CardBox>
        ))}
        <AddButton label="Adicionar parágrafo" onClick={() => patch((c) => ({ ...c, about: { ...c.about, paragraphs: [...c.about.paragraphs, ""] } }))} />
      </div>
    </div>
  );
}

function ServicesEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const s = {
    ...content.services,
    request: content.services.request ?? defaultSiteContent.services.request,
  };
  return (
    <div className="space-y-6">
      <SectionBlock title="Cabeçalho">
        <Field label="Eyebrow"><Input value={s.sectionKicker} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, sectionKicker: v } }))} /></Field>
        <Field label="Título"><Input value={s.title} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, title: v } }))} /></Field>
        <Field label="Subtítulo"><Textarea value={s.subtitle} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, subtitle: v } }))} rows={2} /></Field>
        <Field label="Título digitais"><Input value={s.digitalTitle} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, digitalTitle: v } }))} /></Field>
        <Field label="Título técnico"><Input value={s.techTitle} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, techTitle: v } }))} /></Field>
        <Field label="Intro técnico"><Textarea value={s.techIntro} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, techIntro: v } }))} rows={2} /></Field>
      </SectionBlock>
      <SectionBlock title="Formulário ao solicitar serviço">
        <Field label="Texto do botão"><Input value={s.request.cta} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, cta: v } } }))} /></Field>
        <Field label="Título do modal"><Input value={s.request.title} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, title: v } } }))} /></Field>
        <Field label="Texto do modal"><Textarea value={s.request.lead} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, lead: v } } }))} rows={2} /></Field>
        <Field label="Label nome"><Input value={s.request.nameLabel} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, nameLabel: v } } }))} /></Field>
        <Field label="Label e-mail"><Input value={s.request.emailLabel} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, emailLabel: v } } }))} /></Field>
        <Field label="Label telefone"><Input value={s.request.phoneLabel} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, phoneLabel: v } } }))} /></Field>
        <Field label="Label detalhes"><Input value={s.request.detailsLabel} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, detailsLabel: v } } }))} /></Field>
        <Field label="Placeholder detalhes"><Textarea value={s.request.detailsPlaceholder} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, detailsPlaceholder: v } } }))} rows={2} /></Field>
        <Field label="Botão enviar"><Input value={s.request.submit} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, submit: v } } }))} /></Field>
        <Field label="Botão cancelar"><Input value={s.request.cancel} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, cancel: v } } }))} /></Field>
        <Field label="Aviso de validação"><Input value={s.request.validation} onChange={(v) => patch((c) => ({ ...c, services: { ...c.services, request: { ...c.services.request, validation: v } } }))} /></Field>
      </SectionBlock>
      <ServiceListEditor title="Serviços digitais" items={s.digital} onChange={(items) => patch((c) => ({ ...c, services: { ...c.services, digital: items } }))} />
      <ServiceListEditor title="Assistência técnica" items={s.tech} onChange={(items) => patch((c) => ({ ...c, services: { ...c.services, tech: items } }))} />
    </div>
  );
}

function ServiceListEditor({ title, items, onChange }: { title: string; items: SiteContent["services"]["digital"]; onChange: (items: SiteContent["services"]["digital"]) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-neon-blue">{title}</p>
      {items.map((item, i) => (
        <CardBox key={i} title="Serviço" index={i} onRemove={() => onChange(items.filter((_, idx) => idx !== i))}>
          <Field label="Título"><Input value={item.title} onChange={(v) => onChange(items.map((x, idx) => (idx === i ? { ...x, title: v } : x)))} /></Field>
          <Field label="Descrição"><Textarea value={item.description} onChange={(v) => onChange(items.map((x, idx) => (idx === i ? { ...x, description: v } : x)))} rows={2} /></Field>
          <Field label="Benefícios" hint="Um por linha"><Textarea value={item.benefits.join("\n")} onChange={(v) => onChange(items.map((x, idx) => (idx === i ? { ...x, benefits: v.split("\n").filter(Boolean) } : x)))} rows={3} /></Field>
        </CardBox>
      ))}
      <AddButton label="Adicionar serviço" onClick={() => onChange([...items, { title: "Novo serviço", description: "", benefits: [] }])} />
    </div>
  );
}

function PortfolioEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const p = content.portfolio;
  return (
    <div className="space-y-6">
      <SectionBlock title="Cabeçalho">
        <Field label="Eyebrow"><Input value={p.sectionKicker} onChange={(v) => patch((c) => ({ ...c, portfolio: { ...c.portfolio, sectionKicker: v } }))} /></Field>
        <Field label="Título"><Input value={p.title} onChange={(v) => patch((c) => ({ ...c, portfolio: { ...c.portfolio, title: v } }))} /></Field>
        <Field label="Subtítulo"><Textarea value={p.subtitle} onChange={(v) => patch((c) => ({ ...c, portfolio: { ...c.portfolio, subtitle: v } }))} rows={2} /></Field>
      </SectionBlock>
      <div className="space-y-4">
        {p.items.map((item, i) => (
          <CardBox key={i} title="Projeto" index={i} onRemove={() => patch((c) => ({ ...c, portfolio: { ...c.portfolio, items: c.portfolio.items.filter((_, idx) => idx !== i) } }))}>
            <Field label="Nome"><Input value={item.name} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], name: v }; return { ...c, portfolio: { ...c.portfolio, items } }; })} /></Field>
            <Field label="Cliente"><Input value={item.client} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], client: v }; return { ...c, portfolio: { ...c.portfolio, items } }; })} /></Field>
            <Field label="Descrição"><Textarea value={item.description} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], description: v }; return { ...c, portfolio: { ...c.portfolio, items } }; })} rows={2} /></Field>
            <ImageField label="Imagem do projeto" value={item.image} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], image: v }; return { ...c, portfolio: { ...c.portfolio, items } }; })} />
            <Field label="Categoria">
              <select value={item.category} onChange={(e) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], category: e.target.value as typeof item.category }; return { ...c, portfolio: { ...c.portfolio, items } }; })} className="cms-input">
                <option value="site">Site</option>
                <option value="erp">ERP</option>
                <option value="sistema">Sistema</option>
                <option value="app">App</option>
              </select>
            </Field>
            <Field label="Ano"><Input value={item.year} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], year: v }; return { ...c, portfolio: { ...c.portfolio, items } }; })} /></Field>
            <Field label="Stack" hint="Separado por vírgula"><Input value={item.stack.join(", ")} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], stack: v.split(",").map((s) => s.trim()).filter(Boolean) }; return { ...c, portfolio: { ...c.portfolio, items } }; })} /></Field>
            <Field label="Estatística (usuários)"><Input value={item.stats.users} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], stats: { ...items[i].stats, users: v } }; return { ...c, portfolio: { ...c.portfolio, items } }; })} /></Field>
            <Field label="Estatística (módulos)"><Input value={item.stats.modules} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], stats: { ...items[i].stats, modules: v } }; return { ...c, portfolio: { ...c.portfolio, items } }; })} /></Field>
            <Field label="Recursos" hint="Um por linha"><Textarea value={item.features.join("\n")} onChange={(v) => patch((c) => { const items = [...c.portfolio.items]; items[i] = { ...items[i], features: v.split("\n").map((x) => x.trim()).filter(Boolean) }; return { ...c, portfolio: { ...c.portfolio, items } }; })} rows={3} /></Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar projeto" onClick={() => patch((c) => ({ ...c, portfolio: { ...c.portfolio, items: [...c.portfolio.items, { name: "Novo projeto", client: "", category: "site", description: "", image: "", stack: [], year: "2026", stats: { users: "", modules: "" }, features: [] }] } }))} />
      </div>
    </div>
  );
}

function DifferentialsEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  return <ItemsEditor title="Diferenciais" sectionKicker={content.differentials.sectionKicker} sectionTitle={content.differentials.title} items={content.differentials.items} onKicker={(v) => patch((c) => ({ ...c, differentials: { ...c.differentials, sectionKicker: v } }))} onTitle={(v) => patch((c) => ({ ...c, differentials: { ...c.differentials, title: v } }))} onItems={(items) => patch((c) => ({ ...c, differentials: { ...c.differentials, items: items as DifferentialItem[] } }))} />;
}

function TrustEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const t = content.trust;
  return (
    <div className="space-y-6">
      <SectionBlock title="Cabeçalho">
        <Field label="Eyebrow"><Input value={t.sectionKicker} onChange={(v) => patch((c) => ({ ...c, trust: { ...c.trust, sectionKicker: v } }))} /></Field>
        <Field label="Título"><Input value={t.title} onChange={(v) => patch((c) => ({ ...c, trust: { ...c.trust, title: v } }))} /></Field>
        <Field label="Subtítulo"><Textarea value={t.subtitle} onChange={(v) => patch((c) => ({ ...c, trust: { ...c.trust, subtitle: v } }))} rows={2} /></Field>
      </SectionBlock>
      <div className="space-y-4">
        {t.items.map((item, i) => (
          <CardBox key={i} title="Card confiança" index={i} onRemove={() => patch((c) => ({ ...c, trust: { ...c.trust, items: c.trust.items.filter((_, idx) => idx !== i) } }))}>
            <Field label="Ícone" hint="budget, shield, zap, support, chat, verified">
              <Input value={item.icon} onChange={(v) => patch((c) => { const items = [...c.trust.items]; items[i] = { ...items[i], icon: v }; return { ...c, trust: { ...c.trust, items } }; })} />
            </Field>
            <Field label="Título"><Input value={item.title} onChange={(v) => patch((c) => { const items = [...c.trust.items]; items[i] = { ...items[i], title: v }; return { ...c, trust: { ...c.trust, items } }; })} /></Field>
            <Field label="Texto"><Textarea value={item.text} onChange={(v) => patch((c) => { const items = [...c.trust.items]; items[i] = { ...items[i], text: v }; return { ...c, trust: { ...c.trust, items } }; })} rows={2} /></Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar card" onClick={() => patch((c) => ({ ...c, trust: { ...c.trust, items: [...c.trust.items, { icon: "shield", title: "Novo", text: "" }] } }))} />
      </div>
    </div>
  );
}

function ItemsEditor({ title, sectionKicker, sectionTitle, items, onKicker, onTitle, onItems }: { title: string; sectionKicker: string; sectionTitle: string; items: DifferentialItem[]; onKicker: (v: string) => void; onTitle: (v: string) => void; onItems: (items: DifferentialItem[]) => void }) {
  return (
    <div className="space-y-6">
      <SectionBlock title={title}>
        <Field label="Eyebrow"><Input value={sectionKicker} onChange={onKicker} /></Field>
        <Field label="Título"><Input value={sectionTitle} onChange={onTitle} /></Field>
      </SectionBlock>
      <div className="space-y-4">
        {items.map((item, i) => (
          <CardBox key={i} title="Card" index={i} onRemove={() => onItems(items.filter((_, idx) => idx !== i))}>
            <Field label="Título"><Input value={item.title} onChange={(v) => onItems(items.map((x, idx) => (idx === i ? { ...x, title: v } : x)))} /></Field>
            <Field label="Texto"><Textarea value={item.text} onChange={(v) => onItems(items.map((x, idx) => (idx === i ? { ...x, text: v } : x)))} rows={2} /></Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar card" onClick={() => onItems([...items, { title: "Novo", text: "" }])} />
      </div>
    </div>
  );
}

function CtaEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const c = content.cta;
  return (
    <SectionBlock title="Banner CTA">
      <Field label="Título"><Input value={c.title} onChange={(v) => patch((p) => ({ ...p, cta: { ...p.cta, title: v } }))} /></Field>
      <Field label="Texto"><Textarea value={c.text} onChange={(v) => patch((p) => ({ ...p, cta: { ...p.cta, text: v } }))} rows={2} /></Field>
      <Field label="Botão"><Input value={c.buttonText} onChange={(v) => patch((p) => ({ ...p, cta: { ...p.cta, buttonText: v } }))} /></Field>
    </SectionBlock>
  );
}

function ContactPageEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const cp = content.contactPage;
  const set = (key: keyof typeof cp, val: string) => patch((c) => ({ ...c, contactPage: { ...c.contactPage, [key]: val } }));

  return (
    <SectionBlock title="Página de contato">
      <Field label="Eyebrow"><Input value={cp.sectionKicker} onChange={(v) => set("sectionKicker", v)} /></Field>
      <Field label="Título"><Input value={cp.title} onChange={(v) => set("title", v)} /></Field>
      <Field label="Intro"><Textarea value={cp.intro} onChange={(v) => set("intro", v)} rows={2} /></Field>
      <Field label="Label nome"><Input value={cp.formNameLabel} onChange={(v) => set("formNameLabel", v)} /></Field>
      <Field label="Placeholder nome"><Input value={cp.formNamePlaceholder} onChange={(v) => set("formNamePlaceholder", v)} /></Field>
      <Field label="Label e-mail"><Input value={cp.formEmailLabel} onChange={(v) => set("formEmailLabel", v)} /></Field>
      <Field label="Placeholder e-mail"><Input value={cp.formEmailPlaceholder} onChange={(v) => set("formEmailPlaceholder", v)} /></Field>
      <Field label="Label mensagem"><Input value={cp.formMessageLabel} onChange={(v) => set("formMessageLabel", v)} /></Field>
      <Field label="Placeholder mensagem"><Input value={cp.formMessagePlaceholder} onChange={(v) => set("formMessagePlaceholder", v)} /></Field>
      <Field label="Texto botão enviar"><Input value={cp.formSubmit} onChange={(v) => set("formSubmit", v)} /></Field>
      <Field label="Texto enviando"><Input value={cp.formSubmitting} onChange={(v) => set("formSubmitting", v)} /></Field>
      <Field label="Título WhatsApp"><Input value={cp.whatsappTitle} onChange={(v) => set("whatsappTitle", v)} /></Field>
      <Field label="Subtítulo WhatsApp"><Input value={cp.whatsappSubtitle} onChange={(v) => set("whatsappSubtitle", v)} /></Field>
      <Field label="Rótulo do e-mail"><Input value={cp.emailCardLabel} onChange={(v) => set("emailCardLabel", v)} /></Field>
      <Field label="Mensagem de sucesso"><Textarea value={cp.successHint} onChange={(v) => set("successHint", v)} rows={2} /></Field>
      <Field label="Mensagem de erro"><Textarea value={cp.errorHint} onChange={(v) => set("errorHint", v)} rows={2} /></Field>
    </SectionBlock>
  );
}

function HomeServicesEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const hs = content.ui.homeServices;
  return (
    <div className="space-y-6">
      <SectionBlock title="Bloco serviços (home)">
        <Field label="Eyebrow"><Input value={hs.eyebrow} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, eyebrow: v } } }))} /></Field>
        <Field label="Título"><Input value={hs.title} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, title: v } } }))} /></Field>
        <Field label="Lead"><Textarea value={hs.lead} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, lead: v } } }))} rows={2} /></Field>
        <Field label="Texto Saiba mais"><Input value={hs.learnMore} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, learnMore: v } } }))} /></Field>
        <Field label="Texto Fechar"><Input value={hs.close} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, close: v } } }))} /></Field>
      </SectionBlock>
      <div className="space-y-4">
        {hs.items.map((item, i) => (
          <CardBox key={i} title="Card serviço" index={i} onRemove={() => patch((c) => ({ ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, items: c.ui.homeServices.items.filter((_, idx) => idx !== i) } } }))}>
            <Field label="Título"><Input value={item.title} onChange={(v) => patch((c) => { const items = [...c.ui.homeServices.items]; items[i] = { ...items[i], title: v }; return { ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, items } } }; })} /></Field>
            <Field label="Descrição"><Textarea value={item.desc} onChange={(v) => patch((c) => { const items = [...c.ui.homeServices.items]; items[i] = { ...items[i], desc: v }; return { ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, items } } }; })} rows={2} /></Field>
            <Field label="Texto do modal"><Textarea value={item.details ?? ""} onChange={(v) => patch((c) => { const items = [...c.ui.homeServices.items]; items[i] = { ...items[i], details: v || undefined }; return { ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, items } } }; })} rows={4} /></Field>
            <Field label="Pontos do modal (um por linha)"><Textarea value={(item.points ?? []).join("\n")} onChange={(v) => patch((c) => { const items = [...c.ui.homeServices.items]; items[i] = { ...items[i], points: v.split("\n").map((line) => line.trim()).filter(Boolean) }; return { ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, items } } }; })} rows={4} /></Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar card" onClick={() => patch((c) => ({ ...c, ui: { ...c.ui, homeServices: { ...c.ui.homeServices, items: [...c.ui.homeServices.items, { title: "Novo", desc: "" }] } } }))} />
      </div>
    </div>
  );
}

function HomeProcessEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const hp = content.ui.homeProcess;
  return (
    <div className="space-y-6">
      <SectionBlock title="Como funciona">
        <Field label="Eyebrow"><Input value={hp.eyebrow} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeProcess: { ...c.ui.homeProcess, eyebrow: v } } }))} /></Field>
        <Field label="Título"><Input value={hp.title} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeProcess: { ...c.ui.homeProcess, title: v } } }))} /></Field>
      </SectionBlock>
      <div className="space-y-4">
        {hp.steps.map((step, i) => (
          <CardBox key={i} title="Passo" index={i} onRemove={() => patch((c) => ({ ...c, ui: { ...c.ui, homeProcess: { ...c.ui.homeProcess, steps: c.ui.homeProcess.steps.filter((_, idx) => idx !== i) } } }))}>
            <Field label="Título"><Input value={step.title} onChange={(v) => patch((c) => { const steps = [...c.ui.homeProcess.steps]; steps[i] = { ...steps[i], title: v }; return { ...c, ui: { ...c.ui, homeProcess: { ...c.ui.homeProcess, steps } } }; })} /></Field>
            <Field label="Texto"><Textarea value={step.text} onChange={(v) => patch((c) => { const steps = [...c.ui.homeProcess.steps]; steps[i] = { ...steps[i], text: v }; return { ...c, ui: { ...c.ui, homeProcess: { ...c.ui.homeProcess, steps } } }; })} rows={2} /></Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar passo" onClick={() => patch((c) => ({ ...c, ui: { ...c.ui, homeProcess: { ...c.ui.homeProcess, steps: [...c.ui.homeProcess.steps, { title: "Novo passo", text: "" }] } } }))} />
      </div>
    </div>
  );
}

function HomeCtaEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const hc = content.ui.homeCta;
  return (
    <SectionBlock title="Chamada final (home)">
      <Field label="Eyebrow"><Input value={hc.eyebrow} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeCta: { ...c.ui.homeCta, eyebrow: v } } }))} /></Field>
      <Field label="Título"><Input value={hc.title} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeCta: { ...c.ui.homeCta, title: v } } }))} /></Field>
      <Field label="Lead"><Textarea value={hc.lead} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeCta: { ...c.ui.homeCta, lead: v } } }))} rows={2} /></Field>
      <Field label="Botão área cliente"><Input value={hc.clientArea} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeCta: { ...c.ui.homeCta, clientArea: v } } }))} /></Field>
      <Field label="Botão contato"><Input value={hc.contact} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeCta: { ...c.ui.homeCta, contact: v } } }))} /></Field>
    </SectionBlock>
  );
}

function HomeFeaturedEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const hf = content.ui.homeFeatured;
  return (
    <SectionBlock title="Projetos em destaque">
      <Field label="Eyebrow"><Input value={hf.eyebrow} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeFeatured: { ...c.ui.homeFeatured, eyebrow: v } } }))} /></Field>
      <Field label="Título"><Input value={hf.title} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeFeatured: { ...c.ui.homeFeatured, title: v } } }))} /></Field>
      <Field label="Lead"><Textarea value={hf.lead} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeFeatured: { ...c.ui.homeFeatured, lead: v } } }))} rows={2} /></Field>
      <Field label="Ver todos"><Input value={hf.viewAll} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, homeFeatured: { ...c.ui.homeFeatured, viewAll: v } } }))} /></Field>
    </SectionBlock>
  );
}

function TrustBadgesEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const block = content.trustBadges ?? defaultSiteContent.trustBadges;
  return (
    <div className="space-y-6">
      <SectionBlock title="Selos acima do rodapé">
        <Field label="Título da faixa">
          <Input value={block.title} onChange={(v) => patch((c) => ({ ...c, trustBadges: { ...c.trustBadges, title: v } }))} />
        </Field>
      </SectionBlock>
      <div className="space-y-4">
        {block.items.map((item, i) => (
          <CardBox key={i} title="Selo" index={i} onRemove={() => patch((c) => ({ ...c, trustBadges: { ...c.trustBadges, items: c.trustBadges.items.filter((_, idx) => idx !== i) } }))}>
            <Field label="Título"><Input value={item.title} onChange={(v) => patch((c) => { const items = [...c.trustBadges.items]; items[i] = { ...items[i], title: v }; return { ...c, trustBadges: { ...c.trustBadges, items } }; })} /></Field>
            <Field label="Texto"><Textarea value={item.text} onChange={(v) => patch((c) => { const items = [...c.trustBadges.items]; items[i] = { ...items[i], text: v }; return { ...c, trustBadges: { ...c.trustBadges, items } }; })} rows={2} /></Field>
          </CardBox>
        ))}
        <AddButton label="Adicionar selo" onClick={() => patch((c) => ({ ...c, trustBadges: { ...c.trustBadges, items: [...c.trustBadges.items, { title: "Novo selo", text: "" }] } }))} />
      </div>
    </div>
  );
}

function SystemUiEditor({ content, patch }: { content: SiteContent; patch: PatchFn }) {
  const ui = content.ui;
  return (
    <div className="space-y-6">
      <SectionBlock title="Acessibilidade e loader">
        <Field label="Pular para o conteúdo"><Input value={ui.skipToContent} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, skipToContent: v } }))} /></Field>
        <Field label="Voltar ao topo"><Input value={ui.scrollTop} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, scrollTop: v } }))} /></Field>
        <Field label="Loader - kicker"><Input value={ui.loader.kicker} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, loader: { ...c.ui.loader, kicker: v } } }))} /></Field>
        <Field label="Loader - nome"><Input value={ui.loader.name} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, loader: { ...c.ui.loader, name: v } } }))} /></Field>
        <Field label="Loader - dica"><Input value={ui.loader.hint} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, loader: { ...c.ui.loader, hint: v } } }))} /></Field>
      </SectionBlock>
      <SectionBlock title="Menu">
        <Field label="Abrir menu"><Input value={ui.nav.openMenu} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, nav: { ...c.ui.nav, openMenu: v } } }))} /></Field>
        <Field label="Fechar menu"><Input value={ui.nav.closeMenu} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, nav: { ...c.ui.nav, closeMenu: v } } }))} /></Field>
        <Field label="Aria da marca"><Input value={ui.nav.brandAria} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, nav: { ...c.ui.nav, brandAria: v } } }))} /></Field>
        <Field label="Label do idioma"><Input value={ui.nav.languageLabel} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, nav: { ...c.ui.nav, languageLabel: v } } }))} /></Field>
        <Field label="Escolher idioma"><Input value={ui.nav.chooseLanguage} onChange={(v) => patch((c) => ({ ...c, ui: { ...c.ui, nav: { ...c.ui.nav, chooseLanguage: v } } }))} /></Field>
      </SectionBlock>
    </div>
  );
}
