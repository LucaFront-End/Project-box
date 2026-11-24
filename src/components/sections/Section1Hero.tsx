import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Move3d,
  Plus,
} from 'lucide-react';
import { CATALOG_PRODUCTS, formatMxn, getProductImage } from '../../data/catalog';
import { useBox } from '../../context/BoxContext';
import {
  ProductSlider3D,
  resolveProduct3DKind,
} from '../visuals/ProductSlider3D';

interface HeroSlideConfig {
  sku: string;
  headline: string;
  microSpec: string;
}

const HERO_SLIDES: HeroSlideConfig[] = [
  {
    sku: 'HK-DS2CD2387G2',
    headline: 'Cámara 4K ColorVu.',
    microSpec: 'Visión nocturna F1.0 a color real · Analítica IA AcuSense · PoE IP67',
  },
  {
    sku: 'UBQ-USW-PROMAX48',
    headline: 'Switch 48P 10G.',
    microSpec: 'Puertos Etherlighting 2.5GbE · 720W PoE++ · 4x 10G SFP+ redundantes',
  },
  {
    sku: 'EP-INV-HYB10K',
    headline: 'Inversor Solar 10kW.',
    microSpec: 'Híbrido bifásico Split-Phase · Doble MPPT · Compatible LiFePO4 48V',
  },
  {
    sku: 'HYT-HP786-UHF',
    headline: 'Radio Digital DMR.',
    microSpec: 'Audio IA con supresión de viento · Sumergible IP68 · Autonomía 24 h',
  },
];

const HERO_TRUST_BAR = [
  { metric: 'Envío hoy', label: 'Despacho asegurado desde GDL & CDMX' },
  { metric: 'Precios B2B', label: 'Descuento preferencial a integradores' },
  { metric: '100,000+ SKUs', label: 'Catálogo mayorista con stock en vivo' },
  { metric: 'Garantía MX', label: 'Soporte técnico y póliza oficial directa' },
];

export const Section1Hero: React.FC = () => {
  const { addProduct, isDistributorPricing, lastAddedId } = useBox();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const slides = useMemo(() => {
    return HERO_SLIDES.map((cfg) => {
      const product =
        CATALOG_PRODUCTS.find((p) => p.sku === cfg.sku) || CATALOG_PRODUCTS[0];
      return {
        ...cfg,
        product,
        kind: resolveProduct3DKind(product.sku, product.verticalId),
      };
    });
  }, []);

  const current = slides[activeIndex];
  const currentPrice = isDistributorPricing
    ? Math.round(
      current.product.priceMxn *
      (1 - current.product.distributorDiscountPct / 100)
    )
    : current.product.priceMxn;

  const isAdded = lastAddedId === current.product.id;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  const slideLabel = `${String(activeIndex + 1).padStart(2, '0')} / ${String(
    slides.length
  ).padStart(2, '0')}`;

  return (
    <section
      id="ecosistema"
      data-theme="light"
      className="relative bg-white overflow-x-clip min-h-[calc(100vh-58px)] flex flex-col justify-between pt-[92px] pb-12 lg:pt-[112px] lg:pb-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8 flex-1 py-4 lg:py-8">
          {/* Left: Minimalist E-Commerce Product Specs & CTAs */}
          <div className="lg:col-span-5 space-y-7 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.product.sku}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Kicker */}
                <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.16em] text-graphite">
                  <span className="text-obsidian font-semibold">{slideLabel}</span>
                  <span>·</span>
                  <span className="text-signal font-semibold">{current.product.brand}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    EN STOCK
                  </span>
                </div>

                {/* Display Headline */}
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-[54px] lg:text-[60px] font-semibold tracking-tight text-obsidian leading-[1.01]">
                    {current.headline}
                  </h1>
                  <p className="text-base lg:text-[17px] text-graphite leading-relaxed max-w-[44ch]">
                    {current.microSpec}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl sm:text-[38px] font-semibold text-obsidian tabular-nums tracking-tight">
                    {formatMxn(currentPrice)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-mono font-medium text-emerald-800">
                    -{current.product.distributorDiscountPct}% B2B
                  </span>
                </div>

                {/* Essential CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => addProduct(current.product)}
                    className={`inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full text-sm font-medium transition-all cursor-pointer ${isAdded
                        ? 'bg-emerald-600 text-white shadow-[0_8px_24px_rgba(5,150,105,0.28)]'
                        : 'bg-signal hover:bg-signal-glow text-white shadow-[0_10px_28px_rgba(234,107,26,0.26)]'
                      }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Agregado</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Agregar al carrito</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/producto/${current.product.sku}`}
                    className="inline-flex items-center gap-1.5 h-[52px] px-6 rounded-full border border-obsidian/15 hover:border-obsidian/40 text-sm font-medium text-obsidian transition-colors"
                  >
                    <span>Ver ficha</span>
                    <ArrowUpRight className="w-4 h-4 text-graphite" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Minimalist Slider Controls + Quick Catalog Link */}
            <div className="pt-6 border-t border-obsidian/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Producto anterior"
                    className="w-10 h-10 rounded-full border border-obsidian/15 hover:border-obsidian/45 flex items-center justify-center text-obsidian transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Siguiente producto"
                    className="w-10 h-10 rounded-full border border-obsidian/15 hover:border-obsidian/45 flex items-center justify-center text-obsidian transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Indicator Tabs */}
                <div className="flex items-center gap-1.5 pl-1">
                  {slides.map((s, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={s.sku}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Ver ${s.headline}`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${active
                            ? 'w-7 bg-obsidian'
                            : 'w-2 bg-obsidian/20 hover:bg-obsidian/40'
                          }`}
                      />
                    );
                  })}
                </div>
              </div>

              <Link
                to="/tienda"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-graphite hover:text-obsidian transition-colors group"
              >
                <span>Explorar tienda completa</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Spacious Frameless Floating 3D Slider Stage */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 h-[440px] sm:h-[540px] lg:h-[640px] xl:h-[690px]">
            <ProductSlider3D
              kind={current.kind}
              slideKey={`${current.product.sku}-${activeIndex}`}
              onInteract={() => setHasInteracted(true)}
              fallbackImage={getProductImage(current.product)}
              fallbackAlt={current.product.name}
            />

            {/* Subtle vanishing 360 drag prompt */}
            <AnimatePresence>
              {!hasInteracted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 text-[11px] font-mono text-graphite/75"
                >
                  <Move3d className="w-3.5 h-3.5 text-signal" />
                  <span>Arrastra 360°</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hairline E-Commerce Trust Bar */}
        <div className="mt-10 pt-7 border-t border-obsidian/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-6">
          {HERO_TRUST_BAR.map((item) => (
            <div key={item.metric} className="space-y-0.5">
              <p className="text-xs font-semibold text-obsidian tracking-tight">
                {item.metric}
              </p>
              <p className="text-xs text-graphite">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
