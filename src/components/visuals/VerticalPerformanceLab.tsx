import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VERTICAL_LAB_CONFIG } from '../../data/details';
import { VerticalId } from '../../types/commerce';

interface VerticalPerformanceLabProps {
  verticalId: VerticalId;
}

export const VerticalPerformanceLab: React.FC<VerticalPerformanceLabProps> = ({
  verticalId,
}) => {
  const config = VERTICAL_LAB_CONFIG[verticalId];
  const [value, setValue] = useState<number>(config.defaultValue);

  useEffect(() => {
    setValue(config.defaultValue);
  }, [verticalId, config.defaultValue]);

  const metrics = config.compute(value);

  return (
    <div className="rounded-[32px] bg-white/[0.03] border border-white/10 p-7 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      {/* Left Interactive Control */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-2.5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
            {config.eyebrow}
          </p>
          <h2 className="font-sans font-semibold text-2xl sm:text-4xl tracking-editorial text-white">
            {config.title}
          </h2>
          <p className="text-sm text-silver leading-relaxed max-w-[460px]">
            {config.subtitle}
          </p>
        </div>

        {/* Minimalist Apple-Grade Slider */}
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
          <div className="flex items-baseline justify-between gap-2">
            <label
              htmlFor="vertical-lab-slider"
              className="text-xs font-medium text-white/85"
            >
              {config.sliderLabel}
            </label>
            <span className="font-mono text-lg font-semibold text-signal-glow tabular-nums">
              {value} <span className="text-xs text-silver font-normal">{config.unit}</span>
            </span>
          </div>

          <input
            id="vertical-lab-slider"
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-1.5 bg-white/15 rounded-full appearance-none cursor-pointer accent-[#EA6B1A]"
          />

          <div className="flex items-center justify-between text-[10px] font-mono text-silver/70">
            <span>
              {config.min} {config.unit}
            </span>
            <span className="text-white/75">{metrics.visualHint}</span>
            <span>
              {config.max} {config.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Right Live Animated Telemetry Visualizer */}
      <div className="lg:col-span-6 space-y-6">
        {/* Visual Signal Gauge */}
        <div className="rounded-2xl bg-[#070709] border border-white/10 p-6 space-y-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
              TELEMETRÍA DE DESEMPEÑO EN TIEMPO REAL
            </span>
            <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          </div>

          {/* Animated Segmented Precision Bar */}
          <div
            className="grid gap-1.5 h-10 items-end"
            style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const barThreshold = ((i + 1) / 16) * 100;
              const active = metrics.fillPct >= barThreshold - 4;
              return (
                <motion.div
                  key={i}
                  animate={{
                    height: active ? `${38 + (i % 4) * 15}%` : '22%',
                    opacity: active ? 1 : 0.2,
                  }}
                  transition={{ duration: 0.28 }}
                  className={`rounded-full ${
                    active && i >= 12
                      ? 'bg-signal-glow'
                      : active
                        ? 'bg-signal'
                        : 'bg-white/30'
                  }`}
                />
              );
            })}
          </div>

          {/* 3 Live Output Readouts */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-silver">
                {metrics.primaryLabel}
              </p>
              <p className="font-mono text-lg sm:text-2xl font-semibold text-white mt-0.5 tabular-nums">
                {metrics.primaryValue}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-silver">
                {metrics.secondaryLabel}
              </p>
              <p className="font-mono text-lg sm:text-2xl font-semibold text-signal mt-0.5 tabular-nums">
                {metrics.secondaryValue}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-silver">
                {metrics.tertiaryLabel}
              </p>
              <p className="font-mono text-lg sm:text-2xl font-semibold text-white mt-0.5 tabular-nums">
                {metrics.tertiaryValue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
