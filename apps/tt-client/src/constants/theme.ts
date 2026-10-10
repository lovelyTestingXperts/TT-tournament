/**
 * Global Design System Tokens & Source of Truth for TX Sports
 * All theme dimensions, colors, glass properties, and radiuses are exported from here.
 */

export const themeConfig = {
  // Border radius scale: Clean, modern, crisp (replacing ultra-pill 28px/36px)
  radius: {
    none: '0px',
    xs: '4px',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    '2xl': '22px',
    full: '9999px',
  },

  // Color Palette & Gradients
  colors: {
    brand: {
      primary: '#E60026',    // Electric crimson
      vibrant: '#FF1744',    // Bright vivid red highlight
      accent: '#FF4569',     // Glowing neon red accent
      dark: '#850014',       // Deep scarlet
      deep: '#3D0009',       // Dark wine red
      ambient: 'rgba(230, 0, 38, 0.15)',
      glow: 'rgba(255, 23, 68, 0.28)',
    },
    surface: {
      background: '#07080B', // Deep obsidian night
      panel: '#0E1118',      // Sleek tech card / sidebar base
      card: '#131722',       // Elevated surface
      cardHover: '#181E2C',  // Hovered surface
      input: '#0B0D14',      // Distinct input background
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.07)',
      default: 'rgba(255, 255, 255, 0.12)',
      hover: 'rgba(255, 255, 255, 0.22)',
      brand: 'rgba(230, 0, 38, 0.45)',
      brandActive: 'rgba(255, 23, 68, 0.75)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8', // Slate 400 - high contrast readability
      muted: '#64748B',     // Slate 500
      accent: '#FF4569',
    },
    status: {
      active: {
        bg: 'rgba(16, 185, 129, 0.12)',
        border: 'rgba(16, 185, 129, 0.3)',
        text: '#34D399',
        dot: '#10B981',
      },
      inactive: {
        bg: 'rgba(100, 116, 139, 0.12)',
        border: 'rgba(100, 116, 139, 0.25)',
        text: '#94A3B8',
        dot: '#64748B',
      },
      warning: {
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.3)',
        text: '#FBBF24',
        dot: '#F59E0B',
      },
    },
  },
} as const;

export default themeConfig;
