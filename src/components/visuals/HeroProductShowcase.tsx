import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Layers, Move3d, Plus } from 'lucide-react';
import { CATALOG_PRODUCTS, formatMxn, getProductImage } from '../../data/catalog';
import { useBox } from '../../context/BoxContext';
import { ProductModel3D, resolveProduct3DKind } from './ProductModel3D';

const HERO_FEATURED_SKUS = [
  { sku: 'HK-DS2CD2387G2', tabLabel: 'CCTV 4K' },
  { sku: 'UBQ-USW-PROMAX48', tabLabel: 'Switch 10G' },
  { sku: 'EP-INV-HYB10K', tabLabel: 'Solar 10kW' },
  { sku: 'HYT-HP786-UHF', tabLabel: 'Radio DMR' },
];

export const HeroProductShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { addProduct, lastAddedId, isDistributorPricing } = useBox();

  const featuredProducts = useMemo(
    () =>
      HERO_FEATURED_SKUS.map((entry) => ({
        ...entry,
        product:
          CATALOG_PRODUCTS.find((p) => p.sku === entry.sku) ??
          CATALOG_PRODUCTS[0],
      })),
    [],
  );

  const current = featuredProducts[activeIdx];
  const product = current.product;
  const imgSrc = getProductImage(product);
  const kind3D = resolveProduct3DKind(product.sku, product.verticalId);

  const displayPrice = isDistributorPricing
    ? Math.round(product.priceMxn * (1 - product.distributorDiscountPct / 100))
    : product.priceMxn;
  const isAdded = lastAddedId === product.id;

  return (
    <div className="relative w-full max-w-[580px] mx-auto flex flex-col items-center gap-3.5 select-none">
      {/* Main Apple-Store 3D Product Studio Stage */}
      <div
        className="relative w-full h-[400px] sm:h-[455px] lg:h-[480px] rounded-[32px] border border-obsidian/[0.08] overflow-hidden shadow-[0_24px_60px_rgba(18,18,18,0.06)] flex flex-col justify-between"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, #FFFFFF 0%, #F3F3F6 64%, #EAEAEF 100%)',
        }}
      >
        {/* Top Floating Stock & Brand Pill */}
        <div className="relative z-20 px-5 pt-4 flex items-center justify-between gap-2 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-obsidian/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] font-medium text-obsidian/80">
              EN STOCK · ENVÍO HOY
            </span>
          </div>

          <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-obsidian text-white">
            {product.brand} · {product.sku}
          </span>
        </div>

        {/* Interactive 360° Drag Hint */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="pointer-events-none absolute top-14 left-5 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-obsidian/[0.08] text-[10px] font-mono text-graphite"
            >
              <Move3d className="w-3 h-3 text-signal" />
              <span>Arrastra 360°</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Real-Time Three.js PBR 3D Product */}
        <div className="relative flex-1 min-h-[220px] w-full">
          <ProductModel3D
            kind={kind3D}
            isExploded={isExploded}
            onInteract={() => setHasInteracted(true)}
            fallbackImage={imgSrc}
            fallbackAlt={product.name}
          />
        </div>

        {/* Bottom Floating Frosted Shoppable Buy Bar */}
        <div className="relative z-20 mx-3.5 mb-3.5 p-3.5 sm:p-4 rounded-[22px] bg-white/88 backdrop-blur-xl border border-obsidian/[0.08] shadow-[0_12px_32px_rgba(18,18,18,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <Link
              to={`/producto/${product.sku}`}
              className="text-sm sm:text-[15px] font-semibold text-obsidian hover:text-signal transition-colors truncate block"
            >
              {product.name}
            </Link>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-base sm:text-lg font-semibold text-obsidian tabular-nums">
                {formatMxn(displayPrice)}
              </span>
              <span className="font-mono text-[10px] text-signal font-medium">
                -{product.distributorDiscountPct}% B2B
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/producto/${product.sku}`}
              className="inline-flex items-center gap-1 h-9 px-3.5 rounded-full border border-obsidian/15 text-xs font-medium text-obsidian hover:border-obsidian/40 transition-colors"
            >
              <span>Ver</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => addProduct(product)}
              className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-medium transition-colors cursor-pointer ${isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-signal hover:bg-signal-glow text-white shadow-[0_6px_18px_rgba(234,107,26,0.28)]'
                }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Agregado</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Selector Pills + Live 3D Explode Toggle */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-white border border-obsidian/10 shadow-[0_8px_24px_rgba(18,18,18,0.05)]">
        {featuredProducts.map((item, idx) => {
          const active = idx === activeIdx;
          return (
            <button
              key={item.sku}
              type="button"
              onClick={() => {
                setActiveIdx(idx);
                setHasInteracted(true);
              }}
              className={`relative px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${active ? 'text-white' : 'text-graphite hover:text-obsidian'
                }`}
            >
              {active && (
                <motion.span
                  layoutId="heroProdTab"
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-obsidian"
                />
              )}
              <span className="relative z-10">{item.tabLabel}</span>
            </button>
          );
        })}

        <span className="h-4 w-px bg-obsidian/10 mx-0.5" />

        <button
          type="button"
          onClick={() => {
            setIsExploded((v) => !v);
            setHasInteracted(true);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${isExploded
              ? 'bg-signal text-white'
              : 'bg-alabaster text-obsidian hover:bg-obsidian/[0.08]'
            }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Explosiva 3D</span>
        </button>
      </div>
    </div>
  );
};
