import React, { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Layers, Plus } from 'lucide-react';
import { FLAGSHIP_SYSTEMS, formatMxn } from '../data/catalog';
import { SYSTEM_TOPOLOGIES } from '../data/details';
import { SystemTopologyInteractive } from '../components/visuals/SystemTopologyInteractive';
import { useBox } from '../context/BoxContext';

const SITE_MULTIPLIERS = [
  { count: 1, label: '1× Sitio', discountPct: 0 },
  { count: 2, label: '2× Sitios', discountPct: 6 },
  { count: 5, label: '5× Sitios', discountPct: 12 },
];

export const SystemDetailPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const heroRef = useRef<HTMLDivElement>(null);

  const system = useMemo(
    () =>
      FLAGSHIP_SYSTEMS.find(
        (s) => s.code.toLowerCase() === (code ?? '').toLowerCase(),
      ) ?? FLAGSHIP_SYSTEMS[0],
    [code],
  );

  const topology =
    SYSTEM_TOPOLOGIES[system.code] ?? SYSTEM_TOPOLOGIES['PB-NET-01'];

  const [activeNodeId, setActiveNodeId] = useState(topology.nodes[0].id);
  const [siteCount, setSiteCount] = useState(1);
  const [addedMulti, setAddedMulti] = useState(false);

  const { addFlagshipSystem, openSearch } = useBox();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const kitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const isDarkHero = system.theme === 'dark';
  const activeTier =
    SITE_MULTIPLIERS.find((m) => m.count === siteCount) ?? SITE_MULTIPLIERS[0];

  const multiTotalMxn = Math.round(
    system.priceMxn * siteCount * (1 - activeTier.discountPct / 100),
  );

  const activeNode =
    topology.nodes.find((n) => n.id === activeNodeId) ?? topology.nodes[0];

  const handleAddSites = () => {
    for (let i = 0; i < siteCount; i++) {
      addFlagshipSystem(system);
    }
    setAddedMulti(true);
    window.setTimeout(() => setAddedMulti(false), 1600);
  };

  return (
    <main>
      {/* Section A: Adaptive Cinema Hero */}
      <section
        ref={heroRef}
        data-theme={isDarkHero ? 'dark' : 'light'}
        className={`pt-[92px] pb-16 md:pb-24 overflow-hidden ${
          isDarkHero
            ? 'bg-studio text-white border-b border-white/10'
            : 'bg-alabaster text-obsidian border-b border-obsidian/[0.08]'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-10">
          {/* Breadcrumb & Kit Quick Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div
              className={`flex items-center gap-2 font-mono text-[11px] ${
                isDarkHero ? 'text-silver' : 'text-graphite'
              }`}
            >
              <Link
                to="/"
                className={
                  isDarkHero
                    ? 'hover:text-white transition-colors'
                    : 'hover:text-obsidian transition-colors'
                }
              >
                Inicio
              </Link>
              <span>/</span>
              <span>Sistemas</span>
              <span>/</span>
              <span className="text-signal font-medium">{system.code}</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {FLAGSHIP_SYSTEMS.map((s) => (
                <Link
                  key={s.code}
                  to={`/sistema/${s.code}`}
                  className={`shrink-0 px-3 py-1 rounded-full font-mono text-[11px] transition-colors ${
                    s.code === system.code
                      ? 'bg-signal text-white'
                      : isDarkHero
                        ? 'bg-white/[0.06] text-silver hover:text-white'
                        : 'bg-white text-graphite border border-obsidian/10 hover:text-obsidian'
                  }`}
                >
                  {s.code}
                </Link>
              ))}
            </div>
          </div>

          {/* Hero Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                  {system.category}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                    isDarkHero
                      ? 'bg-white/10 text-white'
                      : 'bg-obsidian text-white'
                  }`}
                >
                  {system.badge}
                </span>
              </div>

              <h1 className="font-sans font-semibold text-4xl sm:text-5xl xl:text-[58px] leading-[1.04] tracking-editorial">
                {system.title}
              </h1>

              <p
                className={`text-sm sm:text-base leading-relaxed max-w-[500px] ${
                  isDarkHero ? 'text-silver' : 'text-graphite'
                }`}
              >
                {system.subtitle}
              </p>

              <div
                className={`flex flex-wrap items-center gap-6 pt-4 border-t ${
                  isDarkHero ? 'border-white/10' : 'border-obsidian/[0.08]'
                }`}
              >
                {system.specs.map((sp) => (
                  <div key={sp.label}>
                    <p
                      className={`text-[10px] uppercase tracking-wider ${
                        isDarkHero ? 'text-silver' : 'text-graphite'
                      }`}
                    >
                      {sp.label}
                    </p>
                    <p className="font-mono text-sm sm:text-base font-semibold tabular-nums mt-0.5">
                      {sp.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => addFlagshipSystem(system)}
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-signal hover:bg-signal-glow text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir kit · {formatMxn(system.priceMxn)}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 h-[270px] sm:h-[360px] rounded-[28px] overflow-hidden relative flex items-center justify-center">
              <motion.img
                src={topology.studioImage}
                alt={system.title}
                width={1600}
                height={1195}
                style={{ scale: kitScale }}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  boxShadow: isDarkHero
                    ? 'inset 0 0 40px 18px #0A0A0C'
                    : 'inset 0 0 40px 18px #F5F5F7',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Interactive Topology + Synchronized BOM Manifest */}
      <section data-theme="dark" className="bg-studio text-white py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Arquitectura Llave en Mano
              </p>
              <h2 className="font-sans font-semibold text-3xl sm:text-4xl tracking-editorial">
                Cada nodo conectado dentro del kit.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-silver max-w-[360px]">
              Haz clic en cualquier bloque del diagrama o en la lista de materiales para ver su rol operativo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7">
              <SystemTopologyInteractive
                nodes={topology.nodes}
                edges={topology.edges}
                activeNodeId={activeNodeId}
                onSelectNode={(n) => setActiveNodeId(n.id)}
              />
            </div>

            {/* Synchronized BOM List */}
            <div className="lg:col-span-5 rounded-[28px] bg-white/[0.03] border border-white/10 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                  <Layers className="w-3.5 h-3.5 text-signal" />
                  <span>Manifiesto de Hardware ({system.code})</span>
                </div>

                <div className="divide-y divide-white/10 border-t border-b border-white/10">
                  {system.componentsIncluded.map((comp, idx) => {
                    const isHighlighted = activeNode.bomIndex === idx;
                    const linkedNode = topology.nodes.find(
                      (n) => n.bomIndex === idx,
                    );
                    return (
                      <button
                        key={comp}
                        type="button"
                        onMouseEnter={() =>
                          linkedNode && setActiveNodeId(linkedNode.id)
                        }
                        onClick={() =>
                          linkedNode && setActiveNodeId(linkedNode.id)
                        }
                        className={`w-full py-4 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isHighlighted ? 'text-white' : 'text-silver hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isHighlighted ? 'bg-signal' : 'bg-white/25'
                            }`}
                          />
                          <span className="text-xs sm:text-sm font-medium leading-snug">
                            {comp}
                          </span>
                        </div>
                        {linkedNode && (
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                              isHighlighted
                                ? 'bg-signal text-white'
                                : 'bg-white/[0.06] text-silver'
                            }`}
                          >
                            {linkedNode.code}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => openSearch(system.category.split(' ')[0])}
                className="text-xs font-medium text-silver hover:text-signal transition-colors text-left cursor-pointer"
              >
                Explorar refacciones y accesorios compatibles →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Deployment Timeline + Multi-Site Scale Calculator */}
      <section data-theme="light" className="bg-alabaster text-obsidian py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 space-y-16">
          {/* 3-Step Rollout Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-obsidian/10 divide-y md:divide-y-0 md:divide-x divide-obsidian/10">
            {topology.timeline.map((step) => (
              <div key={step.day} className="py-8 md:px-8 first:md:pl-0 last:md:pr-0 space-y-2">
                <span className="font-mono text-xs font-semibold text-signal">
                  {step.day}
                </span>
                <h3 className="text-lg font-semibold text-obsidian">{step.title}</h3>
                <p className="text-xs sm:text-sm text-graphite leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Multi-Site Scale Configurator */}
          <div className="rounded-[32px] bg-white border border-obsidian/[0.08] p-7 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                Escalamiento Multi-Sucursal
              </p>
              <h2 className="font-sans font-semibold text-2xl sm:text-3xl tracking-editorial">
                ¿Despliegas en múltiples ubicaciones?
              </h2>
              <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-alabaster border border-obsidian/[0.08]">
                {SITE_MULTIPLIERS.map((tier) => (
                  <button
                    key={tier.count}
                    type="button"
                    onClick={() => setSiteCount(tier.count)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      siteCount === tier.count
                        ? 'bg-obsidian text-white'
                        : 'text-graphite hover:text-obsidian'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="sm:text-right">
                <p className="font-mono text-[11px] text-graphite">
                  {activeTier.discountPct > 0
                    ? `Descuento multi-sitio -${activeTier.discountPct}% incluido`
                    : 'Tarifa estándar por unidad'}
                </p>
                <p className="text-3xl font-semibold text-obsidian tabular-nums mt-0.5">
                  {formatMxn(multiTotalMxn)} MXN
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSites}
                className={`inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  addedMulti
                    ? 'bg-emerald-600 text-white'
                    : 'bg-obsidian hover:bg-signal text-white'
                }`}
              >
                {addedMulti ? (
                  <>
                    <Check className="w-4 h-4" />
                    Agregados a Box
                  </>
                ) : (
                  <>
                    <span>Agregar {siteCount}× a Box</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
