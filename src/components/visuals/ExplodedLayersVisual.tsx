import React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface ExplodedLayersVisualProps {
  progress: MotionValue<number>;
  activeStage: number;
}

const LAYER_CALLOUTS = [
  { idx: 0, label: '01 · REDES 10G' },
  { idx: 1, label: '02 · ÓPTICA IA' },
  { idx: 2, label: '03 · ENERGÍA' },
  { idx: 3, label: '04 · EDGE IT' },
];

export const ExplodedLayersVisual: React.FC<ExplodedLayersVisualProps> = ({
  progress,
  activeStage,
}) => {
  // Smooth scroll-scrubbed Z-axis vertical explosion of the 5 4K hardware strata
  const keystoneY = useTransform(progress, [0, 0.22, 0.92, 1], [-58, -198, -210, -210]);
  const layer1Y = useTransform(progress, [0, 0.22, 0.92, 1], [-22, -110, -118, -118]);
  const layer2Y = useTransform(progress, [0, 0.22, 0.92, 1], [0, -32, -34, -34]);
  const layer3Y = useTransform(progress, [0, 0.22, 0.92, 1], [22, 50, 54, 54]);
  const layer4Y = useTransform(progress, [0, 0.22, 0.92, 1], [44, 134, 142, 142]);

  const keystoneScale = useTransform(progress, [0, 0.25, 1], [0.92, 1, 1.04]);
  const spineOpacity = useTransform(progress, [0.04, 0.22], [0.18, 0.9]);

  const yMap = [layer1Y, layer2Y, layer3Y, layer4Y];
  const srcMap = [
    { src: '/visuals/layer-01-network.webp', alt: 'Capa 01 Redes 10G y Wi-Fi 7', zClass: 'z-40' },
    { src: '/visuals/layer-02-security.webp', alt: 'Capa 02 Óptica de Seguridad IA', zClass: 'z-30' },
    { src: '/visuals/layer-03-energy.webp', alt: 'Capa 03 Energía Solar y LiFePO4', zClass: 'z-20' },
    { src: '/visuals/layer-04-compute.webp', alt: 'Capa 04 Cómputo NVMe y Edge IT', zClass: 'z-10' },
  ];

  return (
    <div className="relative w-full max-w-[560px] h-[440px] sm:h-[540px] mx-auto flex items-center justify-center select-none">
      {/* Studio Ambient Light Core */}
      <div
        className="absolute inset-8 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(234, 107, 26, 0.14) 0%, rgba(255, 255, 255, 0.03) 44%, transparent 72%)',
        }}
      />

      {/* Central Precision Optical Spine & Animated Data Pulses */}
      <motion.svg
        style={{ opacity: spineOpacity }}
        viewBox="0 0 200 560"
        fill="none"
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 h-full w-[200px] pointer-events-none z-0"
      >
        <line
          x1="100"
          y1="32"
          x2="100"
          y2="528"
          stroke="#EA6B1A"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <motion.circle
          cx="100"
          r="3"
          fill="#EA6B1A"
          animate={{ cy: [500, 56], opacity: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="100"
          r="2"
          fill="#FFFFFF"
          animate={{ cy: [56, 500], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: 3.1, ease: 'easeInOut', delay: 1.1 }}
        />
      </motion.svg>

      {/* Stacked 4K RGBA Transparent Isometric Slabs (Reverse order DOM or z-index ensures proper overlap) */}
      {[3, 2, 1, 0].map((idx) => {
        const isActive = activeStage === idx;
        const item = srcMap[idx];
        const callout = LAYER_CALLOUTS[idx];

        return (
          <motion.div
            key={item.src}
            style={{ y: yMap[idx] }}
            animate={{
              scale: isActive ? 1.05 : 0.94,
              opacity: isActive ? 1 : 0.45,
            }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute w-[310px] sm:w-[400px] aspect-square flex items-center justify-center pointer-events-none ${item.zClass}`}
          >
            {/* Active Rim Glow Halo */}
            {isActive && (
              <motion.div
                layoutId="activeLayerAura"
                transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                className="absolute inset-12 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(234,107,26,0.22) 0%, transparent 68%)',
                  filter: 'blur(18px)',
                }}
              />
            )}

            <img
              src={item.src}
              alt={item.alt}
              width={1400}
              height={1400}
              decoding="async"
              className="w-full h-full object-contain transition-[filter] duration-500"
              style={{
                filter: isActive
                  ? 'brightness(1.1) contrast(1.04) drop-shadow(0 24px 36px rgba(0,0,0,0.75))'
                  : 'brightness(0.76) saturate(0.85) drop-shadow(0 14px 24px rgba(0,0,0,0.6))',
              }}
            />

            {/* Floating Monospace Telemetry Pill on Active Slab */}
            <motion.div
              animate={{
                opacity: isActive ? 1 : 0.35,
                x: isActive ? 0 : 8,
              }}
              transition={{ duration: 0.3 }}
              className={`hidden sm:flex items-center gap-2 absolute -right-10 md:-right-16 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full border backdrop-blur-md ${
                isActive
                  ? 'bg-obsidian/90 border-signal/60 text-signal-glow shadow-[0_8px_24px_rgba(234,107,26,0.2)]'
                  : 'bg-white/[0.03] border-white/10 text-white/40'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-signal animate-pulse' : 'bg-white/30'
                }`}
              />
              <span className="font-mono text-[10px] tracking-wider whitespace-nowrap">
                {callout.label}
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Floating Keystone Signal Orange 4K CNC Cube at Apex */}
      <motion.div
        style={{ y: keystoneY, scale: keystoneScale }}
        className="absolute z-50 w-[230px] sm:w-[290px] aspect-square flex items-center justify-center pointer-events-none"
      >
        <div
          className="absolute inset-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(234,107,26,0.34) 0%, transparent 65%)',
            filter: 'blur(20px)',
          }}
        />
        <motion.img
          src="/visuals/layer-00-keystone.webp"
          alt="PROJECT BOX Núcleo Keystone Anodizado"
          width={1400}
          height={1400}
          decoding="async"
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
          className="w-full h-full object-contain drop-shadow-[0_18px_30px_rgba(234,107,26,0.28)]"
        />
      </motion.div>
    </div>
  );
};
