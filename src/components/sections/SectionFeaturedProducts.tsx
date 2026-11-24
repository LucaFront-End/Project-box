import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Plus } from 'lucide-react';
import {
  CATALOG_PRODUCTS,
  formatMxn,
  getProductImage,
} from '../../data/catalog';
import { CatalogProduct } from '../../types/commerce';
import { useBox } from '../../context/BoxContext';

const OFFER_SKUS = [
  'HK-DS2CD2387G2',
  'UBQ-U7-PROMAX',
  'EP-PANEL-555W',
  'ZKT-SPEEDFACE-V5L',
  'WLD-HB200-PRO',
  'UBQ-LITEBEAM-5AC',
  'KEN-NX-1300DUK',
];

const BESTSELLER_SKUS = [
  'UBQ-USW-PROMAX48',
  'EP-INV-HYB10K',
  'SYN-RS1221RP',
  'HYT-HP786-UHF',
  'DH-NVR5216-16P-AI',
  'MT-CCR2116-12G',
  'PYL-US5000-48V',
];

function resolveProductsBySku(skus: string[]): CatalogProduct[] {
  return skus
    .map((sku) => CATALOG_PRODUCTS.find((p) => p.sku === sku))
    .filter((p): p is CatalogProduct => Boolean(p));
}

interface ProductMarqueeCardProps {
  product: CatalogProduct;
  mode: 'offer' | 'bestseller';
  isDistributorPricing: boolean;
  isAdded: boolean;
  onAdd: (product: CatalogProduct) => void;
}

const ProductMarqueeCard: React.FC<ProductMarqueeCardProps> = ({
  product,
  mode,
  isDistributorPricing,
  isAdded,
  onAdd,
}) => {
  const effectiveDiscountPct =
    mode === 'offer'
      ? Math.min(35, product.distributorDiscountPct + (isDistributorPricing ? 4 : 0))
      : isDistributorPricing
        ? product.distributorDiscountPct
        : 0;

  const finalPrice =
    effectiveDiscountPct > 0
      ? Math.round(product.priceMxn * (1 - effectiveDiscountPct / 100))
      : product.priceMxn;

  return (
    <article className="shrink-0 w-[290px] sm:w-[325px] rounded-[26px] bg-white border border-obsidian/[0.07] hover:border-obsidian/20 hover:shadow-[0_18px_40px_rgba(18,18,18,0.06)] transition-all duration-300 p-4 flex flex-col justify-between gap-4 group select-none">
      {/* Studio Image Stage */}
      <div className="space-y-3">
        <div className="relative h-[168px] rounded-[18px] bg-alabaster/70 overflow-hidden">
          <img
            src={getProductImage(product)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />

          {/* Top-Left Minimalist Badge */}
          {mode === 'offer' ? (
            <span className="absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-1 rounded-full bg-signal text-white font-mono text-[10px] font-semibold tracking-wide shadow-sm">
              -{effectiveDiscountPct}%
            </span>
          ) : (
            <span className="absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-obsidian border border-obsidian/[0.08] font-mono text-[10px] font-medium tracking-wide">
              {product.badge ?? 'Top Ventas'}
            </span>
          )}

          {/* Top-Right Quick Spec Sheet Link */}
          <Link
            to={`/producto/${product.sku}`}
            aria-label={`Ver ficha técnica de ${product.name}`}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-obsidian/[0.08] flex items-center justify-center text-obsidian hover:bg-obsidian hover:text-white transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metadata */}
        <div className="px-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.14em]">
            <span className="text-signal font-semibold">{product.brand}</span>
            <span className="text-graphite/75 truncate">{product.sku}</span>
          </div>

          <Link
            to={`/producto/${product.sku}`}
            className="block text-[14px] sm:text-[15px] font-semibold text-obsidian leading-snug line-clamp-2 hover:text-signal transition-colors"
          >
            {product.name}
          </Link>

          <p className="text-xs text-graphite line-clamp-1">{product.specs}</p>
        </div>
      </div>

      {/* Pricing & CTA Footer */}
      <div className="px-1 pt-3 border-t border-obsidian/[0.06] flex items-end justify-between gap-2">
        <div className="min-w-0">
          {mode === 'offer' ? (
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-[17px] font-semibold text-obsidian tabular-nums">
                {formatMxn(finalPrice)}
              </span>
              <span className="text-[11px] text-graphite/70 line-through tabular-nums">
                {formatMxn(product.priceMxn)}
              </span>
            </div>
          ) : (
            <p className="text-base sm:text-[17px] font-semibold text-obsidian tabular-nums">
              {formatMxn(finalPrice)}
            </p>
          )}

          <p className="font-mono text-[10px] text-emerald-700 truncate">
            {isDistributorPricing
              ? 'Tarifa B2B activa'
              : mode === 'offer'
                ? 'Precio especial web'
                : `-${product.distributorDiscountPct}% B2B · Stock hoy`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(product)}
          className={`shrink-0 inline-flex items-center gap-1 h-9 px-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-obsidian hover:bg-signal text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Listo</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

const FrostedEdgeScrims: React.FC = () => (
  <>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40 lg:w-52 z-20 backdrop-blur-[5px]"
      style={{
        background:
          'linear-gradient(to right, rgba(251,251,253,1) 16%, rgba(251,251,253,0.75) 55%, rgba(251,251,253,0) 100%)',
        maskImage: 'linear-gradient(to right, black 35%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, black 35%, transparent 100%)',
      }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40 lg:w-52 z-20 backdrop-blur-[5px]"
      style={{
        background:
          'linear-gradient(to left, rgba(251,251,253,1) 16%, rgba(251,251,253,0.75) 55%, rgba(251,251,253,0) 100%)',
        maskImage: 'linear-gradient(to left, black 35%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to left, black 35%, transparent 100%)',
      }}
    />
  </>
);

const TRACK_MASK_STYLE: React.CSSProperties = {
  maskImage:
    'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
};

export const SectionFeaturedProducts: React.FC = () => {
  const {
    addProduct,
    lastAddedId,
    isDistributorPricing,
    setIsDistributorPricing,
  } = useBox();

  const offerProducts = useMemo(() => resolveProductsBySku(OFFER_SKUS), []);
  const bestsellerProducts = useMemo(
    () => resolveProductsBySku(BESTSELLER_SKUS),
    [],
  );

  return (
    <section
      id="destacados"
      data-theme="light"
      className="relative bg-gallery text-obsidian py-24 md:py-32 overflow-hidden border-t border-obsidian/[0.06]"
    >
      {/* Editorial Storefront Header */}
      <div className="max-w-[1420px] mx-auto px-6 lg:px-10 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
              Catálogo en Movimiento · Stock en Vivo
            </p>
            <h2 className="font-sans font-semibold text-3xl sm:text-4xl xl:text-[46px] leading-[1.05] tracking-editorial text-obsidian">
              Destacados de la tienda<span className="text-signal">.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDistributorPricing(!isDistributorPricing)}
              className={`h-10 px-4 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                isDistributorPricing
                  ? 'bg-signal text-white border-signal'
                  : 'bg-white text-obsidian border-obsidian/15 hover:border-obsidian/40'
              }`}
            >
              {isDistributorPricing ? 'Tarifa B2B activa' : 'Ver tarifa B2B'}
            </button>

            <Link
              to="/tienda"
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-obsidian hover:bg-signal text-white text-xs font-medium transition-colors"
            >
              <span>Explorar tienda completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Dual Infinite Opposite-Direction Product Carousels */}
      <div className="space-y-12">
        {/* Carousel 1: Ofertas de la semana (Scrolls Left) */}
        <div>
          <div className="max-w-[1420px] mx-auto px-6 lg:px-10 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              <h3 className="text-sm font-semibold text-obsidian tracking-tight">
                Ofertas de la semana
              </h3>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-graphite hidden sm:inline">
              Descuentos directos en stock
            </span>
          </div>

          <div className="relative">
            <FrostedEdgeScrims />
            <div style={TRACK_MASK_STYLE}>
              <div className="w-max flex items-stretch gap-5 pr-5 animate-marquee-slow-left hover:[animation-play-state:paused]">
                {[...offerProducts, ...offerProducts].map((product, idx) => (
                  <ProductMarqueeCard
                    key={`offer-${product.id}-${idx}`}
                    product={product}
                    mode="offer"
                    isDistributorPricing={isDistributorPricing}
                    isAdded={lastAddedId === product.id}
                    onAdd={addProduct}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel 2: Más vendidos · Despacho hoy (Scrolls Right) */}
        <div>
          <div className="max-w-[1420px] mx-auto px-6 lg:px-10 mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-obsidian" />
              <h3 className="text-sm font-semibold text-obsidian tracking-tight">
                Más vendidos · Despacho hoy
              </h3>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-graphite hidden sm:inline">
              Favoritos de integradores
            </span>
          </div>

          <div className="relative">
            <FrostedEdgeScrims />
            <div style={TRACK_MASK_STYLE}>
              <div className="w-max flex items-stretch gap-5 pr-5 animate-marquee-slow-right hover:[animation-play-state:paused]">
                {[...bestsellerProducts, ...bestsellerProducts].map(
                  (product, idx) => (
                    <ProductMarqueeCard
                      key={`best-${product.id}-${idx}`}
                      product={product}
                      mode="bestseller"
                      isDistributorPricing={isDistributorPricing}
                      isAdded={lastAddedId === product.id}
                      onAdd={addProduct}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
