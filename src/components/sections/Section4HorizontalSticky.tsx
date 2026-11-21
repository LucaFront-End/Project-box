import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import { FLAGSHIP_SYSTEMS, formatMxn } from '../../data/catalog';
import { FlagshipHardwareVisual } from '../visuals/FlagshipHardwareVisual';
import { useBox } from '../../context/BoxContext';

export const Section4HorizontalSticky: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxShift, setMaxShift] = useState(1400);
  const { addFlagshipSystem } = useBox();

  useEffect(() => {
    const updateBounds = () => {
      if (!viewportRef.current || !trackRef.current) return;
      const shift = Math.max(
        0,
        trackRef.current.scrollWidth - viewportRef.current.clientWidth,
      );
      setMaxShift(shift);
    };

    updateBounds();
    const ro = new ResizeObserver(updateBounds);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', updateBounds);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateBounds);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 26,
    mass: 0.25,
  });

  // Pixel-exact travel so Card 01 aligns left at start and Card 04 aligns cleanly right at end
  const trackX = useTransform(smoothProgress, [0.03, 0.97], [0, -maxShift]);
  const barScaleX = useTransform(smoothProgress, [0, 1], [0.15, 1]);

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    const clamped = Math.min(1, Math.max(0, (v - 0.03) / 0.94));
    const idx = Math.min(
      FLAGSHIP_SYSTEMS.length - 1,
      Math.max(0, Math.round(clamped * (FLAGSHIP_SYSTEMS.length - 1))),
    );
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const scrollToSystem = (idx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const scrollable = containerRef.current.offsetHeight - window.innerHeight;
    const ratio = idx / (FLAGSHIP_SYSTEMS.length - 1);
    const targetProgress = 0.04 + ratio * 0.92;
    window.scrollTo({
      top: docTop + scrollable * targetProgress,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="sistemas"
      data-theme="light"
      ref={containerRef}
      className="relative h-[320vh] bg-white text-obsidian border-t border-obsidian/[0.06]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[78px] pb-8">
        {/* Top Pinned Header */}
        <div className="max-w-[1320px] w-full mx-auto px-5 md:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
              Sistemas Integrados · Kits de Despliegue
            </p>
            <h2 className="font-sans font-semibold text-2xl sm:text-4xl tracking-editorial text-obsidian">
              Ingeniería lista para instalar.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Interactive Jump Pills */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-alabaster border border-obsidian/[0.08]">
              {FLAGSHIP_SYSTEMS.map((sys, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => scrollToSystem(idx)}
                    aria-label={`Ver ${sys.title}`}
                    className={`px-2.5 py-1 rounded-full font-mono text-[11px] transition-colors cursor-pointer ${
                      active
                        ? 'bg-obsidian text-white'
                        : 'text-graphite hover:text-obsidian'
                    }`}
                  >
                    {sys.index}
                  </button>
                );
              })}
            </div>

            <span
              translate="no"
              className="font-mono text-xs text-graphite tabular-nums"
            >
              0{activeIndex + 1} / 0{FLAGSHIP_SYSTEMS.length}
            </span>
            <div className="w-28 sm:w-32 h-[3px] rounded-full bg-obsidian/10 overflow-hidden">
              <motion.div
                style={{ scaleX: barScaleX }}
                className="h-full bg-signal origin-left"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Scrubbed Track */}
        <div
          ref={viewportRef}
          className="relative flex-1 flex items-center overflow-hidden my-4"
        >
          <motion.div
            ref={trackRef}
            style={{ x: trackX }}
            className="w-max flex items-stretch gap-6 md:gap-8 px-5 md:px-[max(2rem,calc((100vw-1320px)/2+2rem))]"
          >
            {FLAGSHIP_SYSTEMS.map((sys, idx) => {
              const isDark = sys.theme === 'dark';
              return (
                <article
                  key={sys.id}
                  className={`relative shrink-0 w-[85vw] sm:w-[70vw] lg:w-[62vw] max-w-[880px] rounded-[32px] p-6 sm:p-10 flex flex-col justify-between gap-6 border overflow-hidden transition-shadow ${
                    isDark
                      ? 'bg-obsidian text-white border-white/10 shadow-[0_32px_70px_rgba(10,10,12,0.26)]'
                      : 'bg-alabaster text-obsidian border-obsidian/[0.08] shadow-[0_24px_60px_rgba(18,18,18,0.06)]'
                  }`}
                >
                  {/* Subtle Background Index Watermark */}
                  <span
                    className={`pointer-events-none select-none absolute -top-6 right-6 font-display font-bold text-[140px] sm:text-[180px] leading-none tracking-tighter ${
                      isDark ? 'text-white/[0.04]' : 'text-obsidian/[0.04]'
                    }`}
                  >
                    {sys.index}
                  </span>

                  {/* Card Top Meta */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-mono text-[11px] px-2.5 py-1 rounded-full ${
                          isDark
                            ? 'bg-white/10 text-white'
                            : 'bg-white text-obsidian border border-obsidian/10'
                        }`}
                      >
                        {sys.code}
                      </span>
                      <span className="text-xs font-medium text-signal">
                        {sys.category}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-3 py-1 rounded-full ${
                        isDark
                          ? 'bg-signal/15 text-signal-glow border border-signal/30'
                          : 'bg-obsidian text-white'
                      }`}
                    >
                      {sys.badge}
                    </span>
                  </div>

                  {/* Middle Visual + Manifest */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-6 space-y-3">
                      <h3 className="font-sans font-semibold text-2xl sm:text-3xl tracking-tight leading-[1.12]">
                        {sys.title}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isDark ? 'text-silver' : 'text-graphite'
                        }`}
                      >
                        {sys.subtitle}
                      </p>

                      {/* Included BOM lines */}
                      <ul className="space-y-1.5 pt-2">
                        {sys.componentsIncluded.map((comp) => (
                          <li
                            key={comp}
                            className={`flex items-center gap-2 text-xs ${
                              isDark ? 'text-white/80' : 'text-obsidian/80'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
                            <span>{comp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-6 h-[205px] sm:h-[245px] flex items-center justify-center">
                      <FlagshipHardwareVisual
                        systemCode={sys.code}
                        isDark={isDark}
                        progress={smoothProgress}
                        index={idx}
                      />
                    </div>
                  </div>

                  {/* Bottom Spec Strip & Action */}
                  <div
                    className={`relative z-10 pt-4 border-t flex flex-wrap items-center justify-between gap-4 ${
                      isDark ? 'border-white/10' : 'border-obsidian/[0.08]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-6">
                      {sys.specs.map((sp) => (
                        <div key={sp.label}>
                          <p
                            className={`text-[10px] uppercase tracking-wider ${
                              isDark ? 'text-silver' : 'text-graphite'
                            }`}
                          >
                            {sp.label}
                          </p>
                          <p className="font-mono text-xs sm:text-sm font-medium tabular-nums">
                            {sp.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 ml-auto">
                      <div className="text-right mr-1">
                        <p
                          className={`text-[10px] uppercase tracking-wider ${
                            isDark ? 'text-silver' : 'text-graphite'
                          }`}
                        >
                          Kit Completo
                        </p>
                        <p className="text-base sm:text-lg font-semibold tabular-nums">
                          {formatMxn(sys.priceMxn)}
                        </p>
                      </div>
                      <Link
                        to={`/sistema/${sys.code}`}
                        className={`inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-medium border transition-colors ${
                          isDark
                            ? 'border-white/20 text-white hover:bg-white/10'
                            : 'border-obsidian/15 text-obsidian hover:border-obsidian/40'
                        }`}
                      >
                        <span>Ver kit</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => addFlagshipSystem(sys)}
                        className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-signal hover:bg-signal-glow text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir a Box
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Hint */}
        <div className="max-w-[1320px] w-full mx-auto px-5 md:px-8 flex items-center justify-between text-xs text-graphite">
          <span>Desplaza o elige un número para recorrer los 4 sistemas insignia</span>
          <span className="font-mono text-[11px] uppercase tracking-wider hidden sm:inline">
            Garantía oficial directa · Envío asegurado a todo México
          </span>
        </div>
      </div>
    </section>
  );
};
