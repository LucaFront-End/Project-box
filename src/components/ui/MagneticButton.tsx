import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'obsidian' | 'signal' | 'light' | 'ghost-dark' | 'ghost-light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  variant = 'obsidian',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20 });
  const springY = useSpring(y, { stiffness: 260, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    obsidian:
      'bg-obsidian text-white hover:bg-[#1f1f22] shadow-[0_8px_24px_rgba(18,18,18,0.16)]',
    signal:
      'bg-signal text-white hover:bg-signal-glow shadow-[0_8px_28px_rgba(234,107,26,0.30)]',
    light:
      'bg-white text-obsidian hover:bg-alabaster shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
    'ghost-dark':
      'bg-obsidian/[0.04] text-obsidian border border-obsidian/15 hover:border-obsidian/35 hover:bg-obsidian/[0.07]',
    'ghost-light':
      'bg-white/[0.06] text-white border border-white/15 hover:border-white/35 hover:bg-white/[0.12]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-7 py-3.5 text-sm md:text-[15px]',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
