/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        obsidian: '#121212',
        studio: '#0A0A0C',
        signal: {
          DEFAULT: '#EA6B1A',
          glow: '#FF7D29',
          soft: 'rgba(234, 107, 26, 0.10)',
        },
        alabaster: '#F5F5F7',
        gallery: '#FBFBFD',
        graphite: '#6E6E73',
        silver: '#A1A1A6',
      },
      letterSpacing: {
        editorial: '-0.045em',
        tightish: '-0.03em',
        widestTech: '0.18em',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(0.96)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 3.6s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
