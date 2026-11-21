import React, { useEffect } from 'react';
import {
  AnimatePresence,
  motion,
  MotionValue,
  useTransform,
} from 'framer-motion';
import { VerticalId } from '../../types/commerce';

interface VerticalBlueprintVisualProps {
  verticalId: VerticalId;
  progress: MotionValue<number>;
  activeIndex: number;
}

const VERTICAL_MEDIA: Record<
  VerticalId,
  { src: string; caption: string; alt: string }
> = {
  seguridad: {
    src: '/visuals/vertical-seguridad.webp',
    caption: 'OPTICAL AI · 4K F1.0',
    alt: 'Cámara de videovigilancia arquitectónica 4K ColorVu',
  },
  redes: {
    src: '/visuals/vertical-redes.webp',
    caption: '10G SFP+ · WI-FI 7',
    alt: 'Switch 48 puertos 10G PoE++ y Access Point Wi-Fi 7',
  },
  energia: {
    src: '/visuals/vertical-energia.webp',
    caption: 'SOLAR 10KW · LIFEPO4',
    alt: 'Inversor solar híbrido, banco de litio y panel monocristalino',
  },
  computo: {
    src: '/visuals/vertical-computo.webp',
    caption: 'EDGE IT · NVME GEN4',
    alt: 'Gabinete compacto de servidor Edge IT con bahías NVMe',
  },
  iluminacion: {
    src: '/visuals/vertical-iluminacion.webp',
    caption: 'HIGHBAY · 175 LM/W',
    alt: 'Luminaria industrial LED Highbay UFO CNC',
  },
  radiocom: {
    src: '/visuals/vertical-radiocom.webp',
    caption: 'DMR TIER III · AES-256',
    alt: 'Radio portátil digital DMR rugerizado con antena UHF',
  },
};

export const VerticalBlueprintVisual: React.FC<VerticalBlueprintVisualProps> = ({
  verticalId,
  progress,
  activeIndex,
}) => {
  // Subtle organic scroll depth inside each specialty slot
  const slotStart = activeIndex / 6;
  const slotEnd = (activeIndex + 1) / 6;
  const driftY = useTransform(progress, [slotStart, slotEnd], [10, -10]);
  const driftScale = useTransform(progress, [slotStart, slotEnd], [1.03, 0.99]);

  // Preload all 6 4K studio photos so sticky scrolling is instant and flicker-free
  useEffect(() => {
    Object.values(VERTICAL_MEDIA).forEach((entry) => {
      const img = new Image();
      img.src = entry.src;
    });
  }, []);

  const current = VERTICAL_MEDIA[verticalId];

  return (
    <div className="relative w-full h-[270px] sm:h-[360px] lg:h-[430px] flex items-center justify-center select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={verticalId}
          initial={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <motion.div
            style={{
              y: driftY,
              scale: driftScale,
              maskImage: 'radial-gradient(closest-side, black 74%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(closest-side, black 74%, transparent 100%)',
            }}
            className="relative w-full max-w-[540px] h-full flex items-center justify-center overflow-hidden"
          >
            <img
              src={current.src}
              alt={current.alt}
              width={1600}
              height={1195}
              decoding="async"
              className="w-full h-full object-contain pointer-events-none"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 40px 22px #F5F5F7',
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Ultra-minimal centered floating spec tag below hardware */}
      <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/75 backdrop-blur-md border border-obsidian/[0.08]">
        <span className="w-1.5 h-1.5 rounded-full bg-signal" />
        <span className="font-mono text-[10px] tracking-[0.14em] text-obsidian/75 whitespace-nowrap">
          {current.caption}
        </span>
      </div>
    </div>
  );
};
