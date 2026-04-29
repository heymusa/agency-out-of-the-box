import type { Config } from 'tailwindcss';
import tokens from '../../design-system/tokens.json';

const ACTIVE_BRAND_HUE: keyof typeof tokens.color.brand = 'blue';
const brandPalette = tokens.color.brand[ACTIVE_BRAND_HUE] as Record<string, string>;

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../design-system/**/*.{tsx,jsx,astro}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: tokens.color.neutral,
        brand: brandPalette,
        success: tokens.color.success,
        warning: tokens.color.warning,
        error: tokens.color.error,
      },
      fontFamily: {
        heading: tokens.font.heading.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')),
        sans: tokens.font.body.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')),
        mono: tokens.font.mono.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')),
      },
      fontSize: tokens.fontSize as Config['theme']['extend']['fontSize'],
      fontWeight: tokens.fontWeight,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadow,
      screens: tokens.breakpoint,
    },
  },
  plugins: [],
};

export default config;
