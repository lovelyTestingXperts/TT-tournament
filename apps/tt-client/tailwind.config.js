const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],

  theme: {
    extend: {
      colors: {
        /* Brand Theme - Energetic and Lively */
        primary: {
          DEFAULT: '#E60026',
          hover: '#FF1744',
          glow: 'rgba(230, 0, 38, 0.35)',
        },
        secondary: '#FF4569',

        /* Premium Obsidian & Tech Slate Surfaces */
        surface: {
          950: '#050608',
          900: '#090B10',
          850: '#0D1017',
          800: '#121620',
          750: '#171C29',
          700: '#1E2433',
        },

        /* Vivid Crimson Accents */
        brand: {
          950: '#1A0004',
          900: '#2E0008',
          800: '#4D000D',
          700: '#730013',
          600: '#A3001B',
          500: '#E60026',
          400: '#FF1744',
          300: '#FF4569',
          200: '#FF7D95',
        },

        /* Glass Surface & Borders */
        glass: {
          subtle: 'rgba(255, 255, 255, 0.03)',
          DEFAULT: 'rgba(18, 22, 32, 0.75)',
          elevated: 'rgba(23, 28, 41, 0.85)',
          active: 'rgba(230, 0, 38, 0.12)',
        },

        borderGlass: {
          subtle: 'rgba(255, 255, 255, 0.07)',
          DEFAULT: 'rgba(255, 255, 255, 0.12)',
          bright: 'rgba(255, 255, 255, 0.22)',
          brand: 'rgba(230, 0, 38, 0.45)',
          brandGlow: 'rgba(255, 23, 68, 0.75)',
        },
      },

      borderRadius: {
        /* Modern, refined radius system (replacing bulbous 28px/36px) */
        card: '14px',
        container: '16px',
        panel: '12px',
        button: '10px',
        badge: '8px',
      },

      boxShadow: {
        card: '0 8px 30px rgba(0, 0, 0, 0.45), 0 1px 2px rgba(255, 255, 255, 0.05) inset',
        panel: '0 12px 40px rgba(0, 0, 0, 0.55)',
        brandGlow: '0 0 25px rgba(230, 0, 38, 0.4), 0 4px 15px rgba(230, 0, 38, 0.25)',
        brandSubtle: '0 0 40px rgba(230, 0, 38, 0.15)',
        inputFocus: '0 0 0 2px rgba(230, 0, 38, 0.5), 0 0 20px rgba(230, 0, 38, 0.2)',
      },

      backdropBlur: {
        glass: '16px',
      },

      backgroundImage: {
        /* Lively vibrant gaming/sports dark gradient with active atmospheric warmth */
        appGradient: `
          radial-gradient(
            circle at 15% 0%,
            rgba(230, 0, 38, 0.18),
            transparent 32%
          ),
          radial-gradient(
            circle at 85% 15%,
            rgba(255, 23, 68, 0.12),
            transparent 28%
          ),
          radial-gradient(
            circle at 50% 90%,
            rgba(163, 0, 27, 0.12),
            transparent 35%
          ),
          linear-gradient(
            160deg,
            #07080B 0%,
            #090C12 35%,
            #0C0E16 65%,
            #110910 100%
          )
        `,

        /* Vivid energetic CTA gradient */
        brandGradient: 'linear-gradient(135deg, #B30017 0%, #E60026 50%, #FF2B45 100%)',
        brandGradientHover: 'linear-gradient(135deg, #CC001B 0%, #FF1744 50%, #FF5277 100%)',

        /* Glass highlight gradient */
        cardGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
        sidebarGradient: 'linear-gradient(180deg, rgba(14, 17, 24, 0.88) 0%, rgba(9, 11, 16, 0.95) 100%)',
      },
    },
  },

  plugins: [],
};