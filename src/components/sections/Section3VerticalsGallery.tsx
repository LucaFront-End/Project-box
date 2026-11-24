import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { CATALOG_PRODUCTS, VERTICALS, formatMxn } from '../../data/catalog';
import { VerticalId } from '../../types/commerce';
import { VerticalBlueprintVisual } from '../visuals/VerticalBlueprintVisual';
import { useBox } from '../../context/BoxContext';

const CONCISE_VERTICAL_COPY: Record<
  VerticalId,
  { title: string; microSpec: string }
> = {
  seguridad: {
    title: 'Visión IA 4K.',
    microSpec: 'ColorVu F1.0 · Analítica en borde',
  },
  redes: {
    title: 'Backbone 10G.',
    microSpec: 'Switching PoE++ · Cobertura Wi-Fi 7',
  },
  energia: {
    title: 'Energía híbrida.',
    microSpec: 'Inversores MPPT · Bancos LiFePO4',
  },
  computo: {
    title: 'Cómputo NVMe.',
    microSpec: 'Racks de alta densidad · RAID redundante',
  },
  iluminacion: {
    title: 'Óptica LED.',
    microSpec: 'Highbay 175 lm/W · Protección IP66',
  },
  radiocom: {
    title: 'Voz crítica.',
    microSpec: 'Despacho DMR · Encriptación AES-256',
  },
};

export const Section3VerticalsGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { addProduct, lastAddedId, openSearch } = useBox();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.25,
  });

  const barScaleX = useTransform(smoothProgress, [0, 1], [1 / VERTICALS.length, 1]);

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const idx = Math.min(
      VERTICALS.length - 1,
      Math.max(0, Math.floor(latest * VERTICALS.length)),
    );
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const jumpToVertical = (idx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const scrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetProgress = (idx + 0.28) / VERTICALS.length;
    window.scrollTo({
      top: docTop + scrollable * targetProgress,
      behavior: 'smooth',
    });
  };

  const activeVertical = VERTICALS[activeIndex] ?? VERTICALS[0];
  const concise = CONCISE_VERTICAL_COPY[activeVertical.id];

  const heroProduct = useMemo(
    () =>
      CATALOG_PRODUCTS.find((p) => p.verticalId === activeVertical.id) ??
      CATALOG_PRODUCTS[0],
    [activeVertical.id],
  );

  const isAdded = lastAddedId === heroProduct.id;

  return (
    <section
      id="verticales"
      data-theme="light"
      ref={containerRef}
      className="relative h-[500vh] bg-alabaster text-obsidian border-t border-obsidian/[0.06]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[76px] pb-7">
        {/* Top Minimal Header Bar */}
        <div className="max-w-[1320px] w-full mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-obsidian/80">
              06 Especialidades
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <span
              translate="no"
              className="font-mono text-xs text-graphite tabular-nums"
            >
              {activeVertical.index} / 0{VERTICALS.length}
            </span>
            <div className="w-28 sm:w-36 h-[2.5px] rounded-full bg-obsidian/10 overflow-hidden">
              <motion.div
                style={{ scaleX: barScaleX }}
                className="h-full bg-signal origin-left"
              />
            </div>
          </div>
        </div>

        {/* Main Pinned 3-Column Minimal Showcase */}
        <div className="max-w-[1320px] w-full mx-auto px-5 md:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center my-2">
          {/* Left Index Rail (Desktop) + Compact Pills (Mobile) */}
          <div className="lg:col-span-3">
            {/* Mobile compact selector */}
            <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1">
              {VERTICALS.map((v, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => jumpToVertical(idx)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-obsidian text-white'
                        : 'bg-white/70 text-graphite border border-obsidian/10'
                    }`}
                  >
                    {v.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Desktop minimalist vertical rail */}
            <nav
              aria-label="Especialidades de ingeniería"
              className="hidden lg:flex flex-col gap-1.5"
            >
              {VERTICALS.map((v, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => jumpToVertical(idx)}
                    className={`group flex items-center gap-3.5 py-2 text-left transition-all duration-200 cursor-pointer ${
                      active ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <span
                      className={`h-[2px] rounded-full transition-all duration-300 ${
                        active ? 'w-7 bg-signal' : 'w-3 bg-obsidian/30 group-hover:w-5'
                      }`}
                    />
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        active ? 'text-signal font-semibold' : 'text-graphite'
                      }`}
                    >
                      {v.index}
                    </span>
                    <span
                      className={`text-sm tracking-tight ${
                        active ? 'font-semibold text-obsidian' : 'font-medium text-obsidian'
                      }`}
                    >
                      {v.shortLabel}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Centerpiece: Oversized Watermark Numeral + Seamless 4K Hardware Stage */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeVertical.index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32 }}
                aria-hidden="true"
                className="pointer-events-none select-none absolute font-display font-bold text-[170px] sm:text-[230px] xl:text-[260px] leading-none tracking-tighter text-obsidian/[0.045]"
              >
                {activeVertical.index}
              </motion.span>
            </AnimatePresence>

            <VerticalBlueprintVisual
              verticalId={activeVertical.id}
              progress={smoothProgress}
              activeIndex={activeIndex}
            />
          </div>

          {/* Right Minimal Editorial Beat */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVertical.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5 text-center lg:text-left"
              >
                <div className="space-y-1.5">
                  <h2 className="font-sans font-semibold text-3xl sm:text-4xl xl:text-[42px] leading-[1.04] tracking-editorial text-obsidian">
                    {concise.title}
                  </h2>
                  <p className="text-sm text-graphite">{concise.microSpec}</p>
                </div>

                {/* 2 Compact Key Specs */}
                <div className="flex items-center justify-center lg:justify-start gap-6 pt-3 border-t border-obsidian/[0.08]">
                  {activeVertical.keyMetrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}>
                      <p className="text-[10px] uppercase tracking-wider text-graphite">
                        {metric.label}
                      </p>
                      <p className="font-mono text-sm font-semibold text-obsidian mt-0.5 tabular-nums">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Minimal Action Row */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-baseline justify-center lg:justify-start gap-2">
                    <span className="font-mono text-lg font-semibold text-obsidian tabular-nums">
                      {formatMxn(heroProduct.priceMxn)}
                    </span>
                    <span className="font-mono text-[10px] text-graphite uppercase tracking-wider">
                      MXN · Stock real
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                    <Link
                      to={`/especialidad/${activeVertical.id}`}
                      className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-obsidian hover:bg-signal text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>Ver tienda</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => addProduct(heroProduct)}
                      title={`${heroProduct.name} (${formatMxn(heroProduct.priceMxn)})`}
                      className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-mono border transition-colors cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white/80 text-obsidian border-obsidian/15 hover:border-obsidian/40'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>En Box</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-signal" />
                          <span>{heroProduct.sku}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Quiet Whisper */}
        <div className="max-w-[1320px] w-full mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-graphite border-t border-obsidian/[0.06] pt-4">
          <span>Desplaza para recorrer las 6 especialidades</span>
          <div className="flex items-center gap-2 font-mono text-[11px] text-obsidian/70">
            {activeVertical.brands.slice(0, 4).map((brand, i) => (
              <React.Fragment key={brand}>
                {i > 0 && <span className="text-obsidian/25">·</span>}
                <button
                  type="button"
                  onClick={() => openSearch(brand)}
                  className="hover:text-signal transition-colors cursor-pointer"
                >
                  {brand}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
