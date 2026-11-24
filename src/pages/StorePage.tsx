import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Check, Plus, RotateCcw, Search } from 'lucide-react';
import {
  CATALOG_PRODUCTS,
  VERTICALS,
  formatMxn,
  getProductImage,
} from '../data/catalog';
import { VerticalId } from '../types/commerce';
import { useBox } from '../context/BoxContext';

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'b2b_desc';

const TOP_BRANDS = [
  'Todas',
  'Hikvision',
  'Ubiquiti',
  'Dahua',
  'ZKTeco',
  'MikroTik',
  'Kenwood',
  'Epcom Power',
  'Panduit',
  'APC',
];

export const StorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const initialCat = (searchParams.get('cat') as 'all' | VerticalId) || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState<'all' | VerticalId>(initialCat);
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const {
    addProduct,
    lastAddedId,
    isDistributorPricing,
    setIsDistributorPricing,
  } = useBox();

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = CATALOG_PRODUCTS.filter((p) => {
      if (selectedCat !== 'all' && p.verticalId !== selectedCat) return false;
      if (
        selectedBrand !== 'Todas' &&
        !p.brand.toLowerCase().includes(selectedBrand.toLowerCase())
      ) {
        return false;
      }
      if (q) {
        const hit =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });

    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => a.priceMxn - b.priceMxn);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => b.priceMxn - a.priceMxn);
    } else if (sortBy === 'b2b_desc') {
      list = [...list].sort(
        (a, b) => b.distributorDiscountPct - a.distributorDiscountPct,
      );
    }

    return list;
  }, [query, selectedCat, selectedBrand, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCat('all');
    setSelectedBrand('Todas');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <main className="bg-white text-obsidian min-h-screen">
      {/* Top Store Header */}
      <section
        data-theme="light"
        className="bg-alabaster pt-[92px] pb-10 border-b border-obsidian/[0.08]"
      >
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-6">
          <div className="flex items-center gap-2 font-mono text-[11px] text-graphite">
            <Link to="/" className="hover:text-obsidian transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-signal font-medium">Tienda</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-sans font-semibold text-4xl sm:text-5xl tracking-editorial text-obsidian">
                Tienda PROJECT BOX<span className="text-signal">.</span>
              </h1>
              <p className="text-sm text-graphite">
                Mostrando <strong className="text-obsidian">{filteredProducts.length}</strong> equipos destacados · Catálogo listo para sincronización en vivo con +75,000 SKUs SYSCOM.
              </p>
            </div>

            {/* Store Search Input */}
            <div className="w-full lg:w-[440px] rounded-full bg-white border border-obsidian/12 focus-within:border-obsidian/45 px-4 h-11 flex items-center gap-2.5 shadow-sm">
              <Search className="w-4 h-4 text-signal shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar SKU, modelo, marca..."
                className="w-full bg-transparent text-sm text-obsidian placeholder:text-graphite/60 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-xs text-graphite hover:text-obsidian cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter Toolbar */}
      <section
        data-theme="light"
        className="sticky top-[58px] z-30 bg-white/90 backdrop-blur-xl border-b border-obsidian/[0.08]"
      >
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedCat('all')}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  selectedCat === 'all'
                    ? 'bg-obsidian text-white'
                    : 'bg-alabaster text-graphite hover:text-obsidian'
                }`}
              >
                Todas las categorías
              </button>
              {VERTICALS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedCat(v.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    selectedCat === v.id
                      ? 'bg-obsidian text-white'
                      : 'bg-alabaster text-graphite hover:text-obsidian'
                  }`}
                >
                  {v.shortLabel}
                </button>
              ))}
            </div>

            {/* Sort + B2B Price Toggle */}
            <div className="flex items-center gap-2.5 ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Ordenar productos"
                className="h-8 px-3 rounded-full bg-alabaster border border-obsidian/10 text-xs text-obsidian focus:outline-none cursor-pointer"
              >
                <option value="featured">Orden: Destacados</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
                <option value="b2b_desc">Mayor descuento B2B</option>
              </select>

              <button
                type="button"
                onClick={() => setIsDistributorPricing(!isDistributorPricing)}
                className={`h-8 px-3.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isDistributorPricing
                    ? 'bg-signal text-white border-signal'
                    : 'bg-white text-obsidian border-obsidian/15 hover:border-obsidian/40'
                }`}
              >
                {isDistributorPricing ? 'Tarifa B2B' : 'Precio Lista'}
              </button>
            </div>
          </div>

          {/* Brand Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-mono text-[10px] uppercase tracking-wider text-graphite mr-1 shrink-0">
              Marca:
            </span>
            {TOP_BRANDS.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedBrand === brand
                    ? 'bg-signal/15 text-signal border border-signal/35'
                    : 'text-graphite hover:text-obsidian'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section data-theme="light" className="py-12 md:py-16 bg-gallery">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white border border-obsidian/[0.08] py-20 px-6 text-center space-y-4">
              <p className="text-lg font-semibold text-obsidian">
                No encontramos productos con esos filtros.
              </p>
              <p className="text-sm text-graphite">
                Prueba limpiar la búsqueda o seleccionar otra categoría del catálogo.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-obsidian text-white text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const price = isDistributorPricing
                  ? Math.round(
                      product.priceMxn *
                        (1 - product.distributorDiscountPct / 100),
                    )
                  : product.priceMxn;
                const isAdded = lastAddedId === product.id;
                const imgSrc = getProductImage(product);

                return (
                  <article
                    key={product.id}
                    className="group rounded-[24px] bg-white border border-obsidian/[0.08] hover:border-obsidian/25 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_18px_44px_rgba(18,18,18,0.06)]"
                  >
                    <Link
                      to={`/producto/${product.sku}`}
                      className="relative aspect-[4/3] bg-alabaster overflow-hidden flex items-center justify-center p-4"
                    >
                      {product.badge && (
                        <span className="absolute top-3 left-3 z-10 font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-white/90 text-obsidian border border-obsidian/[0.08]">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 border border-obsidian/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-3.5 h-3.5 text-obsidian" />
                      </span>
                      <img
                        src={imgSrc}
                        alt={product.name}
                        width={1600}
                        height={1195}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <Link
                        to={`/producto/${product.sku}`}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-signal">
                            {product.brand}
                          </span>
                          <span className="font-mono text-[10px] text-graphite truncate">
                            {product.sku}
                          </span>
                        </div>
                        <h2 className="text-sm sm:text-[15px] font-semibold text-obsidian group-hover:text-signal transition-colors leading-snug line-clamp-2">
                          {product.name}
                        </h2>
                        <p className="text-xs text-graphite line-clamp-1">
                          {product.specs}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-obsidian/[0.07]">
                        <div>
                          <p className="text-base font-semibold text-obsidian tabular-nums">
                            {formatMxn(price)}
                          </p>
                          <p className="font-mono text-[10px] text-emerald-700">
                            {product.stockStatus === 'in_stock'
                              ? 'En stock hoy'
                              : 'Entrega 48h'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className={`inline-flex items-center gap-1 h-9 px-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
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
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
