import React, { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { Award, CheckCircle2, CreditCard, PackageCheck, Truck } from 'lucide-react';
import { useBox } from '../../context/BoxContext';

interface WorkflowPhase {
  index: string;
  tag: string;
  title: string;
  description: string;
  ctaLabel: string;
}

const PHASES: WorkflowPhase[] = [
  {
    index: '01',
    tag: 'COTIZACIÓN & MARGEN B2B',
    title: 'Listas de materiales con tarifa preferencial al instante.',
    description:
      'Calcula tu proyecto con precios públicos o activa tu perfil de distribuidor autorizado para desbloquear descuentos por volumen, reservas de inventario y folios compartibles.',
    ctaLabel: 'Solicitar alta de distribuidor',
  },
  {
    index: '02',
    tag: 'PAGO FLEXIBLE & LOGÍSTICA PROTEGIDA',
    title: 'SPEI, Mercado Crédito y envíos asegurados a todo México.',
    description:
      'Despachamos desde nuestro centro de operaciones en Guadalajara hacia CDMX, Monterrey, Bajío y Sureste con cobertura de seguro total sobre hardware de alta sensibilidad.',
    ctaLabel: 'Explorar Mi Box actual',
  },
  {
    index: '03',
    tag: 'ACADEMIA TÉCNICA & GARANTÍAS',
    title: 'Capacitaciones certificadas y soporte post-venta directo.',
    description:
      'Accede a seminarios de certificación con marcas líderes (MikroTik, Hikvision, Ubiquiti, Solar Híbrido) y respaldo transparente en políticas de devolución y garantías.',
    ctaLabel: 'Contactar ingeniería',
  },
];

export const Section6WorkflowSticky: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const { openDistributorModal, openDrawer } = useBox();

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
    const idx = Math.min(PHASES.length - 1, Math.floor(latest * PHASES.length));
    if (idx !== activePhase) setActivePhase(idx);
  });

  const jumpToPhase = (idx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const scrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = docTop + (scrollable * (idx + 0.15)) / PHASES.length;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handlePhaseCta = (idx: number) => {
    if (idx === 0 || idx === 2) openDistributorModal();
    else openDrawer();
  };

  return (
    <section
      id="b2b"
      data-theme="light"
      ref={containerRef}
      className="relative h-[300vh] bg-alabaster text-obsidian border-t border-obsidian/[0.06]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center pt-14">
        <div className="max-w-[1320px] w-full mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Narrative & Clickable Scroll Phases */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Del Plano a la Operación
              </p>
              <h2 className="font-sans font-semibold text-3xl sm:text-4xl xl:text-[42px] leading-[1.06] tracking-editorial text-obsidian">
                Diseñado para quienes construyen.
              </h2>
            </div>

            <div className="space-y-3">
              {PHASES.map((phase, idx) => {
                const isActive = idx === activePhase;
                return (
                  <button
                    key={phase.index}
                    type="button"
                    onClick={() => jumpToPhase(idx)}
                    className={`w-full text-left pl-5 pr-4 py-3.5 rounded-2xl border-l-2 transition-all duration-300 ${
                      isActive
                        ? 'border-signal bg-white shadow-[0_12px_36px_rgba(18,18,18,0.06)]'
                        : 'border-obsidian/15 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          isActive ? 'text-signal' : 'text-graphite'
                        }`}
                      >
                        {phase.index}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                        {phase.tag}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-obsidian tracking-tight">
                      {phase.title}
                    </h3>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.28 }}
                        className="mt-2 space-y-2.5"
                      >
                        <p className="text-xs sm:text-[13px] text-graphite leading-relaxed">
                          {phase.description}
                        </p>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePhaseCta(idx);
                          }}
                          className="inline-block text-xs font-semibold text-signal hover:underline cursor-pointer"
                        >
                          {phase.ctaLabel} →
                        </span>
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pinned Project Box OS Interactive Window */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] bg-obsidian text-white border border-white/10 shadow-[0_32px_90px_rgba(18,18,18,0.22)] overflow-hidden">
              {/* OS Window Chrome */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#161619]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-signal" />
                  <span className="ml-2 font-mono text-[11px] text-silver">
                    project-box-os · fase {PHASES[activePhase].index}
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-signal/15 text-signal-glow border border-signal/30">
                  B2B WORKSPACE
                </span>
              </div>

              {/* Morphing Stage Content */}
              <div className="p-6 sm:p-8 min-h-[340px] sm:min-h-[380px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activePhase === 0 && (
                    <motion.div
                      key="phase-0"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-[10px] text-signal uppercase tracking-wider">
                            Cotizador Dinámico de Integrador
                          </p>
                          <h4 className="text-lg font-semibold mt-0.5">
                            Proyecto Torre Corporativa Norte
                          </h4>
                        </div>
                        <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          -18% Tarifa B2B
                        </span>
                      </div>

                      <div className="divide-y divide-white/10 border-t border-b border-white/10 text-xs sm:text-sm">
                        {[
                          { sku: 'UBQ-USW-PROMAX48', desc: '2× Switch UniFi Pro Max 48 PoE++', price: '$51,428 MXN' },
                          { sku: 'HK-DS2CD2387G2', desc: '16× Cámara 4K ColorVu AcuSense', price: '$77,276 MXN' },
                          { sku: 'EP-INV-HYB10K', desc: '1× Inversor Híbrido 10kW + Litio', price: '$68,620 MXN' },
                        ].map((row) => (
                          <div key={row.sku} className="py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-mono text-[10px] text-silver">{row.sku}</p>
                              <p className="truncate text-white/90">{row.desc}</p>
                            </div>
                            <span className="font-mono font-medium text-white tabular-nums shrink-0">
                              {row.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-[11px] text-silver">Margen neto estimado para integrador</p>
                          <p className="font-mono text-xl font-semibold text-signal-glow tabular-nums">
                            +$43,290 MXN
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={openDistributorModal}
                          className="h-9 px-4 rounded-full bg-white text-obsidian text-xs font-semibold hover:bg-alabaster transition-colors"
                        >
                          Activar cuenta B2B
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activePhase === 1 && (
                    <motion.div
                      key="phase-1"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-[10px] text-signal uppercase tracking-wider">
                            Red Logística Asegurada · México
                          </p>
                          <h4 className="text-lg font-semibold mt-0.5">
                            Hub Central Guadalajara → Cobertura Nacional
                          </h4>
                        </div>
                        <Truck className="w-5 h-5 text-signal" />
                      </div>

                      {/* 4K Sculpted Obsidian Relief Map of Mexico + Animated Telemetry Beacons */}
                      <div className="relative rounded-2xl bg-[#111114] border border-white/10 overflow-hidden h-[178px]">
                        <img
                          src="/visuals/logistics-mexico-4k.webp"
                          alt="Mapa topográfico 4K de red logística nacional PROJECT BOX desde Guadalajara"
                          width={1600}
                          height={893}
                          decoding="async"
                          className="w-full h-full object-cover object-center opacity-95 pointer-events-none select-none"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            boxShadow: 'inset 0 0 26px 8px #111114',
                          }}
                        />

                        {/* Live Telemetry City Chips Overlaid on Sculpted Hubs */}
                        {[
                          { label: 'TIJ · 48H', left: '14%', top: '18%' },
                          { label: 'MTY · 24H', left: '53%', top: '34%' },
                          { label: 'GDL HUB', left: '43%', top: '63%', primary: true },
                          { label: 'CDMX · 24H', left: '59%', top: '68%' },
                          { label: 'MID · 48H', left: '84%', top: '57%' },
                        ].map((node) => (
                          <div
                            key={node.label}
                            style={{ left: node.left, top: node.top }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-obsidian/80 backdrop-blur-md border border-white/15"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                node.primary ? 'bg-signal animate-ping' : 'bg-signal'
                              }`}
                            />
                            <span
                              className={`font-mono text-[9px] tracking-wider whitespace-nowrap ${
                                node.primary ? 'text-white font-semibold' : 'text-white/80'
                              }`}
                            >
                              {node.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        {[
                          { icon: CreditCard, label: 'SPEI Directo' },
                          { icon: CreditCard, label: 'Mercado Pago' },
                          { icon: CheckCircle2, label: 'Mercado Crédito' },
                          { icon: PackageCheck, label: 'Seguro Total' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 flex items-center gap-2 text-[11px] text-white/85"
                          >
                            <item.icon className="w-3.5 h-3.5 text-signal shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activePhase === 2 && (
                    <motion.div
                      key="phase-2"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-[10px] text-signal uppercase tracking-wider">
                            Certificaciones & Respaldo Técnico
                          </p>
                          <h4 className="text-lg font-semibold mt-0.5">
                            Academia PROJECT BOX & Garantía Directa
                          </h4>
                        </div>
                        <Award className="w-5 h-5 text-signal" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          {
                            code: 'CERT-01',
                            title: 'Ingeniería MikroTik & BGP',
                            meta: 'Presencial Guadalajara / Streaming',
                          },
                          {
                            code: 'CERT-02',
                            title: 'Analítica IA & ColorVu 4K',
                            meta: 'Laboratorio práctico Hikvision / Dahua',
                          },
                          {
                            code: 'CERT-03',
                            title: 'Dimensionamiento Solar Híbrido',
                            meta: 'MPPT, LiFePO4 y tierras físicas',
                          },
                          {
                            code: 'RMA-PRO',
                            title: 'Gestión ágil de garantías',
                            meta: 'Políticas claras y reemplazo trazable',
                          },
                        ].map((track) => (
                          <div
                            key={track.code}
                            className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 space-y-1.5"
                          >
                            <span className="font-mono text-[10px] text-signal">
                              {track.code}
                            </span>
                            <p className="text-sm font-medium text-white">{track.title}</p>
                            <p className="text-[11px] text-silver">{track.meta}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-silver">
                  <span>Centros de distribución nacionales · Envíos asegurados</span>
                  <span className="font-mono text-white/75">hola@projectbox.mx</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
