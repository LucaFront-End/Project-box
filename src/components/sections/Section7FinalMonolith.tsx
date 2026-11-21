import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, ShieldCheck } from 'lucide-react';
import { useBox } from '../../context/BoxContext';

export const Section7FinalMonolith: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const { openDistributorModal, openSearch } = useBox();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursor({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      onMouseMove={handleMouseMove}
      className="relative bg-studio text-white py-28 md:py-36 overflow-hidden border-t border-white/10"
    >
      {/* Subtle Mouse-Tracking Signal Orange Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(640px circle at ${cursor.x}% ${cursor.y}%, rgba(234, 107, 26, 0.14), transparent 60%)`,
        }}
      />

      {/* Giant Architectural Hairline Background Mark */}
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="pointer-events-none absolute right-[-6%] top-1/2 -translate-y-1/2 w-[520px] h-[520px] opacity-[0.06]"
        aria-hidden="true"
      >
        <path d="M40 72H224V168H320V360H40V72Z" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="256" y="32" width="104" height="104" stroke="#EA6B1A" strokeWidth="2" />
      </svg>

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-8 space-y-16">
        {/* Centered Monolithic Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-[760px] mx-auto space-y-5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            PROJECT BOX. · MÉXICO
          </p>
          <h2 className="font-sans font-semibold text-4xl sm:text-6xl md:text-[72px] leading-[1.02] tracking-editorial">
            Construye sin límites<span className="text-signal">.</span>
          </h2>
          <p className="text-sm sm:text-lg text-silver leading-relaxed max-w-[560px] mx-auto">
            Ya sea un enlace inalámbrico puntual o la infraestructura integral de un campus corporativo, todo comienza en la caja correcta.
          </p>
        </motion.div>

        {/* Dual Architectural Split Conversion Portals (No plain boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/15 rounded-[32px] overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/15 bg-white/[0.02] backdrop-blur-xl">
          {/* Portal 1: B2B Distributors */}
          <button
            type="button"
            onClick={openDistributorModal}
            className="group p-8 sm:p-12 text-left flex flex-col justify-between gap-8 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="w-full flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
                <ShieldCheck className="w-4 h-4" />
                Portal B2B · Integradores
              </span>
              <span className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-signal group-hover:border-signal transition-colors">
                <ArrowUpRight className="w-4 h-4 text-white" />
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Únete a la red de distribuidores
              </h3>
              <p className="text-sm text-silver leading-relaxed">
                Accede a tarifas preferenciales, cotizaciones de proyecto, capacitaciones certificadas y prioridad logística nacional.
              </p>
            </div>
          </button>

          {/* Portal 2: Direct Catalog Search */}
          <button
            type="button"
            onClick={() => openSearch('')}
            className="group p-8 sm:p-12 text-left flex flex-col justify-between gap-8 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="w-full flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/75">
                <Search className="w-4 h-4 text-signal" />
                Catálogo +100,000 SKUs
              </span>
              <span className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-obsidian transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Explorar catálogo & armar Box
              </h3>
              <p className="text-sm text-silver leading-relaxed">
                Busca por SKU, marca o vertical y prepara tu lista técnica lista para SPEI, tarjeta o financiamiento Mercado Crédito.
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
