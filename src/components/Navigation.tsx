/**
 * @g66/storefront-sdk — gourmet-food Navigation
 *
 * Phase 4 §4.1: F&B storefront navigation with:
 * - Sticky header with transparent → solid background on scroll
 * - Restaurant name + logo area
 * - Mobile hamburger menu with slide-over drawer
 * - Cart badge with item count
 * - Login/account link
 * - Vietnamese labels
 *
 * @example
 * ```tsx
 * <Navigation
 *   restaurantName="Cà phê Trung Nguyên"
 *   cartItemCount={3}
 *   onCartClick={() => setCartOpen(true)}
 *   onLoginClick={() => router.push('/login')}
 * />
 * ```
 */
'use client';

import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  Menu,
  X,
  Search,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// ─── Types ──────────────────────────────────────────────

export interface NavItem {
  /** Display label */
  label: string;
  /** Navigation href or click handler */
  href?: string;
  onClick?: () => void;
  /** Whether this item is currently active */
  active?: boolean;
}

export interface NavigationProps {
  /** Restaurant name displayed in header */
  restaurantName: string;
  /** Navigation items (defaults to F&B standard items) */
  items?: NavItem[];
  /** Number of items in cart (shows badge) */
  cartItemCount?: number;
  /** Whether user is logged in */
  isLoggedIn?: boolean;
  /** Called when cart icon is clicked */
  onCartClick?: () => void;
  /** Called when login/account icon is clicked */
  onLoginClick?: () => void;
  /** Called when search icon is clicked */
  onSearchClick?: () => void;
  /** Called when phone/order button is clicked */
  onPhoneClick?: () => void;
  /** Phone number to display */
  phoneNumber?: string;
  /** Labels (Vietnamese defaults) */
  labels?: {
    menu?: string;
    cart?: string;
    login?: string;
    account?: string;
    search?: string;
    callToOrder?: string;
    closeMenu?: string;
  };
  /** Additional CSS class */
  className?: string;
}

const DEFAULT_LABELS = {
  menu: 'Menu',
  cart: 'Giỏ hàng',
  login: 'Đăng nhập',
  account: 'Tài khoản',
  search: 'Tìm kiếm',
  callToOrder: 'Gọi đặt hàng',
  closeMenu: 'Đóng',
};

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Thực đơn', href: '/menu' },
  { label: 'Khuyến mãi', href: '/promotions' },
  { label: 'Về chúng tôi', href: '/about' },
];

// ─── Component ──────────────────────────────────────────

/**
 * Navigation — F&B storefront sticky header with mobile drawer.
 *
 * Desktop: Logo | Nav items | Search | Cart | Login
 * Mobile:  Logo | Cart badge | Hamburger → slide-over drawer
 */
export function Navigation({
  restaurantName,
  items,
  cartItemCount = 0,
  isLoggedIn = false,
  onCartClick,
  onLoginClick,
  onSearchClick,
  onPhoneClick,
  phoneNumber,
  labels,
  className,
}: NavigationProps) {
  const lbl = { ...DEFAULT_LABELS, ...labels };
  const navItems = items ?? DEFAULT_NAV_ITEMS;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll for transparent → solid header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={[
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-transparent',
          className,
        ].filter(Boolean).join(' ')}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Restaurant name */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <span className="font-serif font-bold text-lg text-foreground hidden sm:block">
                {restaurantName}
              </span>
            </div>

            {/* Center: Desktop nav items */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? 'default' : 'ghost'}
                  size="sm"
                  className="text-sm font-medium"
                  onClick={item.onClick ?? (() => {
                    if (item.href) window.location.href = item.href;
                  })}
                >
                  {item.label}
                </Button>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
              {/* Phone (desktop) */}
              {phoneNumber && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex gap-1.5 text-sm"
                  onClick={onPhoneClick ?? (() => { window.location.href = `tel:${phoneNumber}`; })}
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden xl:inline">{phoneNumber}</span>
                </Button>
              )}

              {/* Search */}
              {onSearchClick && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onSearchClick}
                  aria-label={lbl.search}
                >
                  <Search className="h-4.5 w-4.5" />
                </Button>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative"
                onClick={onCartClick}
                aria-label={lbl.cart}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-[10px] px-1"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* Login/Account */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hidden sm:flex"
                onClick={onLoginClick}
                aria-label={isLoggedIn ? lbl.account : lbl.login}
              >
                <User className="h-4.5 w-4.5" />
              </Button>

              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label={lbl.menu}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-over drawer */}
      <div
        className={[
          'fixed top-0 right-0 z-[70] h-full w-72 bg-background shadow-xl transition-transform duration-300 md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-serif font-bold text-lg">{restaurantName}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label={lbl.closeMenu}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? 'default' : 'ghost'}
              className="w-full justify-start text-base"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (item.onClick) {
                  item.onClick();
                } else if (item.href) {
                  window.location.href = item.href;
                }
              }}
            >
              {item.label}
            </Button>
          ))}

          <Separator className="my-3" />

          {/* Mobile actions */}
          {onSearchClick && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-base"
              onClick={() => { setIsMobileMenuOpen(false); onSearchClick(); }}
            >
              <Search className="h-4 w-4" />
              {lbl.search}
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-base"
            onClick={() => { setIsMobileMenuOpen(false); onLoginClick?.(); }}
          >
            <User className="h-4 w-4" />
            {isLoggedIn ? lbl.account : lbl.login}
          </Button>

          {phoneNumber && (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-base"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onPhoneClick) onPhoneClick();
                else window.location.href = `tel:${phoneNumber}`;
              }}
            >
              <Phone className="h-4 w-4" />
              {lbl.callToOrder}
            </Button>
          )}
        </nav>
      </div>
    </>
  );
}
