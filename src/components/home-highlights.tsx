"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { SiteContent } from "@/types/site-content";

const cardIcons = ["📋", "⚙️", "🚀", "💬"];

export function HomeHighlights({ content }: { content: SiteContent }) {
  const reduce = useReducedMotion();
  const { home: h } = content;

  return (
    <section className="section-pad" aria-label={h.sectionTitle}>
      <div className="site-container section-stack">
        <div className="section-head">
          <p className="section-label">{h.sectionKicker}</p>
          <h2 className="heading-lg mt-3">{h.sectionTitle}</h2>
          <p className="body-lg mt-4">{h.sectionSubtitle}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {h.cards.map((card, i) => (
            <motion.div
              key={card.href + card.title}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={card.href}
                className="card group relative flex h-full flex-col p-6"
              >
                <span className="mb-3 block text-2xl leading-none opacity-40" aria-hidden>
                  {cardIcons[i] ?? "✦"}
                </span>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyber">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white">{card.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyber">
                  {card.cta}
                  <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
