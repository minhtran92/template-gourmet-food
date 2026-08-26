/**
 * @g66/storefront-sdk — gourmet-food Layout
 *
 * Phase 4 §4.1: F&B template layout wrapper that composes:
 * - Navigation (sticky header with cart badge, login, search)
 * - Main content area (children)
 * - Footer (restaurant contact, hours, social links)
 *
 * This is the top-level layout component that every F&B page should be
 * wrapped in. It handles:
 * - Transparent → solid header on scroll
 * - Mobile responsive navigation with drawer
 * - Sticky footer that pushes down on overflow
 * - Vietnamese labels throughout
 *
 * @example
 * ```tsx
 * <FnbLayout
 *   restaurantName="Cà phê Trung Nguyên"
 *   footer={{ phone: '028 1234 5678', address: '142 Nguyễn Huệ, Q.1' }}
 *   cartItemCount={3}
 * >
 *   <HomePage hero={...} categories={...} />
 * </FnbLayout>
 * ```
 */
'use client';

import React from 'react';
import { Navigation, type NavigationProps, type NavItem } from './Navigation';
import { Footer, type FooterProps } from './Footer';

// ─── Props ──────────────────────────────────────────────

export interface FnbLayoutProps {
  /** Restaurant name (shared by Nav + Footer) */
  restaurantName: string;
  /** Navigation items (optional — uses F&B defaults) */
  navItems?: NavItem[];
  /** Navigation props (overrides) */
  navProps?: Omit<NavigationProps, 'restaurantName' | 'items'>;
  /** Footer props (optional) */
  footer?: Omit<FooterProps, 'restaurantName'>;
  /** Cart item count (shown in nav badge) */
  cartItemCount?: number;
  /** Whether user is logged in */
  isLoggedIn?: boolean;
  /** Called when cart is clicked */
  onCartClick?: () => void;
  /** Called when login/account is clicked */
  onLoginClick?: () => void;
  /** Called when search is clicked */
  onSearchClick?: () => void;
  /** Children — the page content */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

// ─── Component ──────────────────────────────────────────

/**
 * FnbLayout — Full F&B storefront layout with Nav + main + Footer.
 *
 * Layout structure:
 *   <div min-h-screen flex flex-col>
 *     <Navigation />           — sticky top-0
 *     <main flex-1>            — page content
 *       {children}
 *     </main>
 *     <Footer mt-auto />      — sticky bottom
 *   </div>
 */
export function FnbLayout({
  restaurantName,
  navItems,
  navProps,
  footer,
  cartItemCount = 0,
  isLoggedIn = false,
  onCartClick,
  onLoginClick,
  onSearchClick,
  children,
  className,
}: FnbLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className ?? ''}`}>
      {/* ── Navigation ─────────────────────────────── */}
      <Navigation
        restaurantName={restaurantName}
        items={navItems}
        cartItemCount={cartItemCount}
        isLoggedIn={isLoggedIn}
        onCartClick={onCartClick}
        onLoginClick={onLoginClick}
        onSearchClick={onSearchClick}
        phoneNumber={footer?.phone}
        {...navProps}
      />

      {/* ── Main content ───────────────────────────── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <Footer
        restaurantName={restaurantName}
        phone={footer?.phone}
        address={footer?.address}
        hours={footer?.hours}
        email={footer?.email}
        socialLinks={footer?.socialLinks}
        className="mt-auto"
      />
    </div>
  );
}
