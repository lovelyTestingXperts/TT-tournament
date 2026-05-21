const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#3B82F6',

        glass: {
          DEFAULT:
            'rgba(255,255,255,0.08)',
        },

        borderGlass:
          'rgba(255,255,255,0.15)',
      },

      borderRadius: {
        card: '28px',
      },

      boxShadow: {
        glow:
          '0 8px 32px rgba(0,0,0,0.25)',
      },

      backdropBlur: {
        glass: '20px',
      },

      backgroundImage: {
        appGradient:
          'linear-gradient(135deg,#b94dd8 0%, #3b82f6 100%)',
      },
    },
  },
  plugins: [],
};
