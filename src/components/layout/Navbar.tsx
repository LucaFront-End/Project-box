import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrandLogo } from '../ui/BrandLogo';
import { useBox } from '../../context/BoxContext';
import { VERTICALS } from '../../data/catalog';

const SECTION_LINKS = [
  { to: '/#arquitectura', label: 'Explorar' },
  { to: '/#sistemas', label: 'Kits' },
  { to: '/#ecosistema', label: 'Marcas' },
  { to: '/#b2b', label: 'Mayoreo' },
];

export const Navbar: React.FC = () => {
  const { itemCount, openDrawer, openSearch, openDistributorModal } = useBox();
  const location = useLocation();
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [verticalMenuOpen, setVerticalMenuOpen] = useState(false);

  useEffect(() => {
    const checkThemeAtTop = () => {
      setScrolled(window.scrollY > 18);
      const themedSections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-theme]'),
      );
      const probeY = 48;
      let active: 'light' | 'dark' = 'light';
      for (const el of themedSections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          const themeAttr = el.getAttribute('data-theme');
          if (themeAttr === 'dark' || themeAttr === 'light') {
            active = themeAttr;
          }
          break;
        }
      }
      setNavTheme(active);
    };

    checkThemeAtTop();
    const timer = window.setTimeout(checkThemeAtTop, 60);
    window.addEventListener('scroll', checkThemeAtTop, { passive: true });
    window.addEventListener('resize', checkThemeAtTop);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', checkThemeAtTop);
      window.removeEventListener('resize', checkThemeAtTop);
    };
  }, [location.pathname, location.hash]);

  const isDark = navTheme === 'dark';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[58px] transition-colors duration-300 backdrop-blur-xl ${isDark
            ? 'bg-studio/75 border-b border-white/10 text-white'
            : scrolled
              ? 'bg-white/80 border-b border-obsidian/[0.08] text-obsidian'
              : 'bg-white/60 border-b border-transparent text-obsidian'
          }`}
      >
        <div className="max-w-[1320px] mx-auto h-full px-5 md:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            aria-label="PROJECT BOX Inicio"
            className="shrink-0 focus:outline-none"
          >
            <BrandLogo variant={isDark ? 'light' : 'dark'} size="md" />
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navegación principal">
            <Link
              to="/tienda"
              className={`text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 ${location.pathname === '/tienda'
                  ? 'text-signal font-semibold'
                  : isDark
                    ? 'text-white/80 hover:text-white'
                    : 'text-obsidian/80 hover:text-obsidian'
                }`}
            >
              Tienda
            </Link>

            {/* Categorías Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setVerticalMenuOpen(true)}
              onMouseLeave={() => setVerticalMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setVerticalMenuOpen((v) => !v)}
                className={`inline-flex items-center gap-1 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 cursor-pointer ${isDark
                    ? 'text-white/70 hover:text-white'
                    : 'text-obsidian/70 hover:text-obsidian'
                  }`}
              >
                <span>Categorías</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${verticalMenuOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              <AnimatePresence>
                {verticalMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[340px] z-50`}
                  >
                    <div
                      className={`rounded-2xl p-2 border shadow-2xl backdrop-blur-2xl ${isDark
                          ? 'bg-obsidian/95 border-white/15 text-white'
                          : 'bg-white/95 border-obsidian/10 text-obsidian'
                        }`}
                    >
                      {VERTICALS.map((v) => (
                        <Link
                          key={v.id}
                          to={`/especialidad/${v.id}`}
                          onClick={() => setVerticalMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors ${isDark
                              ? 'hover:bg-white/[0.08]'
                              : 'hover:bg-alabaster'
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-signal">
                              {v.index}
                            </span>
                            <span className="font-medium">{v.shortLabel}</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono ${isDark ? 'text-silver' : 'text-graphite'
                              }`}
                          >
                            {v.brands[0]}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {SECTION_LINKS.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 ${isDark
                    ? 'text-white/70 hover:text-white'
                    : 'text-obsidian/70 hover:text-obsidian'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openSearch('')}
              className={`hidden sm:inline-flex items-center gap-2.5 h-8 px-3 rounded-full text-[12px] transition-colors border cursor-pointer ${isDark
                  ? 'bg-white/[0.06] border-white/15 text-white/75 hover:text-white hover:border-white/30'
                  : 'bg-obsidian/[0.04] border-obsidian/10 text-obsidian/70 hover:text-obsidian hover:border-obsidian/25'
                }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar SKU</span>
              <kbd
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-white/10 text-white/60' : 'bg-obsidian/[0.06] text-obsidian/50'
                  }`}
              >
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={openDrawer}
              aria-label="Abrir Carrito"
              className={`relative inline-flex items-center gap-2 h-8 px-3 rounded-full text-[12px] font-medium transition-colors border cursor-pointer ${isDark
                  ? 'bg-white/[0.06] border-white/15 text-white hover:bg-white/[0.12]'
                  : 'bg-obsidian/[0.04] border-obsidian/10 text-obsidian hover:bg-obsidian/[0.08]'
                }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-signal" />
              <span className="hidden md:inline">Carrito</span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-signal text-white font-mono text-[10px] font-medium tabular-nums">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={openDistributorModal}
              className={`hidden sm:inline-flex items-center h-8 px-3.5 rounded-full text-[12px] font-medium transition-all cursor-pointer ${isDark
                  ? 'bg-white text-obsidian hover:bg-alabaster'
                  : 'bg-obsidian text-white hover:bg-[#242428]'
                }`}
            >
              Distribuidores
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menú"
              className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className={`fixed top-[58px] left-0 right-0 z-40 p-6 backdrop-blur-2xl border-b lg:hidden max-h-[82vh] overflow-y-auto ${isDark
                ? 'bg-studio/95 border-white/10 text-white'
                : 'bg-white/95 border-obsidian/10 text-obsidian'
              }`}
          >
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
                Categorías
              </p>
              <div className="grid grid-cols-2 gap-2 pb-2">
                {VERTICALS.map((v) => (
                  <Link
                    key={v.id}
                    to={`/especialidad/${v.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl border border-current/10 text-xs font-medium"
                  >
                    <span className="font-mono text-[10px] text-signal mr-1.5">
                      {v.index}
                    </span>
                    {v.shortLabel}
                  </Link>
                ))}
              </div>

              <Link
                to="/tienda"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-signal py-1.5 border-b border-current/10"
              >
                Tienda completa
              </Link>
              {SECTION_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium py-1.5 border-b border-current/10"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSearch('');
                  }}
                  className="flex-1 h-10 rounded-full border border-current/20 text-xs font-medium flex items-center justify-center gap-2"
                >
                  <Search className="w-3.5 h-3.5" />
                  Buscar catálogo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openDistributorModal();
                  }}
                  className="flex-1 h-10 rounded-full bg-signal text-white text-xs font-medium"
                >
                  Ser Distribuidor
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
