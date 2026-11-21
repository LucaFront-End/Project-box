import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'mark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandMark: React.FC<{
  monolithColor?: string;
  sizeClass?: string;
}> = ({ monolithColor = '#121212', sizeClass = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={sizeClass}
    aria-hidden="true"
  >
    {/* Notched Monolith Square */}
    <path
      d="M10 18H56V42H80V90H10V18Z"
      fill={monolithColor}
    />
    {/* Detached Signal Orange Cube */}
    <rect x="64" y="8" width="26" height="26" fill="#EA6B1A" />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
}) => {
  const monolithColor = variant === 'light' ? '#FFFFFF' : '#121212';
  const textColor = variant === 'light' ? 'text-white' : 'text-obsidian';

  const markSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  const wordSizes = {
    sm: 'text-[14px]',
    md: 'text-[16px]',
    lg: 'text-[20px]',
  };

  if (variant === 'mark') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <BrandMark monolithColor="#121212" sizeClass={markSizes[size]} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <BrandMark monolithColor={monolithColor} sizeClass={markSizes[size]} />
      <span
        className={`font-display font-bold tracking-[0.06em] uppercase leading-none ${wordSizes[size]}`}
      >
        <span className={textColor}>PROJECT</span>
        <span className="text-signal">BOX.</span>
      </span>
    </span>
  );
};
