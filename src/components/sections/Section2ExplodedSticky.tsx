import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ExplodedLayersVisual } from '../visuals/ExplodedLayersVisual';

interface ArchitectureStage {
  index: string;
  tag: string;
  title: string;
  description: string;
  metrics: { label: string; value: string }[];
  brands: string[];
}

const STAGES: ArchitectureStage[] = [
  {
    index: '01',
    tag: 'CAPA SUPERIOR · CONECTIVIDAD',
    title: 'Backbone de fibra y Wi-Fi 7 sin latencia.',
    description:
      'El nodo superior concentra switching Layer 3 PoE++, enrutamiento multi-WAN de 100 Gbps y enlaces inalámbricos de alta densidad para soportar toda la operación.',
    metrics: [
      { label: 'Uplink Troncal', value: '10G / 25G SFP+' },
      { label: 'Presupuesto PoE', value: '720W PoE++' },
    ],
    brands: ['Ubiquiti', 'MikroTik', 'Cisco', 'Panduit'],
  },
  {
    index: '02',
    tag: 'CAPA ÓPTICA · SEGURIDAD IA',
    title: 'Perímetro consciente con analítica neural.',
    description:
      'Cámaras 4K ColorVu y grabadores WizSense procesan detección vehicular, reconocimiento facial y cercas virtuales en el borde antes de enviar alertas en tiempo real.',
    metrics: [
      { label: 'Visión Nocturna', value: '0.0005 Lux F1.0' },
      { label: 'Falsas Alarmas', value: '-94% Filtrado IA' },
    ],
    brands: ['Hikvision', 'Dahua', 'Honeywell', 'Ezviz'],
  },
  {
    index: '03',
    tag: 'CAPA DE POTENCIA · ENERGÍA CRÍTICA',
    title: 'Autonomía híbrida solar y respaldo LiFePO4.',
    description:
      'Inversores híbridos bifásicos, bancos modulares de litio de 6,000+ ciclos y UPS doble conversión aíslan tu proyecto de cualquier interrupción eléctrica.',
    metrics: [
      { label: 'Eficiencia MPPT', value: '98.2%' },
      { label: 'Transferencia UPS', value: '0 ms Online' },
    ],
    brands: ['Growatt', 'Pylontech', 'APC', 'Epcom Power'],
  },
  {
    index: '04',
    tag: 'CAPA BASE · CÓMPUTO, RACKS & IOT',
    title: 'Almacenamiento NVMe y despacho RF unificado.',
    description:
      'La cimentación del sistema: gabinetes climatizados de alta densidad, arreglos NAS redundantes, radiocomunicación digital DMR e iluminación industrial eficiente.',
    metrics: [
      { label: 'Arreglos RAID', value: 'NVMe Gen4' },
      { label: 'Integración', value: '100% Modular' },
    ],
    brands: ['Synology', 'Panduit', 'Hytera', 'Winled'],
  },
];

export const Section2ExplodedSticky: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.25,
  });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const idx = Math.min(STAGES.length - 1, Math.floor(latest * STAGES.length));
    if (idx !== activeStage) {
      setActiveStage(idx);
    }
  });

  const jumpToStage = (idx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const scrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = docTop + (scrollable * (idx + 0.12)) / STAGES.length;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const current = STAGES[activeStage];

  return (
    <section
      id="arquitectura"
      data-theme="dark"
      ref={containerRef}
      className="relative h-[360vh] bg-studio text-white"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Subtle Architectural Studio Grid */}
        <div className="absolute inset-0 bg-architectural-grid-dark opacity-50 pointer-events-none" />

        <div className="relative z-10 max-w-[1320px] w-full mx-auto px-5 md:px-8 pt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Stage: Exploded 3D Isometric Monolith */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between lg:hidden mb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Anatomía de un Proyecto
              </span>
              <span className="font-mono text-[11px] text-silver tabular-nums">
                {current.index} / 04
              </span>
            </div>
            <ExplodedLayersVisual progress={smoothProgress} activeStage={activeStage} />
          </div>

          {/* Right Stage: Choreographed Apple Narrative */}
          <div className="lg:col-span-5 flex items-start gap-6">
            {/* Vertical Progress Rail */}
            <div className="hidden sm:flex flex-col items-center gap-3 pt-2">
              {STAGES.map((stage, idx) => {
                const active = idx === activeStage;
                return (
                  <button
                    key={stage.index}
                    type="button"
                    onClick={() => jumpToStage(idx)}
                    aria-label={`Ir a capa ${stage.index}`}
                    className="group flex flex-col items-center gap-1 focus:outline-none"
                  >
                    <span
                      className={`font-mono text-[10px] transition-colors ${
                        active ? 'text-signal' : 'text-white/35 group-hover:text-white/70'
                      }`}
                    >
                      {stage.index}
                    </span>
                    <span
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        active ? 'h-9 bg-signal' : 'h-4 bg-white/15 group-hover:bg-white/35'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Stage Content */}
            <div className="flex-1 min-h-[290px] sm:min-h-[340px] flex flex-col justify-center">
              <p className="hidden lg:block font-mono text-[11px] uppercase tracking-[0.18em] text-silver mb-3">
                Anatomía de un Proyecto · Scroll para desensamblar
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5"
                >
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-signal" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">
                      {current.tag}
                    </span>
                  </div>

                  <h2 className="font-sans font-semibold text-3xl sm:text-4xl xl:text-[44px] leading-[1.06] tracking-editorial text-white">
                    {current.title}
                  </h2>

                  <p className="text-sm sm:text-base text-silver leading-relaxed max-w-[460px]">
                    {current.description}
                  </p>

                  {/* Hairline Metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                    {current.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="text-[11px] text-silver uppercase tracking-wider">
                          {metric.label}
                        </p>
                        <p className="font-mono text-base sm:text-lg font-medium text-white mt-0.5 tabular-nums">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Brand Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {current.brands.map((brand) => (
                      <span
                        key={brand}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/80"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
