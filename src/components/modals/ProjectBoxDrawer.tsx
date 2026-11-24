import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { useBox } from '../../context/BoxContext';
import { formatMxn } from '../../data/catalog';
import { catalogProvider } from '../../services/wixHeadlessAdapter';
import { QuoteSubmissionResult } from '../../types/commerce';

type PaymentMethod = 'SPEI' | 'Tarjeta MSI' | 'Mercado Pago';

export const ProjectBoxDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearBox,
    subtotalMxn,
    distributorTotalMxn,
    isDistributorPricing,
    setIsDistributorPricing,
  } = useBox();

  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tarjeta MSI');
  const [submissionKind, setSubmissionKind] = useState<'order' | 'quote'>('order');
  const [quoteResult, setQuoteResult] = useState<QuoteSubmissionResult | null>(null);

  const activeTotal = isDistributorPricing ? distributorTotalMxn : subtotalMxn;
  const savingsMxn = subtotalMxn - distributorTotalMxn;

  const handleCheckoutOrQuote = async (kind: 'order' | 'quote') => {
    if (items.length === 0) return;
    setSubmissionKind(kind);
    setSubmitting(true);
    const result = await catalogProvider.createBoxQuote(items, isDistributorPricing);
    if (kind === 'order') {
      result.referenceId = result.referenceId.replace('PB-2026-', 'PB-ORD-');
    }
    setQuoteResult(result);
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[70] bg-studio/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-[75] w-full max-w-[460px] bg-white border-l border-obsidian/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-obsidian/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-obsidian text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-signal" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-obsidian">
                    Tu Carrito
                  </h3>
                  <p className="text-[11px] text-graphite">
                    Checkout directo o cotización B2B
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Cerrar carrito"
                className="p-2 rounded-full hover:bg-alabaster text-graphite cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pricing Tier Switch */}
            <div className="px-6 py-3 bg-alabaster/80 border-b border-obsidian/[0.06] flex items-center justify-between">
              <span className="text-xs font-medium text-obsidian">Esquema de tarifa</span>
              <div className="inline-flex rounded-full bg-white p-0.5 border border-obsidian/10">
                <button
                  type="button"
                  onClick={() => setIsDistributorPricing(false)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    !isDistributorPricing
                      ? 'bg-obsidian text-white'
                      : 'text-graphite hover:text-obsidian'
                  }`}
                >
                  Lista Público
                </button>
                <button
                  type="button"
                  onClick={() => setIsDistributorPricing(true)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    isDistributorPricing
                      ? 'bg-signal text-white'
                      : 'text-graphite hover:text-obsidian'
                  }`}
                >
                  Distribuidor B2B
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {quoteResult ? (
                <div className="rounded-2xl bg-alabaster border border-obsidian/10 p-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="text-xs font-mono uppercase tracking-wider text-signal">
                    Folio {quoteResult.referenceId}
                  </p>
                  <h4 className="text-lg font-semibold text-obsidian tracking-tight">
                    {submissionKind === 'order'
                      ? 'Pedido registrado para despacho'
                      : 'Cotización B2B generada'}
                  </h4>
                  <p className="text-xs text-graphite leading-relaxed">
                    {quoteResult.itemCount} equipos por{' '}
                    <strong className="text-obsidian tabular-nums">
                      {formatMxn(quoteResult.estimatedTotalMxn)} MXN
                    </strong>{' '}
                    mediante <strong>{paymentMethod}</strong> con envío asegurado nacional.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuoteResult(null)}
                    className="mt-2 inline-flex items-center justify-center px-5 py-2 rounded-full bg-obsidian text-white text-xs font-medium cursor-pointer"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="text-sm font-medium text-obsidian">
                    Tu carrito está vacío.
                  </p>
                  <p className="text-xs text-graphite">
                    Explora la tienda y agrega equipos o kits listos para envío.
                  </p>
                  <Link
                    to="/tienda"
                    onClick={closeDrawer}
                    className="inline-flex items-center justify-center h-9 px-5 rounded-full bg-obsidian text-white text-xs font-medium"
                  >
                    Ir a la tienda
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const unitPrice = isDistributorPricing
                    ? Math.round(item.priceMxn * (1 - item.distributorDiscountPct / 100))
                    : item.priceMxn;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-obsidian/[0.08] p-4 bg-gallery flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-obsidian/[0.06] text-obsidian/75">
                              {item.sku}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-signal">
                              {item.brand}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-obsidian leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-graphite truncate mt-0.5">
                            {item.specs}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Eliminar ${item.name}`}
                          className="p-1.5 text-graphite hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-obsidian/[0.06]">
                        <div className="inline-flex items-center gap-2 rounded-full border border-obsidian/10 bg-white px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-graphite hover:text-obsidian cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-medium tabular-nums min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-graphite hover:text-obsidian cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-obsidian tabular-nums">
                            {formatMxn(unitPrice * item.quantity)}
                          </p>
                          {isDistributorPricing && (
                            <p className="text-[10px] text-emerald-700 font-mono">
                              -{item.distributorDiscountPct}% aplicado
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && !quoteResult && (
              <div className="p-6 border-t border-obsidian/[0.08] bg-gallery space-y-4">
                {/* Payment Selector */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-graphite">
                    Método de pago
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Tarjeta MSI', 'SPEI', 'Mercado Pago'] as PaymentMethod[]).map(
                      (method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-1.5 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                            paymentMethod === method
                              ? 'bg-obsidian text-white border-obsidian'
                              : 'bg-white text-graphite border-obsidian/10 hover:text-obsidian'
                          }`}
                        >
                          {method}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  {isDistributorPricing && (
                    <div className="flex items-center justify-between text-xs text-emerald-700">
                      <span>Ahorro Distribuidor</span>
                      <span className="font-mono font-medium tabular-nums">
                        -{formatMxn(savingsMxn)} MXN
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-graphite">Total estimado</span>
                    <span className="text-lg font-semibold text-obsidian tabular-nums">
                      {formatMxn(activeTotal)} MXN
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-graphite">
                  <ShieldCheck className="w-3.5 h-3.5 text-signal shrink-0" />
                  <span>Envío asegurado a todo México · Facturación CFDI</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearBox}
                    title="Vaciar carrito"
                    className="h-11 px-3.5 rounded-full border border-obsidian/15 text-xs font-medium text-graphite hover:text-obsidian cursor-pointer"
                  >
                    Vaciar
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleCheckoutOrQuote('quote')}
                    className="h-11 px-4 rounded-full border border-obsidian/20 bg-white hover:border-obsidian text-obsidian text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cotizar B2B
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleCheckoutOrQuote('order')}
                    className="flex-1 h-11 rounded-full bg-signal hover:bg-signal-glow text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    {submitting ? 'Procesando...' : 'Finalizar compra'}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
