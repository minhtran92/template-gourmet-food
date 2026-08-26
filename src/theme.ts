/**
 * @g66/storefront-sdk — gourmet-food Theme
 *
 * Phase 4 §4.3: Theme configuration for F&B (Food & Beverage) template.
 * Warm, inviting color palette — coffee/wood tones suitable for
 * restaurants, cafes, bakeries, and food delivery.
 *
 * @example
 * ```tsx
 * import { gourmetFoodTheme } from '@g66/storefront-sdk/templates/gourmet-food';
 * <ThemeProvider theme={gourmetFoodTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
import type { ThemeConfig } from '../../theme/types';

/** gourmet-food theme — warm coffee/wood palette for F&B */
export const gourmetFoodTheme: ThemeConfig = {
  colors: {
    /** Primary: Warm brown-caramel — coffee tone */
    primary: '#D4A574',
    primaryForeground: '#2D1810',

    /** Accent: Dark chocolate brown */
    accent: '#8B4513',
    accentForeground: '#FFFFFF',

    /** Background: Warm cream */
    background: '#FFF8F0',

    /** Surface: White cards on cream background */
    surface: '#FFFFFF',
    surfaceForeground: '#2D1810',

    /** Border: Light warm gray */
    border: '#E8DDD0',

    /** Muted: Warm light beige */
    muted: '#F5EDE4',
    mutedForeground: '#8B7355',

    /** Destructive: Warm red for errors */
    destructive: '#C0392B',
  },

  typography: {
    /** Playfair Display for headings — elegant, F&B feel */
    headingFont: "'Playfair Display', 'Georgia', serif",
    /** Inter for body — clean, modern readability */
    bodyFont: "'Inter', system-ui, sans-serif",
    headingSizes: {
      h1: '2.5rem',   // Hero heading
      h2: '1.75rem',  // Section heading
      h3: '1.25rem',  // Card heading
      h4: '1rem',     // Small heading
    },
    bodySize: '0.9375rem',  // 15px — slightly larger for menu readability
    smallSize: '0.8125rem', // 13px
  },

  spacing: {
    unit: 4,
    /** Larger radius for soft, friendly feel */
    radius: '0.75rem',
  },
};

/** Dark mode variant — moody, upscale restaurant feel */
export const gourmetFoodDarkTheme: ThemeConfig = {
  colors: {
    primary: '#C8956C',
    primaryForeground: '#1A0F08',
    accent: '#A0522D',
    accentForeground: '#FFFFFF',
    background: '#1A1210',
    surface: '#2A1F18',
    surfaceForeground: '#F5EDE4',
    border: '#3D2E22',
    muted: '#352A20',
    mutedForeground: '#A89880',
    destructive: '#E74C3C',
  },
  typography: gourmetFoodTheme.typography,
  spacing: gourmetFoodTheme.spacing,
};
