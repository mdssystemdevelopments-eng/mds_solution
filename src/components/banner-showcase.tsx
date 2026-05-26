"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export function BannerShowcase() {
  const reduce = useReducedMotion();

  return (
    <section className="section-pad" aria-label="MDS Soluções em Tecnologia">
      <div className="site-container">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="browser-frame browser-frame--glow relative overflow-hidden"
        >
          <Image
            src="/banner-mds.png"
            alt="MDS Soluções em Tecnologia: manutenção de computadores, desenvolvimento web, sistemas e suporte técnico"
            width={1200}
            height={400}
            className="h-auto w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(3,5,8,0.75)] via-[rgba(3,5,8,0.2)] to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-lg px-6 py-5 sm:px-8 sm:py-6">
              <p className="section-label">MDS Soluções em Tecnologia</p>
              <h2 className="heading-lg mt-2 text-2xl sm:text-3xl">Tecnologia de ponta para o seu negócio</h2>
              <ul className="mt-3 space-y-1 text-sm text-white">
                <li>▸ Manutenção de Computadores</li>
                <li>▸ Desenvolvimento Web</li>
                <li>▸ Desenvolvimento de Sistemas</li>
                <li>▸ Suporte Técnico em Informática</li>
              </ul>
              <Link href="/area-cliente" className="btn-cyber mt-5 inline-flex">
                Solicite seu orçamento →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
