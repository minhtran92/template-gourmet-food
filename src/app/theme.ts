import type { ThemeConfig } from './theme-types';

/** gourmet-food theme — warm coffee/wood palette cho F&B */
export const gourmetFoodTheme: ThemeConfig = {
  colors: {
    primary: '#D4A574',
    primaryForeground: '#FFFFFF',
    accent: '#8B4513',
    accentForeground: '#FFFFFF',
    background: '#FFF8F0',
    surface: '#FFFFFF',
    surfaceForeground: '#2D1810',
    border: '#E8DDD0',
    muted: '#F5EDE3',
    mutedForeground: '#8B7D6B',
    destructive: '#C0392B',
  },
  fonts: {
    heading: 'Georgia, serif',
    body: 'system-ui, sans-serif',
  },
  spacing: {
    section: '2rem',
    card: '1rem',
  },
};

export interface ThemeConfig {
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    surface: string;
    surfaceForeground: string;
    border: string;
    muted: string;
    mutedForeground: string;
    destructive: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    section: string;
    card: string;
  };
}
