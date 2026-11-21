import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface FlagshipHardwareVisualProps {
  systemCode: string;
  isDark: boolean;
  progress?: MotionValue<number>;
  index?: number;
}

const SYSTEM_MEDIA: Record<string, { src: string; alt: string }> = {
  'PB-NET-01': {
    src: '/visuals/system-net-01.webp',
    alt: 'Kit Núcleo UniFi Enterprise 10G: Switch PoE++, Gateway y Access Point Wi-Fi 7',
  },
  'PB-SEC-02': {
    src: '/visuals/system-sec-02.webp',
    alt: 'Kit Perímetro Óptico IA 4K: Grabador NVR y cámaras arquitectónicas ColorVu',
  },
  'PB-PWR-03': {
    src: '/visuals/system-pwr-03.webp',
    alt: 'Kit Microgrid Híbrido Solar 10kW: Inversor, baterías LiFePO4 y panel solar',
  },
  'PB-IT-04': {
    src: '/visuals/system-it-04.webp',
    alt: 'Kit Rack Modular Edge Compute 24U con almacenamiento NVMe y UPS Online',
  },
};

export const FlagshipHardwareVisual: React.FC<FlagshipHardwareVisualProps> = ({
  systemCode,
  isDark,
  progress,
  index = 0,
}) => {
  const media = SYSTEM_MEDIA[systemCode] ?? SYSTEM_MEDIA['PB-NET-01'];

  // Subtle horizontal scrub parallax within the studio frame
  const centerProgress = index / 3;
  const fallback = useTransform(
    progress ?? (undefined as unknown as MotionValue<number>),
    [Math.max(0, centerProgress - 0.35), Math.min(1, centerProgress + 0.35)],
    [18, -18],
  );

  const featherColor = isDark ? '#121212' : '#F5F5F7';

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center select-none">
      {progress ? (
        <motion.img
          src={media.src}
          alt={media.alt}
          width={1600}
          height={1195}
          decoding="async"
          style={{ x: fallback }}
          className="w-[108%] h-[108%] object-cover object-center pointer-events-none"
        />
      ) : (
        <img
          src={media.src}
          alt={media.alt}
          width={1600}
          height={1195}
          decoding="async"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      )}

      {/* Seamless Radial & Inset Edge Feather matching Panel Tone */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: `inset 0 0 28px 14px ${featherColor}`,
        }}
      />
    </div>
  );
};
