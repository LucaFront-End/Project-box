import React, { useRef, useState } from 'react';
import { Moon, Search, Sun } from 'lucide-react';

interface ProductOpticalLoupeProps {
  src: string;
  alt: string;
}

export const ProductOpticalLoupe: React.FC<ProductOpticalLoupeProps> = ({
  src,
  alt,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [darkStudio, setDarkStudio] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50, px: 0, py: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = Math.min(100, Math.max(0, (px / rect.width) * 100));
    const y = Math.min(100, Math.max(0, (py / rect.height) * 100));
    setPos({ x, y, px, py });
  };

  return (
    <div className="space-y-4">
      <div
        ref={stageRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={handleMouseMove}
        className={`relative w-full aspect-[4/3] rounded-[28px] overflow-hidden border transition-colors duration-500 cursor-crosshair select-none flex items-center justify-center ${
          darkStudio
            ? 'bg-obsidian border-white/15'
            : 'bg-alabaster border-obsidian/[0.08]'
        }`}
      >
        <img
          src={src}
          alt={alt}
          width={1600}
          height={1195}
          decoding="async"
          className={`w-full h-full object-cover transition-all duration-500 ${
            darkStudio ? 'brightness-[0.82] contrast-[1.15]' : 'brightness-100'
          }`}
        />

        {/* Seamless Edge Vignette */}
        <div
          className="pointer-events-none absolute inset-0 transition-shadow duration-500"
          style={{
            boxShadow: darkStudio
              ? 'inset 0 0 44px 20px #121212'
              : 'inset 0 0 36px 14px #F5F5F7',
          }}
        />

        {/* Circular 2.2x Optical Macro Loupe */}
        {hovering && (
          <div
            className="hidden sm:block pointer-events-none absolute w-[156px] h-[156px] rounded-full border-2 border-signal/80 shadow-[0_18px_50px_rgba(0,0,0,0.35)] z-20"
            style={{
              left: pos.px - 78,
              top: pos.py - 78,
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '220% 220%',
              backgroundPosition: `${pos.x}% ${pos.y}%`,
              filter: darkStudio ? 'brightness(0.86) contrast(1.18)' : 'none',
            }}
          >
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30" />
          </div>
        )}

        {/* Top-Left Loupe Hint */}
        <div
          className={`pointer-events-none absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono backdrop-blur-md border transition-colors ${
            darkStudio
              ? 'bg-white/10 border-white/15 text-white/85'
              : 'bg-white/80 border-obsidian/10 text-obsidian/75'
          }`}
        >
          <Search className="w-3 h-3 text-signal" />
          <span>MACRO LUPA 2.2×</span>
        </div>
      </div>

      {/* Studio Lighting Switch */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-graphite">
          Desliza sobre el equipo para inspeccionar detalles CNC
        </span>

        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-alabaster border border-obsidian/[0.08]">
          <button
            type="button"
            onClick={() => setDarkStudio(false)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              !darkStudio ? 'bg-white text-obsidian shadow-sm' : 'text-graphite'
            }`}
          >
            <Sun className="w-3 h-3 text-signal" />
            Claro
          </button>
          <button
            type="button"
            onClick={() => setDarkStudio(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              darkStudio ? 'bg-obsidian text-white shadow-sm' : 'text-graphite'
            }`}
          >
            <Moon className="w-3 h-3 text-signal" />
            Estudio
          </button>
        </div>
      </div>
    </div>
  );
};
