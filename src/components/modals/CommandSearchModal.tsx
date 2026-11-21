import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, Search, X } from 'lucide-react';
import { CATALOG_PRODUCTS, PARTNER_BRANDS, formatMxn } from '../../data/catalog';
import { useBox } from '../../context/BoxContext';

export const CommandSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    searchInitialQuery,
    closeSearch,
    addProduct,
    lastAddedId,
    openDrawer,
  } = useBox();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setQuery(searchInitialQuery);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isSearchOpen, searchInitialQuery]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG_PRODUCTS.slice(0, 8);
    return CATALOG_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        p.verticalId.toLowerCase().includes(q),
    );
  }, [query]);

  const quickBrands = PARTNER_BRANDS.slice(0, 6);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-studio/60 backdrop-blur-md flex items-start justify-center pt-[10vh] px-4"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[720px] rounded-3xl bg-white border border-obsidian/10 shadow-[0_32px_90px_rgba(0,0,0,0.28)] overflow-hidden"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-obsidian/[0.08]">
              <Search className="w-4 h-4 text-signal shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar SKU, modelo, marca o vertical (ej. Ubiquiti, 4K, LiFePO4, Wi-Fi 7)..."
                className="w-full text-[15px] text-obsidian placeholder:text-graphite/60 bg-transparent focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-graphite hover:text-obsidian px-2 py-1 rounded-full bg-alabaster"
                >
                  Limpiar
                </button>
              )}
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Cerrar búsqueda"
                className="p-1.5 rounded-full hover:bg-alabaster text-graphite"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Brand Chips */}
            <div className="px-5 py-3 bg-alabaster/70 border-b border-obsidian/[0.06] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-mono uppercase tracking-wider text-graphite shrink-0">
                Marcas:
              </span>
              {quickBrands.map((brand) => {
                const active = query.toLowerCase() === brand.name.toLowerCase();
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setQuery(active ? '' : brand.name)}
                    className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                      active
                        ? 'bg-obsidian text-white'
                        : 'bg-white text-obsidian/75 border border-obsidian/10 hover:border-obsidian/30'
                    }`}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>

            {/* Results */}
            <div className="max-h-[54vh] overflow-y-auto divide-y divide-obsidian/[0.06]">
              {filteredProducts.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <p className="text-sm font-medium text-obsidian">
                    Sin coincidencias en el catálogo muestra para “{query}”.
                  </p>
                  <p className="text-xs text-graphite mt-1">
                    En Etapa 2 este buscador consulta los +100,000 SKUs vía Wix Headless Search.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isAdded = lastAddedId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-alabaster/60 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          closeSearch();
                          navigate(`/producto/${product.sku}`);
                        }}
                        className="min-w-0 flex-1 text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-obsidian/[0.05] text-obsidian/75">
                            {product.sku}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-signal">
                            {product.brand}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-obsidian group-hover:text-signal transition-colors truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-graphite truncate mt-0.5">
                          {product.specs}
                        </p>
                      </button>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-obsidian tabular-nums">
                            {formatMxn(product.priceMxn)}
                          </p>
                          <p className="text-[10px] text-graphite font-mono">
                            -{product.distributorDiscountPct}% B2B
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium transition-colors ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-obsidian text-white hover:bg-signal'
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
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-alabaster border-t border-obsidian/[0.08] flex items-center justify-between text-xs text-graphite">
              <span>Mostrando {filteredProducts.length} soluciones · Envío asegurado nacional</span>
              <button
                type="button"
                onClick={() => {
                  closeSearch();
                  openDrawer();
                }}
                className="font-medium text-obsidian hover:text-signal transition-colors"
              >
                Ver mi Box →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
