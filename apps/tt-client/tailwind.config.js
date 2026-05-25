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
        /* Brand Theme */
        primary: '#8A0012',
        secondary: '#C1121F',

        /* Premium Blacks */
        background: {
          950: '#000000',
          900: '#030303',
          800: '#070707',
          700: '#101010',
          600: '#161616',
        },

        /* Premium Blood Reds */
        brand: {
          950: '#1A0004',
          900: '#260006',
          800: '#3A000A',
          700: '#54000E',
          600: '#8A0012',
          500: '#B30017',
          400: '#D90429',
          300: '#FF2B45',
        },

        /* Glass Theme */
        glass: {
          DEFAULT:
            'rgba(255,255,255,0.04)',

          strong:
            'rgba(255,255,255,0.06)',
        },

        borderGlass:
          'rgba(255,255,255,0.06)',
      },

      borderRadius: {
        card: '28px',
        container: '36px',
      },

      boxShadow: {
        /* Deep premium shadow */
        glow:
          '0 20px 50px rgba(0,0,0,0.75)',

        /* Subtle red ambient glow */
        redGlow:
          '0 0 35px rgba(138,0,18,0.18)',

        /* Extra soft red atmosphere */
        subtleRed:
          '0 0 80px rgba(179,0,23,0.08)',
      },

      backdropBlur: {
        glass: '24px',
      },

      backgroundImage: {
        /* Main Premium App Background */
        appGradient: `
          radial-gradient(
            circle at top left,
            rgba(138,0,18,0.10),
            transparent 22%
          ),

          radial-gradient(
            circle at top right,
            rgba(217,4,41,0.06),
            transparent 20%
          ),

          radial-gradient(
            circle at bottom center,
            rgba(179,0,23,0.05),
            transparent 25%
          ),

          linear-gradient(
            145deg,
            #000000 0%,
            #020202 18%,
            #050505 45%,
            #080808 68%,
            #120005 100%
          )
        `,

        /* Premium Red CTA Button */
        redGradient:
          'linear-gradient(135deg, #3A000A 0%, #8A0012 45%, #D90429 100%)',

        /* Optional card gradient */
        cardGradient:
          'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      },
    },
  },

  plugins: [],
};