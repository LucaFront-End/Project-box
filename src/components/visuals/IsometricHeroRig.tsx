import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layers, Magnet, Move3d } from 'lucide-react';
import { HeroModuleId, HeroMonolith3D } from './HeroMonolith3D';

interface ModuleMeta {
  id: HeroModuleId;
  shortLabel: string;
  tag: string;
  title: string;
  metric: string;
}

const MODULES: ModuleMeta[] = [
  {
    id: 'core',
    shortLabel: 'Box',
    tag: 'MÓDULO KEYSTONE',
    title: 'Núcleo Modular Anodizado',
    metric: 'Plug & Deploy',
  },
  {
    id: 'net',
    shortLabel: 'Redes',
    tag: 'BACKBONE 10GBE',
    title: '6× Jaulas SFP+ & Switching L3',
    metric: '720W PoE++',
  },
  {
    id: 'sec',
    shortLabel: 'Óptica',
    tag: 'VISIÓN IA 4K',
    title: 'Óptica Zafiro Multi-Elemento',
    metric: 'F1.0 · ColorVu',
  },
  {
    id: 'pwr',
    shortLabel: 'Energía',
    tag: 'MICROGRID & NVME',
    title: 'Fotovoltaica + LiFePO4 + NVMe',
    metric: '10kW Híbrido',
  },
];

export const IsometricHeroRig: React.FC = () => {
  const [focusModule, setFocusModule] = useState<HeroModuleId>('core');
  const [isDocked, setIsDocked] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const activeMeta = MODULES.find((m) => m.id === focusModule) ?? MODULES[0];

  const handleSelectModule = (id: HeroModuleId) => {
    setFocusModule(id);
    setHasInteracted(true);
  };

  const handleToggleDock = () => {
    setIsExploded(false);
    setIsDocked((prev) => !prev);
    setFocusModule('core');
    setHasInteracted(true);
  };

  const handleToggleExploded = () => {
    setIsExploded((prev) => {
      const next = !prev;
      if (next) setIsDocked(false);
      return next;
    });
    setHasInteracted(true);
  };

  return (
    <div className="relative w-full max-w-[580px] mx-auto flex flex-col items-center select-none">
      {/* 3D Interactive Stage */}
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[470px] flex items-center justify-center">
        {/* Top-Right Minimal Live Telemetry Readout */}
        <div className="pointer-events-none absolute top-2 right-1 sm:right-2 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMeta.id}-${isDocked}-${isExploded}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22 }}
              className="px-3.5 py-2 rounded-2xl bg-white/82 backdrop-blur-xl border border-obsidian/10 shadow-[0_10px_28px_rgba(18,18,18,0.06)] text-right"
            >
              <div className="flex items-center justify-end gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
                  {isExploded
                    ? 'VISTA EXPLOSIVA 3D'
                    : isDocked && focusModule === 'core'
                      ? 'NÚCLEO ACOPLADO'
                      : activeMeta.tag}
                </span>
              </div>
              <p className="text-xs font-semibold text-obsidian tracking-tight mt-0.5">
                {activeMeta.title}
              </p>
              <p className="font-mono text-[10px] text-graphite">{activeMeta.metric}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtle Onboarding Whisper (Fades cleanly after first interaction) */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.35, delay: 0.5 }}
              className="pointer-events-none absolute top-2 left-1 sm:left-2 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-alabaster/90 backdrop-blur-md border border-obsidian/[0.08] text-[11px] text-graphite"
            >
              <Move3d className="w-3.5 h-3.5 text-signal" />
              <span>Arrastra 360° · Clic en cubo naranja</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-Time Three.js PBR WebGL Sculpture */}
        <HeroMonolith3D
          focusModule={focusModule}
          isDocked={isDocked}
          isExploded={isExploded}
          onToggleDock={handleToggleDock}
          onSelectModule={handleSelectModule}
          onUserInteract={() => setHasInteracted(true)}
        />
      </div>

      {/* Apple-Grade Floating Interactive Control Dock */}
      <div className="relative z-20 -mt-2 flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-obsidian/10 shadow-[0_14px_40px_rgba(18,18,18,0.08)]">
        {/* Subsystem Focus Pills */}
        <div className="flex items-center gap-0.5">
          {MODULES.map((mod) => {
            const active = focusModule === mod.id && !isExploded;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  setIsExploded(false);
                  handleSelectModule(mod.id);
                }}
                className={`relative px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${
                  active ? 'text-white' : 'text-graphite hover:text-obsidian'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="hero3dFocusPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-obsidian"
                  />
                )}
                <span className="relative z-10">{mod.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <span className="h-4 w-px bg-obsidian/10 mx-0.5" />

        {/* Dock Core Cube Toggle */}
        <button
          type="button"
          onClick={handleToggleDock}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
            isDocked
              ? 'bg-signal text-white shadow-[0_6px_18px_rgba(234,107,26,0.3)]'
              : 'bg-alabaster text-obsidian hover:bg-obsidian/[0.08]'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>{isDocked ? 'Levitar' : 'Acoplar'}</span>
        </button>

        {/* Exploded 3D Assembly Toggle */}
        <button
          type="button"
          onClick={handleToggleExploded}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
            isExploded
              ? 'bg-obsidian text-white shadow-sm'
              : 'bg-alabaster text-obsidian hover:bg-obsidian/[0.08]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-signal" />
          <span>Explosiva 3D</span>
        </button>
      </div>
    </div>
  );
};
