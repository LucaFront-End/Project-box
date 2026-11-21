import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Minus,
  Package,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { CATALOG_PRODUCTS, VERTICALS, formatMxn } from '../data/catalog';
import { getProductExtendedDetails } from '../data/details';
import { ProductOpticalLoupe } from '../components/visuals/ProductOpticalLoupe';
import { useBox } from '../context/BoxContext';

export const ProductDetailPage: React.FC = () => {
  const { sku } = useParams<{ sku: string }>();

  const product = useMemo(
    () =>
      CATALOG_PRODUCTS.find(
        (p) => p.sku.toLowerCase() === (sku ?? '').toLowerCase(),
      ) ?? CATALOG_PRODUCTS[0],
    [sku],
  );

  const vertical = useMemo(
    () => VERTICALS.find((v) => v.id === product.verticalId) ?? VERTICALS[0],
    [product.verticalId],
  );

  const details = useMemo(() => getProductExtendedDetails(product), [product]);

  const {
    addProduct,
    isDistributorPricing,
    setIsDistributorPricing,
    openDrawer,
    openDistributorModal,
  } = useBox();

  const [qty, setQty] = useState(1);
  const [remoteConfig, setRemoteConfig] = useState(false);
  const [expressShip, setExpressShip] = useState(true);
  const [openGroupId, setOpenGroupId] = useState<string>('arch');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const unitPrice = isDistributorPricing
    ? Math.round(
        product.priceMxn * (1 - product.distributorDiscountPct / 100),
      )
    : product.priceMxn;

  const handleAddMany = () => {
    for (let i = 0; i < qty; i++) {
      addProduct(product);
    }
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <main className="bg-white text-obsidian">
      {/* Section A: Sticky Macro Studio Loupe + Configurator Split */}
      <section data-theme="light" className="pt-[92px] pb-20 md:pb-28 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-graphite">
            <Link to="/" className="hover:text-obsidian transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link
              to={`/especialidad/${vertical.id}`}
              className="hover:text-obsidian transition-colors"
            >
              {vertical.shortLabel}
            </Link>
            <span>/</span>
            <span className="text-signal font-medium">{product.sku}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Sticky Visual Stage */}
            <div className="lg:col-span-6 lg:sticky lg:top-[84px]">
              <ProductOpticalLoupe
                src={details.studioImage}
                alt={product.name}
              />
            </div>

            {/* Right Minimal Configurator */}
            <div className="lg:col-span-6 space-y-7">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-alabaster border border-obsidian/[0.08] text-obsidian">
                    {product.sku}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-signal">
                    {product.brand}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {product.stockStatus === 'in_stock'
                      ? 'Stock inmediato GDL'
                      : 'Bajo pedido 48h'}
                  </span>
                </div>

                <h1 className="font-sans font-semibold text-3xl sm:text-4xl xl:text-[42px] leading-[1.08] tracking-editorial text-obsidian">
                  {product.name}
                </h1>

                <p className="text-sm sm:text-base text-graphite leading-relaxed">
                  {product.specs}
                </p>
              </div>

              {/* Price Tier Switcher */}
              <div className="rounded-2xl bg-alabaster border border-obsidian/[0.08] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-graphite">
                      {isDistributorPricing
                        ? `Tarifa Distribuidor B2B (-${product.distributorDiscountPct}%)`
                        : 'Precio Público Sugerido MXN'}
                    </p>
                    <p className="text-3xl sm:text-4xl font-semibold text-obsidian tracking-tight tabular-nums mt-0.5">
                      {formatMxn(unitPrice * qty)}
                    </p>
                  </div>

                  <div className="inline-flex p-1 rounded-full bg-white border border-obsidian/10">
                    <button
                      type="button"
                      onClick={() => setIsDistributorPricing(false)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        !isDistributorPricing
                          ? 'bg-obsidian text-white'
                          : 'text-graphite hover:text-obsidian'
                      }`}
                    >
                      Público
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDistributorPricing(true)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        isDistributorPricing
                          ? 'bg-signal text-white'
                          : 'text-graphite hover:text-obsidian'
                      }`}
                    >
                      Distribuidor B2B
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-obsidian/[0.08] text-xs text-graphite">
                  <span>SPEI, Tarjeta o meses con Mercado Crédito</span>
                  <span className="font-mono text-obsidian font-medium tabular-nums">
                    {formatMxn(unitPrice)} c/u
                  </span>
                </div>
              </div>

              {/* Minimal Service Add-ons */}
              <div className="space-y-2.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-graphite">
                  Configuración de entrega y soporte
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRemoteConfig((v) => !v)}
                    className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                      remoteConfig
                        ? 'border-signal bg-signal/[0.06]'
                        : 'border-obsidian/10 hover:border-obsidian/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-obsidian">
                        Pre-configuración remota
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          remoteConfig ? 'bg-signal' : 'bg-obsidian/20'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-graphite mt-1">
                      Firmware actualizado antes del envío
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpressShip((v) => !v)}
                    className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                      expressShip
                        ? 'border-signal bg-signal/[0.06]'
                        : 'border-obsidian/10 hover:border-obsidian/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-obsidian">
                        Envío asegurado 24–48h
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          expressShip ? 'bg-signal' : 'bg-obsidian/20'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-graphite mt-1">
                      Cobertura total en tránsito nacional
                    </p>
                  </button>
                </div>
              </div>

              {/* Quantity Stepper & Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-3 h-12 px-4 rounded-full bg-alabaster border border-obsidian/10">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Restar unidad"
                    className="p-1 text-graphite hover:text-obsidian cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-sm font-semibold tabular-nums min-w-[20px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Sumar unidad"
                    className="p-1 text-graphite hover:text-obsidian cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddMany}
                  className={`flex-1 min-w-[200px] h-12 px-6 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    addedFeedback
                      ? 'bg-emerald-600 text-white'
                      : 'bg-obsidian hover:bg-signal text-white'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      Agregado a tu Box
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Agregar {qty > 1 ? `${qty}×` : ''} a Mi Box
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={addedFeedback ? openDrawer : openDistributorModal}
                  className="h-12 px-5 rounded-full border border-obsidian/15 text-xs font-medium text-obsidian hover:border-obsidian/40 transition-colors cursor-pointer"
                >
                  {addedFeedback ? 'Abrir Mi Box' : 'Cotizar volumen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: "En la Caja" Architectural Unbox Strip */}
      <section data-theme="dark" className="bg-studio text-white py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
              <Package className="w-3.5 h-3.5" />
              Contenido Verificado
            </span>
            <h2 className="font-sans font-semibold text-2xl sm:text-4xl tracking-editorial">
              En la caja.
            </h2>
            <p className="text-sm text-silver leading-relaxed">
              Empaque original sellado con número de serie trazable y garantía directa de {details.warrantyYears} años en México.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.inTheBox.map((line, i) => (
              <div
                key={line}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3"
              >
                <span className="font-mono text-xs text-signal mt-0.5">
                  0{i + 1}
                </span>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section C: Accordion Technical Datasheet & Complementary Pairings */}
      <section data-theme="light" className="bg-gallery py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-20">
          {/* Technical Accordion */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Ficha de Ingeniería
              </p>
              <h2 className="font-sans font-semibold text-2xl sm:text-3xl tracking-editorial text-obsidian">
                Especificaciones técnicas.
              </h2>
            </div>

            <div className="lg:col-span-8 divide-y divide-obsidian/10 border-t border-b border-obsidian/10">
              {details.groups.map((grp) => {
                const isOpen = openGroupId === grp.id;
                return (
                  <div key={grp.id} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenGroupId(isOpen ? '' : grp.id)}
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-base sm:text-lg font-semibold text-obsidian">
                        {grp.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-graphite transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-signal' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.25 }}
                        className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {grp.items.map((item) => (
                          <div key={item.label} className="space-y-0.5">
                            <p className="text-[11px] uppercase tracking-wider text-graphite">
                              {item.label}
                            </p>
                            <p className="text-sm font-medium text-obsidian">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ecosystem Pairings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-signal" />
                <h3 className="text-lg sm:text-xl font-semibold text-obsidian">
                  Complementa tu arquitectura
                </h3>
              </div>
              <Link
                to={`/especialidad/${vertical.id}`}
                className="text-xs font-semibold text-obsidian hover:text-signal transition-colors"
              >
                Ver especialidad →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {details.pairings.map((pair) => (
                <Link
                  key={pair.id}
                  to={`/producto/${pair.sku}`}
                  className="group rounded-2xl bg-white border border-obsidian/[0.08] hover:border-obsidian/30 p-6 flex flex-col justify-between gap-4 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-alabaster text-obsidian/80">
                        {pair.sku}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-graphite group-hover:text-signal transition-colors" />
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-obsidian group-hover:text-signal transition-colors">
                      {pair.name}
                    </h4>
                    <p className="text-xs text-graphite line-clamp-2">
                      {pair.specs}
                    </p>
                  </div>

                  <p className="font-mono text-sm font-semibold text-obsidian tabular-nums pt-3 border-t border-obsidian/[0.06]">
                    {formatMxn(pair.priceMxn)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
