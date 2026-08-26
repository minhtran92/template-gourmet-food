'use client';

/**
 * gourmet-food HomePage — F&B storefront layout.
 *
 * Phase 2: implements HomePageProps from page-props.ts.
 * Layout: hero banner + menu category nav + featured dishes grid.
 * Products fetched client-side via /api/pancake/[slug]/products (public, cached).
 * Colors from theme.colors.* (not hardcoded — theme switching changes layout).
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, UtensilsCrossed, Coffee, Cake } from 'lucide-react';
import type { HomePageProps } from '../../../types/page-props';
import type { TenantContext } from '../../../types/page-props';

// Product type (minimal — from Pancake API)
interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  slug?: string;
}

// Category icons
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Đồ uống': Coffee,
  'Món ăn': UtensilsCrossed,
  'Tráng miệng': Cake,
  default: ShoppingBag,
};

export function GourmetFoodHomePage({ tenant, theme }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Fetch products client-side (public endpoint, cached 30s)
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['storefront-products', tenant.slug],
    queryFn: async () => {
      const res = await fetch(`/api/pancake/${tenant.slug}/products?page=1&limit=20`);
      if (!res.ok) return { products: [] as Product[] };
      const data = await res.json();
      return { products: data.products ?? data.data?.products ?? [] };
    },
    staleTime: 30_000,
    enabled: tenant.isConfigured,
  });

  const products = productsData?.products ?? [];
  const colors = theme.colors;

  // Category nav (derived from products or static)
  const categories = [
    { id: 'all', name: 'Tất cả', icon: ShoppingBag },
    { id: 'drinks', name: 'Đồ uống', icon: Coffee },
    { id: 'food', name: 'Món ăn', icon: UtensilsCrossed },
    { id: 'dessert', name: 'Tráng miệng', icon: Cake },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero banner */}
      <div
        className="relative h-48 md:h-64 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}22, ${colors.accent}11)`,
          borderBottom: `3px solid ${colors.primary}`,
        }}
      >
        <div className="text-center px-4">
          <h1
            className="text-2xl md:text-4xl font-bold"
            style={{ color: colors.accent }}
          >
            {tenant.name}
          </h1>
          {tenant.isConfigured ? (
            <p className="mt-2 text-sm md:text-base" style={{ color: colors.mutedForeground }}>
              Thực phẩm & đồ uống tươi ngon mỗi ngày
            </p>
          ) : (
            <p className="mt-2 text-sm" style={{ color: colors.mutedForeground }}>
              ⏳ Coming Soon
            </p>
          )}
        </div>
      </div>

      {/* Menu category nav */}
      <div className="sticky top-0 z-10 border-b backdrop-blur-sm" style={{ backgroundColor: `${colors.surface}F0`, borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto px-4 py-2 flex gap-1 overflow-x-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: isActive ? colors.primary : 'transparent',
                  color: isActive ? colors.primaryForeground : colors.mutedForeground,
                }}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured dishes grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.accent }}>
          Món nổi bật
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg animate-pulse"
                style={{ backgroundColor: colors.muted, height: '180px' }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: colors.mutedForeground }}>
            Chưa có sản phẩm nào.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.slice(0, 12).map((product) => (
              <DishCard
                key={product.id}
                product={product}
                colors={colors}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dish card component ────────────────────────────────

function DishCard({
  product,
  colors,
}: {
  product: Product;
  colors: ThemeColors;
}) {
  const imageUrl = product.images?.[0];
  const priceText = product.price > 0
    ? new Intl.NumberFormat('vi-VN').format(product.price) + 'đ'
    : '';

  return (
    <div
      className="rounded-lg overflow-hidden border transition-shadow hover:shadow-lg"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div
          className="w-full h-32 flex items-center justify-center"
          style={{ backgroundColor: colors.muted }}
        >
          <UtensilsCrossed className="h-8 w-8" style={{ color: colors.mutedForeground }} />
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium truncate" style={{ color: colors.accentForeground }}>
          {product.name}
        </h3>
        {priceText && (
          <p className="mt-1 text-sm font-bold" style={{ color: colors.primary }}>
            {priceText}
          </p>
        )}
      </div>
    </div>
  );
}

// Minimal theme colors type for card
interface ThemeColors {
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
}
