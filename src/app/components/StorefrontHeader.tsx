'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../lib/cart-store';
import type { ThemeConfig } from '../theme';

export interface StorefrontHeaderProps {
  tenantName: string;
  tenantSlug: string;
  isConfigured: boolean;
  theme: ThemeConfig;
  /** Slot cho login/logout — main app inject */
  authSlot?: React.ReactNode;
}

/**
 * F&B StorefrontHeader — custom header cho gourmet-food template.
 * 
 * Khác header mặc định:
 * - Có accent strip màu primary ở top
 * - Logo icon (coffee cup SVG) bên trái
 * - Tagline nhỏ dưới tên shop
 * - authSlot (login/logout) bên phải, styled với theme
 */
export function StorefrontHeader({ tenantName, tenantSlug, isConfigured, theme, authSlot }: StorefrontHeaderProps) {
  const c = theme.colors;
  const router = useRouter();
  const cartCount = useCart(s => s.count());

  return (
    <>
      {/* Accent strip */}
      <div className="h-1" style={{ backgroundColor: c.primary }} aria-hidden />

      {/* Header */}
      <header
        className="border-b backdrop-blur-sm sticky top-0 z-20"
        style={{ backgroundColor: `${c.surface}F0`, borderColor: c.border }}
      >
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          {/* Left: back + coffee icon + name + tagline */}
          <div className="flex items-center gap-2 min-w-0">
            <a href="/" style={{ color: c.mutedForeground }} className="shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </a>

            {/* Coffee cup icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c.primary} strokeWidth="2" className="shrink-0">
              <path d="M18 8h1a4 4 0 010 8h-1" />
              <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>

            <div className="min-w-0">
              <h1 className="font-semibold text-sm md:text-base truncate" style={{ color: c.accent }}>
                {tenantName}
              </h1>
              <p className="text-[10px] truncate hidden md:block" style={{ color: c.mutedForeground }}>
                {isConfigured ? 'Đặt món trực tuyến' : 'Coming Soon'}
              </p>
            </div>
          </div>

          {/* Right: cart + auth slot */}
          <div className="shrink-0 flex items-center gap-2">
            {/* Cart icon with badge */}
            <button
              onClick={() => router.push(`/shop/${tenantSlug}/cart`)}
              className="relative p-2 rounded-full"
              style={{ backgroundColor: c.muted }}
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="h-4 w-4" style={{ color: c.accent }} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: c.primary, color: c.primaryForeground }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth slot (login/logout — injected by main app) */}
            {authSlot}
          </div>
        </div>
      </header>
    </>
  );
}
