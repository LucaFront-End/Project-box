import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { PARTNER_BRANDS } from '../../data/catalog';
import { PartnerBrand, VerticalId } from '../../types/commerce';
import { useBox } from '../../context/BoxContext';
import { ScaleArchitectureVisual, ScaleId } from '../visuals/ScaleArchitectureVisual';

interface ScaleTabConfig {
  id: ScaleId;
  label: string;
  headline: string;
  metrics: { value: string; label: string; accent?: boolean }[];
  ctaLabel: string;
  action: 'search' | 'b2b';
}

const SCALE_TABS: ScaleTabConfig[] = [
  {
    id: 'pyme',
    label: 'Comercial & PyME',
    headline: 'Equipos listos para despacho inmediato desde una sola unidad.',
    metrics: [
      { value: 'Desde 1 pz', label: 'Sin compra mínima' },
      { value: '24 hrs', label: 'Envío express asegurado', accent: true },
      { value: 'Plug & Play', label: 'Kits pre-validados' },
    ],
    ctaLabel: 'Explorar catálogo',
    action: 'search',
  },
  {
    id: 'corporativo',
    label: 'Corporativo & Campus',
    headline: 'Surtido multivertical consolidado con tarifa preferencial B2B.',
    metrics: [
      { value: '-18% B2B', label: 'Tarifa integrador' },
      { value: '1 envío', label: 'Orden consolidada', accent: true },
      { value: 'Preventa', label: 'Ingeniería dedicada' },
    ],
    ctaLabel: 'Solicitar cuenta B2B',
    action: 'b2b',
  },
  {
    id: 'industrial',
    label: 'Industrial & Gobierno',
    headline: 'Reserva de inventario para obra y respaldo oficial de fabricante.',
    metrics: [
      { value: '100K+', label: 'SKUs con reserva' },
      { value: 'A sitio', label: 'Logística especializada', accent: true },
      { value: '120+', label: 'Cartas de fabricante' },
    ],
    ctaLabel: 'Cotizar proyecto',
    action: 'b2b',
  },
];

const VERTICAL_BADGES: Record<VerticalId, string> = {
  seguridad: 'Seguridad IA',
  redes: 'Redes 10G',
  energia: 'Energía',
  computo: 'Cómputo',
  iluminacion: 'LED Industrial',
  radiocom: 'Radiocom',
};

export const Section5EcosystemBrands: React.FC = () => {
  const [activeScale, setActiveScale] = useState<ScaleId>('corporativo');
  const [selectedBrand, setSelectedBrand] = useState<PartnerBrand>(PARTNER_BRANDS[0]);
  const { openSearch, openDistributorModal } = useBox();

  const currentTab = SCALE_TABS.find((t) => t.id === activeScale) ?? SCALE_TABS[1];
  const topRow = PARTNER_BRANDS.slice(0, 6);
  const bottomRow = PARTNER_BRANDS.slice(6, 12);

  return (
    <section
      id="ecosistema"
      data-theme="dark"
      className="relative bg-studio text-white py-24 md:py-32 overflow-hidden border-t border-white/10"
    >
      {/* Subtle Top Studio Ambient Glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[880px] h-[380px] opacity-45"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(234, 107, 26, 0.14) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-8 space-y-16">
        {/* Beat 1: Clean Centered Editorial Statement */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-[760px] mx-auto space-y-3.5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            Escala Real · Respaldo Oficial
          </p>
          <h2 className="font-sans font-semibold text-3xl sm:text-5xl md:text-[52px] leading-[1.06] tracking-editorial">
            Un inventario diseñado para el tamaño de tu obra<span className="text-signal">.</span>
          </h2>
          <p className="text-sm sm:text-base text-silver max-w-[540px] mx-auto">
            Selecciona la escala de tu proyecto para ver cómo adaptamos stock, logística e ingeniería.
          </p>
        </motion.div>

        {/* Beat 2: 3 Interactive Visual Tabs (Morphing Isometric Visual + Distinct Real Metrics) */}
        <div className="space-y-8">
          {/* Segmented Pill Rail */}
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
              {SCALE_TABS.map((tab) => {
                const isActive = tab.id === activeScale;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveScale(tab.id)}
                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                      isActive ? 'text-obsidian' : 'text-silver hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="ecosystemScalePill"
                        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-white shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Dark Glass Showcase Split */}
          <div className="rounded-[32px] bg-white/[0.025] border border-white/10 backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left: Animated Minimalist Isometric Topology */}
            <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10">
              <ScaleArchitectureVisual scale={activeScale} />
            </div>

            {/* Right: Morphing Metrics & Clean Action */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-8"
                >
                  <h3 className="font-sans font-medium text-xl sm:text-2xl text-white/95 leading-snug max-w-[520px]">
                    {currentTab.headline}
                  </h3>

                  <div className="grid grid-cols-3 gap-4 sm:gap-8 py-5 border-t border-b border-white/10">
                    {currentTab.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p
                          className={`font-display font-semibold text-2xl sm:text-4xl tracking-editorial tabular-nums ${
                            metric.accent ? 'text-signal' : 'text-white'
                          }`}
                        >
                          {metric.value}
                        </p>
                        <p className="text-[11px] sm:text-xs text-silver mt-1">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-silver hidden sm:inline">
                      Soporte técnico y envíos asegurados a todo México
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        currentTab.action === 'search'
                          ? openSearch('')
                          : openDistributorModal()
                      }
                      className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-white text-obsidian hover:bg-signal hover:text-white text-xs font-semibold transition-colors cursor-pointer ml-auto sm:ml-0"
                    >
                      <span>{currentTab.ctaLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Beat 3: Edge-Feathered Kinetic Brand Ribbons + Compact Glass Spotlight Bar */}
        <div className="space-y-6">
          <div
            className="space-y-2.5 marquee-pause-hover overflow-hidden py-1"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <div className="w-max flex items-center gap-3 marquee-track animate-marquee-left">
              {[...topRow, ...topRow].map((brand, i) => {
                const isSelected = selectedBrand.id === brand.id;
                return (
                  <button
                    key={`${brand.id}-top-${i}`}
                    type="button"
                    onMouseEnter={() => setSelectedBrand(brand)}
                    onClick={() => setSelectedBrand(brand)}
                    className={`shrink-0 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-obsidian border-white'
                        : 'bg-white/[0.03] text-white/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-signal' : 'bg-white/25'
                      }`}
                    />
                    <span className="font-display font-bold tracking-[0.06em] text-xs sm:text-sm">
                      {brand.name}
                    </span>
                    <span
                      className={`text-[11px] ${
                        isSelected ? 'text-obsidian/65' : 'text-silver/70'
                      }`}
                    >
                      {VERTICAL_BADGES[brand.verticalId]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="w-max flex items-center gap-3 marquee-track animate-marquee-right">
              {[...bottomRow, ...bottomRow].map((brand, i) => {
                const isSelected = selectedBrand.id === brand.id;
                return (
                  <button
                    key={`${brand.id}-bot-${i}`}
                    type="button"
                    onMouseEnter={() => setSelectedBrand(brand)}
                    onClick={() => setSelectedBrand(brand)}
                    className={`shrink-0 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-obsidian border-white'
                        : 'bg-white/[0.03] text-white/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-signal' : 'bg-white/25'
                      }`}
                    />
                    <span className="font-display font-bold tracking-[0.06em] text-xs sm:text-sm">
                      {brand.name}
                    </span>
                    <span
                      className={`text-[11px] ${
                        isSelected ? 'text-obsidian/65' : 'text-silver/70'
                      }`}
                    >
                      {VERTICAL_BADGES[brand.verticalId]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Single-Row Brand Spotlight */}
          <div className="max-w-[920px] mx-auto rounded-2xl bg-white/[0.035] border border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBrand.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0"
              >
                <span className="font-display font-bold text-base tracking-[0.05em] text-white">
                  {selectedBrand.name}
                </span>
                <span className="text-xs text-silver truncate max-w-[440px]">
                  {selectedBrand.specialty}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-signal font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  {selectedBrand.skuCount}
                </span>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => openSearch(selectedBrand.name)}
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-signal transition-colors cursor-pointer"
            >
              <span>Ver catálogo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
