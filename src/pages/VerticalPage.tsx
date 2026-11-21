import React, { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react';
import { CATALOG_PRODUCTS, VERTICALS, formatMxn } from '../data/catalog';
import { VERTICAL_HERO_META } from '../data/details';
import { VerticalId } from '../types/commerce';
import { VerticalPerformanceLab } from '../components/visuals/VerticalPerformanceLab';
import { useBox } from '../context/BoxContext';

export const VerticalPage: React.FC = () => {
  const { verticalId } = useParams<{ verticalId: string }>();
  const heroRef = useRef<HTMLDivElement>(null);

  const vertical = useMemo(
    () => VERTICALS.find((v) => v.id === verticalId) ?? VERTICALS[0],
    [verticalId],
  );
  const meta = VERTICAL_HERO_META[vertical.id as VerticalId];

  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const {
    addProduct,
    lastAddedId,
    isDistributorPricing,
    setIsDistributorPricing,
    openSearch,
  } = useBox();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 28]);

  const products = useMemo(() => {
    const base = CATALOG_PRODUCTS.filter((p) => p.verticalId === vertical.id);
    if (selectedBrand === 'Todas') return base;
    return base.filter(
      (p) => p.brand.toLowerCase() === selectedBrand.toLowerCase(),
    );
  }, [vertical.id, selectedBrand]);

  const brandsInVertical = useMemo(() => {
    const unique = Array.from(
      new Set(
        CATALOG_PRODUCTS.filter((p) => p.verticalId === vertical.id).map(
          (p) => p.brand,
        ),
      ),
    );
    return ['Todas', ...unique];
  }, [vertical.id]);

  return (
    <main className="bg-white text-obsidian">
      {/* Section A: Minimalist Scroll-Parallax Specialty Hero */}
      <section
        ref={heroRef}
        data-theme="light"
        className="relative bg-alabaster pt-[92px] pb-16 md:pb-24 overflow-hidden border-b border-obsidian/[0.06]"
      >
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-12">
          {/* Top Breadcrumb + Quick Specialty Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-graphite">
              <Link to="/" className="hover:text-obsidian transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <span>Especialidades</span>
              <span>/</span>
              <span className="text-signal font-medium">{vertical.shortLabel}</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {VERTICALS.map((v) => {
                const active = v.id === vertical.id;
                return (
                  <Link
                    key={v.id}
                    to={`/especialidad/${v.id}`}
                    onClick={() => setSelectedBrand('Todas')}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-obsidian text-white'
                        : 'bg-white/80 text-graphite border border-obsidian/[0.08] hover:text-obsidian'
                    }`}
                  >
                    {v.shortLabel}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Editorial Title + Parallax 4K Visual Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                {vertical.index} · {vertical.label}
              </span>

              <h1 className="font-sans font-semibold text-4xl sm:text-5xl xl:text-[62px] leading-[1.03] tracking-editorial text-obsidian">
                {meta.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-graphite leading-relaxed max-w-[500px]">
                {meta.heroSub}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-obsidian/[0.08]">
                {vertical.keyMetrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-[10px] uppercase tracking-wider text-graphite">
                      {m.label}
                    </p>
                    <p className="font-mono text-sm sm:text-base font-semibold text-obsidian mt-0.5 tabular-nums">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative h-[300px] sm:h-[380px] flex items-center justify-center">
              <motion.div
                style={{
                  scale: imageScale,
                  y: imageY,
                  maskImage: 'radial-gradient(closest-side, black 75%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(closest-side, black 75%, transparent 100%)',
                }}
                className="relative w-full max-w-[540px] h-full flex items-center justify-center overflow-hidden"
              >
                <img
                  src={meta.src}
                  alt={vertical.label}
                  width={1600}
                  height={1195}
                  className="w-full h-full object-contain pointer-events-none"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: 'inset 0 0 40px 20px #F5F5F7' }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Interactive Engineering Performance Lab */}
      <section data-theme="dark" className="bg-studio text-white py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <VerticalPerformanceLab verticalId={vertical.id} />
        </div>
      </section>

      {/* Section C: Minimalist Apple-Store Catalog + Pricing Tier Switch */}
      <section data-theme="light" className="bg-white py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Hardware Certificado
              </p>
              <h2 className="font-sans font-semibold text-3xl sm:text-4xl tracking-editorial text-obsidian">
                Soluciones en {vertical.shortLabel}.
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Brand filter pills */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-alabaster border border-obsidian/[0.08]">
                {brandsInVertical.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-obsidian text-white'
                        : 'text-graphite hover:text-obsidian'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Distributor Toggle */}
              <button
                type="button"
                onClick={() => setIsDistributorPricing(!isDistributorPricing)}
                className={`h-9 px-4 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isDistributorPricing
                    ? 'bg-signal text-white border-signal'
                    : 'bg-white text-obsidian border-obsidian/15 hover:border-obsidian/40'
                }`}
              >
                {isDistributorPricing ? 'Tarifa B2B Activa' : 'Ver Tarifa B2B'}
              </button>
            </div>
          </div>

          {/* Clean Hairline Product Rows */}
          <div className="divide-y divide-obsidian/[0.08] border-t border-b border-obsidian/[0.08]">
            {products.map((product) => {
              const displayPrice = isDistributorPricing
                ? Math.round(
                    product.priceMxn * (1 - product.distributorDiscountPct / 100),
                  )
                : product.priceMxn;
              const isAdded = lastAddedId === product.id;

              return (
                <div
                  key={product.id}
                  className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
                >
                  <Link
                    to={`/producto/${product.sku}`}
                    className="min-w-0 flex-1 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-alabaster text-obsidian/80">
                        {product.sku}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-signal">
                        {product.brand}
                      </span>
                      {product.badge && (
                        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-obsidian/[0.05] text-obsidian">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-xl font-semibold text-obsidian group-hover:text-signal transition-colors flex items-center gap-2">
                      <span>{product.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-signal" />
                    </h3>

                    <p className="text-xs sm:text-sm text-graphite">{product.specs}</p>
                  </Link>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    <div className="sm:text-right">
                      <p className="text-base sm:text-lg font-semibold text-obsidian tabular-nums">
                        {formatMxn(displayPrice)}
                      </p>
                      <p className="font-mono text-[10px] text-graphite">
                        {isDistributorPricing
                          ? `-${product.distributorDiscountPct}% aplicado`
                          : `-${product.distributorDiscountPct}% Distribuidor`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/producto/${product.sku}`}
                        className="inline-flex items-center h-10 px-4 rounded-full border border-obsidian/15 text-xs font-medium text-obsidian hover:border-obsidian/40 transition-colors"
                      >
                        Ficha técnica
                      </Link>
                      <button
                        type="button"
                        onClick={() => addProduct(product)}
                        className={`inline-flex items-center gap-1.5 h-10 px-5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-obsidian hover:bg-signal text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Listo
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Box
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-graphite">
              ¿Necesitas otro modelo de {vertical.brands.join(', ')}?
            </span>
            <button
              type="button"
              onClick={() => openSearch(vertical.brands[0])}
              className="text-xs font-semibold text-obsidian hover:text-signal transition-colors cursor-pointer"
            >
              Buscar en +100,000 SKUs →
            </button>
          </div>
        </div>
      </section>

      {/* Section D: Minimalist Next Specialty Editorial Bridge */}
      <section
        data-theme="light"
        className="bg-alabaster border-t border-obsidian/[0.08] py-16 md:py-20"
      >
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <Link
            to={`/especialidad/${meta.nextId}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Siguiente Especialidad
              </p>
              <h3 className="font-sans font-semibold text-2xl sm:text-4xl tracking-editorial text-obsidian group-hover:text-signal transition-colors">
                {meta.nextLabel}
              </h3>
            </div>
            <span className="w-12 h-12 rounded-full bg-obsidian text-white group-hover:bg-signal flex items-center justify-center transition-colors shrink-0">
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
};
