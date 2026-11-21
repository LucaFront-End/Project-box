import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Search, ShieldCheck } from 'lucide-react';
import { IsometricHeroRig } from '../visuals/IsometricHeroRig';
import { MagneticButton } from '../ui/MagneticButton';
import { useBox } from '../../context/BoxContext';

const HERO_PROOFS = [
  { code: '100K+', label: 'SKUs activos en catálogo' },
  { code: '24–48H', label: 'Envío asegurado nacional' },
  { code: 'B2B / B2C', label: 'Esquema a integradores' },
  { code: 'GDL · MX', label: 'Ingeniería & garantías' },
];

export const Section1Hero: React.FC = () => {
  const { openSearch } = useBox();

  const scrollToArchitecture = () => {
    document.getElementById('arquitectura')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      data-theme="light"
      className="relative min-h-screen bg-white text-obsidian pt-[74px] flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle Architectural Dot Matrix fading at edges */}
      <div
        className="absolute inset-0 bg-dot-matrix-light opacity-60 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%)',
        }}
      />

      {/* Main Content Grid */}
      <div className="relative z-10 max-w-[1320px] w-full mx-auto px-5 md:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center py-4 md:py-8">
        {/* Left Editorial Typography */}
        <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-alabaster border border-obsidian/[0.08]"
          >
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse-soft" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-obsidian/80">
              Infraestructura · Telecom · Seguridad · Energía
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans font-semibold text-[44px] sm:text-[62px] xl:text-[74px] leading-[1.02] tracking-editorial text-obsidian"
          >
            Infraestructura crítica.
            <br />
            <span className="text-obsidian/35">En una sola</span>{' '}
            <span className="relative inline-block">
              caja<span className="text-signal">.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[520px] mx-auto lg:mx-0 text-[16px] sm:text-[18px] leading-relaxed text-graphite font-normal"
          >
            Marketplace tecnológico de ingeniería para integradores y empresas en México.
            Redes 10G, videovigilancia IA, respaldo solar y cómputo en un ecosistema unificado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1"
          >
            <MagneticButton variant="obsidian" size="lg" onClick={scrollToArchitecture}>
              <span>Explorar arquitectura</span>
              <ArrowDownRight className="w-4 h-4 text-signal" />
            </MagneticButton>

            <MagneticButton variant="ghost-dark" size="lg" onClick={() => openSearch('')}>
              <Search className="w-4 h-4 text-graphite" />
              <span>Buscar catálogo</span>
              <kbd className="font-mono text-[10px] text-graphite/80 ml-1">⌘K</kbd>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="hidden sm:flex items-center justify-center lg:justify-start gap-2 text-xs text-graphite pt-1"
          >
            <ShieldCheck className="w-4 h-4 text-signal" />
            <span>Distribución oficial · Garantía directa y envíos asegurados a todo el país</span>
          </motion.div>
        </div>

        {/* Right Centerpiece: Interactive 3D Isometric Monolith */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
        >
          <IsometricHeroRig />
        </motion.div>
      </div>

      {/* Bottom Hairline Telemetry Strip */}
      <div className="relative z-10 border-t border-obsidian/[0.08] bg-white/80 backdrop-blur-md">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y-0 md:divide-x divide-obsidian/[0.08]">
          {HERO_PROOFS.map((proof) => (
            <div
              key={proof.code}
              className="flex items-baseline gap-2.5 md:pl-6 first:pl-0 justify-center md:justify-start"
            >
              <span className="font-mono text-xs sm:text-sm font-semibold text-obsidian tabular-nums">
                {proof.code}
              </span>
              <span className="text-[11px] sm:text-xs text-graphite truncate">
                {proof.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
