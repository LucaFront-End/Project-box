import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ReviewItem {
  id: string;
  quote: string;
  author: string;
  initials: string;
  role: string;
  city: string;
  vertical: string;
}

const ROW_1: ReviewItem[] = [
  {
    id: 'rev-1',
    quote:
      'Consolidamos switches PoE++ y 48 cámaras ColorVu en un solo envío asegurado a Querétaro. Cero faltantes y entrega en 36 horas.',
    author: 'Ing. Diego Morales',
    initials: 'DM',
    role: 'Director de Ingeniería · NexoSec',
    city: 'QRO',
    vertical: 'Seguridad IA',
  },
  {
    id: 'rev-2',
    quote:
      'Las tarifas B2B nos permitieron ganar una licitación de campus universitario con respaldo directo de MikroTik y Panduit.',
    author: 'Sofía Castellanos',
    initials: 'SC',
    role: 'Gerente de Proyectos · RedCorp',
    city: 'MTY',
    vertical: 'Redes 10G',
  },
  {
    id: 'rev-3',
    quote:
      'La asesoría para dimensionar el banco LiFePO4 e inversor híbrido 10kW nos ahorró días de ingeniería en planta.',
    author: 'Carlos Villarreal',
    initials: 'CV',
    role: 'Socio Integrador · VoltSolar',
    city: 'GDL',
    vertical: 'Energía Crítica',
  },
  {
    id: 'rev-4',
    quote:
      'Tener stock real en Guadalajara y pago ágil por SPEI cambió por completo nuestra velocidad de instalación semanal.',
    author: 'Mariana Elizondo',
    initials: 'ME',
    role: 'Operaciones · Áurea IT',
    city: 'CDMX',
    vertical: 'Cómputo & Racks',
  },
  {
    id: 'rev-5',
    quote:
      'Las luminarias Highbay de 175 lm/W llegaron listas con certificado fotométrico para nuestra nave logística en Mérida.',
    author: 'Arq. Fernando Peón',
    initials: 'FP',
    role: 'Infraestructura · Península Hub',
    city: 'MID',
    vertical: 'Iluminación LED',
  },
];

const ROW_2: ReviewItem[] = [
  {
    id: 'rev-6',
    quote:
      'Armar el BOM completo en línea y pasarlo a cotización formal nos toma menos de diez minutos frente al cliente final.',
    author: 'Ricardo Salgado',
    initials: 'RS',
    role: 'Líder Técnico · BajaLink',
    city: 'TIJ',
    vertical: 'Redes 10G',
  },
  {
    id: 'rev-7',
    quote:
      'El soporte en garantías directas y las capacitaciones presenciales hacen una diferencia enorme frente a distribuidores genéricos.',
    author: 'Valeria Ibarra',
    initials: 'VI',
    role: 'Directora Comercial · VíaSegura',
    city: 'PUE',
    vertical: 'Seguridad IA',
  },
  {
    id: 'rev-8',
    quote:
      'Desplegamos cinco racks Edge Compute con UPS doble conversión en sucursales del Bajío sin un solo daño en traslado.',
    author: 'Héctor Domínguez',
    initials: 'HD',
    role: 'CTO · Grupo Logístico Bajío',
    city: 'LEO',
    vertical: 'Cómputo & Racks',
  },
  {
    id: 'rev-9',
    quote:
      'Nuestra flotilla opera con radios DMR Tier III encriptados y repetidores entregados puntualmente y listos para programar.',
    author: 'Lucía Paredes',
    initials: 'LP',
    role: 'Coordinación Operativa · Portuaria',
    city: 'VER',
    vertical: 'Radiocom',
  },
  {
    id: 'rev-10',
    quote:
      'Financiamiento flexible y disponibilidad real en las marcas clave. Son nuestro proveedor principal para obra crítica.',
    author: 'Alejandro Treviño',
    initials: 'AT',
    role: 'Fundador · IntegraNorte',
    city: 'MTY',
    vertical: 'Energía Crítica',
  },
];

const ReviewCard: React.FC<{ item: ReviewItem }> = ({ item }) => (
  <article className="shrink-0 w-[330px] sm:w-[390px] rounded-[24px] bg-alabaster/75 border border-obsidian/[0.08] p-6 sm:p-7 flex flex-col justify-between gap-5 select-none">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-0.5" aria-label="Calificación 5 de 5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className="w-3.5 h-3.5 fill-signal text-signal"
          />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full bg-white border border-obsidian/[0.08] text-graphite">
        {item.vertical}
      </span>
    </div>

    <p className="text-[13px] sm:text-sm text-obsidian/90 leading-relaxed font-normal">
      “{item.quote}”
    </p>

    <div className="flex items-center justify-between gap-3 pt-3 border-t border-obsidian/[0.07]">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-8 h-8 rounded-full bg-obsidian text-white font-mono text-[11px] font-semibold flex items-center justify-center shrink-0">
          {item.initials}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-obsidian truncate">
            {item.author}
          </p>
          <p className="text-[11px] text-graphite truncate">{item.role}</p>
        </div>
      </div>

      <span className="font-mono text-[10px] text-signal font-medium shrink-0">
        {item.city}
      </span>
    </div>
  </article>
);

export const SectionReviewsMarquee: React.FC = () => {
  return (
    <section
      data-theme="light"
      className="relative bg-white text-obsidian py-24 md:py-32 overflow-hidden border-t border-obsidian/[0.06]"
    >
      {/* Minimal Centered Editorial Header */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-8 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-[700px] mx-auto space-y-3.5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            Confianza Comprobada · México
          </p>
          <h2 className="font-sans font-semibold text-3xl sm:text-5xl leading-[1.06] tracking-editorial text-obsidian">
            Lo que dicen quienes operan con nosotros<span className="text-signal">.</span>
          </h2>
          <p className="font-mono text-xs text-graphite tracking-wide">
            <span className="text-obsidian font-semibold">4.9 / 5.0</span> · +1,200 proyectos desplegados con entrega asegurada
          </p>
        </motion.div>
      </div>

      {/* Infinite Opposite-Direction 2-Row Carousel with Frosted Side Blur */}
      <div className="relative">
        {/* Left & Right Frosted Blur + Gradient Scrims */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-44 z-20 backdrop-blur-[3px]"
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,1) 18%, rgba(255,255,255,0.72) 55%, rgba(255,255,255,0) 100%)',
            maskImage: 'linear-gradient(to right, black 35%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, black 35%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-44 z-20 backdrop-blur-[3px]"
          style={{
            background:
              'linear-gradient(to left, rgba(255,255,255,1) 18%, rgba(255,255,255,0.72) 55%, rgba(255,255,255,0) 100%)',
            maskImage: 'linear-gradient(to left, black 35%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to left, black 35%, transparent 100%)',
          }}
        />

        <div
          className="space-y-5"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          {/* Row 1 -> Left */}
          <div className="w-max flex items-stretch gap-5 animate-marquee-slow-left hover:[animation-play-state:paused]">
            {[...ROW_1, ...ROW_1].map((item, idx) => (
              <ReviewCard key={`${item.id}-a-${idx}`} item={item} />
            ))}
          </div>

          {/* Row 2 -> Right */}
          <div className="w-max flex items-stretch gap-5 animate-marquee-slow-right hover:[animation-play-state:paused]">
            {[...ROW_2, ...ROW_2].map((item, idx) => (
              <ReviewCard key={`${item.id}-b-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
