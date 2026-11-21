import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ScaleId = 'pyme' | 'corporativo' | 'industrial';

interface ScaleArchitectureVisualProps {
  scale: ScaleId;
}

const SCALE_CAPTION: Record<ScaleId, string> = {
  pyme: '1 SITIO · DESPLIEGUE ÁGIL',
  corporativo: 'MULTI-PISO · RED UNIFICADA',
  industrial: 'ESCALA NACIONAL · STOCK DEDICADO',
};

const IsoPrism: React.FC<{
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  orangeCap?: boolean;
  delay?: number;
}> = ({ cx, cy, w = 36, h = 24, orangeCap = false, delay = 0 }) => {
  const dy = w * 0.577;
  const topPts = `${cx},${cy - dy} ${cx + w},${cy} ${cx},${cy + dy} ${cx - w},${cy}`;
  const leftPts = `${cx - w},${cy} ${cx},${cy + dy} ${cx},${cy + dy + h} ${cx - w},${cy + h}`;
  const rightPts = `${cx},${cy + dy} ${cx + w},${cy} ${cx + w},${cy + h} ${cx},${cy + dy + h}`;

  return (
    <motion.g
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <polygon
        points={leftPts}
        fill="#141418"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1"
      />
      <polygon
        points={rightPts}
        fill="#0D0D10"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <polygon
        points={topPts}
        fill={orangeCap ? '#EA6B1A' : '#24242B'}
        stroke={orangeCap ? '#FF9A52' : 'rgba(255,255,255,0.28)'}
        strokeWidth="1.2"
      />
    </motion.g>
  );
};

export const ScaleArchitectureVisual: React.FC<ScaleArchitectureVisualProps> = ({
  scale,
}) => {
  return (
    <div className="relative w-full h-[230px] sm:h-[260px] flex items-center justify-center select-none overflow-hidden">
      {/* Subtle Radial Core Glow */}
      <div
        className="pointer-events-none absolute inset-4 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(234, 107, 26, 0.16) 0%, transparent 66%)',
        }}
      />

      <AnimatePresence mode="wait">
        <motion.svg
          key={scale}
          viewBox="0 0 420 260"
          fill="none"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[380px] h-full"
        >
          {/* Ground isometric architectural blueprint grid ring */}
          <ellipse
            cx="210"
            cy="154"
            rx="145"
            ry="62"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />

          {scale === 'pyme' && (
            <g>
              {/* Single compact node + 2 endpoint satellites */}
              <motion.line
                x1="210"
                y1="115"
                x2="112"
                y2="148"
                stroke="#EA6B1A"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [0, -16] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              />
              <motion.line
                x1="210"
                y1="115"
                x2="308"
                y2="148"
                stroke="#EA6B1A"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [0, -16] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              />

              <IsoPrism cx={210} cy={104} w={46} h={42} orangeCap={false} delay={0.04} />
              {/* Floating Orange Core Cap */}
              <motion.g
                animate={{ y: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
              >
                <IsoPrism cx={210} cy={66} w={20} h={18} orangeCap delay={0.12} />
              </motion.g>

              <circle cx="112" cy="148" r="7" fill="#18181D" stroke="#EA6B1A" strokeWidth="1.6" />
              <circle cx="308" cy="148" r="7" fill="#18181D" stroke="#EA6B1A" strokeWidth="1.6" />
            </g>
          )}

          {scale === 'corporativo' && (
            <g>
              {/* 3 Interconnected Campus Monoliths + Optical Fiber Triangle */}
              <line x1="210" y1="74" x2="128" y2="142" stroke="#EA6B1A" strokeWidth="1.4" strokeOpacity="0.6" />
              <line x1="210" y1="74" x2="292" y2="142" stroke="#EA6B1A" strokeWidth="1.4" strokeOpacity="0.6" />
              <line x1="128" y1="142" x2="292" y2="142" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />

              {/* Rear Apex Hub */}
              <IsoPrism cx={210} cy={70} w={34} h={44} orangeCap delay={0.04} />
              {/* Front Left Campus Block */}
              <IsoPrism cx={128} cy={130} w={38} h={34} delay={0.1} />
              {/* Front Right Campus Block */}
              <IsoPrism cx={292} cy={130} w={38} h={34} delay={0.16} />

              {/* Traveling Data Pulse */}
              <motion.circle
                r="3.2"
                fill="#FF8D42"
                animate={{ cx: [210, 128, 292, 210], cy: [74, 142, 142, 74] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              />
            </g>
          )}

          {scale === 'industrial' && (
            <g>
              {/* Outer Dedicated Perimeter Ring */}
              <ellipse
                cx="210"
                cy="148"
                rx="168"
                ry="72"
                stroke="#EA6B1A"
                strokeOpacity="0.32"
                strokeWidth="1.2"
              />

              {/* 3x3 Staggered Isometric National Infrastructure Grid */}
              {[
                { cx: 210, cy: 62, h: 36, cap: false, d: 0.02 },
                { cx: 162, cy: 88, h: 32, cap: false, d: 0.05 },
                { cx: 258, cy: 88, h: 32, cap: false, d: 0.08 },
                { cx: 114, cy: 114, h: 28, cap: false, d: 0.11 },
                { cx: 210, cy: 112, h: 48, cap: true, d: 0.14 },
                { cx: 306, cy: 114, h: 28, cap: false, d: 0.17 },
                { cx: 162, cy: 140, h: 30, cap: false, d: 0.2 },
                { cx: 258, cy: 140, h: 30, cap: false, d: 0.23 },
                { cx: 210, cy: 168, h: 26, cap: false, d: 0.26 },
              ].map((node, i) => (
                <IsoPrism
                  key={i}
                  cx={node.cx}
                  cy={node.cy}
                  w={22}
                  h={node.h}
                  orangeCap={node.cap}
                  delay={node.d}
                />
              ))}
            </g>
          )}
        </motion.svg>
      </AnimatePresence>

      {/* Bottom Minimal Telemetry Caption */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
        <span className="font-mono text-[10px] tracking-[0.14em] text-silver whitespace-nowrap">
          {SCALE_CAPTION[scale]}
        </span>
      </div>
    </div>
  );
};
