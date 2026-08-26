'use client';

import type { ThemeConfig } from '../theme';

export interface HeroBannerProps {
  name: string;
  isConfigured: boolean;
  subtitle?: string;
  theme: ThemeConfig;
}

export function HeroBanner({ name, isConfigured, subtitle, theme }: HeroBannerProps) {
  const c = theme.colors;
  return (
    <div
      className="relative h-32 md:h-40 flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${c.primary}22, ${c.accent}11)`,
        borderBottom: `3px solid ${c.primary}`,
      }}
    >
      <div className="text-center px-4">
        <h1 className="text-2xl md:text-4xl font-bold" style={{ color: c.accent }}>
          {name}
        </h1>
        <p className="mt-2 text-sm" style={{ color: c.mutedForeground }}>
          {isConfigured ? (subtitle ?? 'Thực phẩm & đồ uống tươi ngon mỗi ngày') : '⏳ Coming Soon'}
        </p>
      </div>
    </div>
  );
}
