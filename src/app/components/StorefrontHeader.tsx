'use client';

import type { ThemeConfig } from '../theme';

export interface StorefrontHeaderProps {
  tenantName: string;
  tenantSlug: string;
  isConfigured: boolean;
  theme: ThemeConfig;
  /** Slot cho login/logout — main app inject StorefrontHeader component */
  authSlot?: React.ReactNode;
}

/**
 * StorefrontHeader — header chung cho template.
 * 
 * Template designer có thể custom header (colors, layout) nhưng
 * phần login/logout (authSlot) do main app inject.
 * 
 * Cách hoạt động:
 * - Main app render <StorefrontHeader authSlot={<StorefrontHeaderLogin />}>
 * - Template designer chỉ lo layout + colors
 * - Nếu authSlot không truyền → không hiện login/logout
 */
export function StorefrontHeader({ tenantName, tenantSlug, isConfigured, theme, authSlot }: StorefrontHeaderProps) {
  const c = theme.colors;

  return (
    <header
      className="border-b backdrop-blur-sm sticky top-0 z-20"
      style={{ backgroundColor: `${c.surface}F0`, borderColor: c.border }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: back + shop name */}
        <div className="flex items-center gap-2">
          <a href="/" style={{ color: c.mutedForeground }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="font-semibold" style={{ color: c.accent }}>
            {tenantName}
          </h1>
        </div>

        {/* Right: auth slot (login/logout — injected by main app) */}
        {authSlot}
      </div>
    </header>
  );
}
