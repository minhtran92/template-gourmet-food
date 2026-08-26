'use client';

/**
 * gourmet-food HomePage — F&B storefront layout.
 *
 * Chỉ chứa giao diện: hero banner + menu category nav + dish grid.
 * Products fetch từ main app API (/api/pancake/[slug]/products).
 * Payment, Cart, Checkout, Auth = main app (dùng chung).
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, UtensilsCrossed, Coffee, Cake } from 'lucide-react';
import { gourmetFoodTheme } from '../theme';
import type { ThemeConfig } from '../theme';

// ─── Props (đơn giản — chỉ tenant context) ─────────────

export interface HomePageProps {
  tenant: {
    slug: string;
    name: string;
    isConfigured: boolean;
  };
  theme?: ThemeConfig;
}

// ─── Component ──────────────────────────────────────────

export function GourmetFoodHomePage({ tenant, theme = gourmetFoodTheme }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const colors = theme.colors;

  // Fetch products từ main app API (public, cached)
  const { data, isLoading } = useQuery({
    queryKey: ['products', tenant.slug],
    queryFn: async () => {
      const res = await fetch(`/api/pancake/${tenant.slug}/products?page=1&limit=20`);
      if (!res.ok) return { products: [] as Product[] };
      const json = await res.json();
      return { products: json.products ?? json.data?.products ?? [] };
    },
    staleTime: 30_000,
    enabled: tenant.isConfigured,
  });

  const products = data?.products ?? [];

  const categories = [
    { id: 'all', name: 'Tất cả', icon: ShoppingBag },
    { id: 'drinks', name: 'Đồ uống', icon: Coffee },
    { id: 'food', name: 'Món ăn', icon: UtensilsCrossed },
    { id: 'dessert', name: 'Tráng miệng', icon: Cake },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero */}
      <div
        className="relative h-48 md:h-64 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}22, ${colors.accent}11)`,
          borderBottom: `3px solid ${colors.primary}`,
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: colors.accent }}>
            {tenant.name}
          </h1>
          {tenant.isConfigured ? (
            <p className="mt-2 text-sm" style={{ color: colors.mutedForeground }}>
              Thực phẩm & đồ uống tươi ngon mỗi ngày
            </p>
          ) : (
            <p className="mt-2 text-sm" style={{ color: colors.mutedForeground }}>⏳ Coming Soon</p>
          )}
        </div>
      </div>

      {/* Menu category nav */}
      <div
        className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{ backgroundColor: `${colors.surface}F0`, borderColor: colors.border }}
      >
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

      {/* Dish grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: colors.accent }}>
          Món nổi bật
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg animate-pulse" style={{ backgroundColor: colors.muted, height: '180px' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: colors.mutedForeground }}>
            Chưa có sản phẩm nào.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.slice(0, 12).map((p) => (
              <div
                key={p.id}
                className="rounded-lg overflow-hidden border transition-shadow hover:shadow-lg"
                style={{ backgroundColor: colors.surface, borderColor: colors.border }}
              >
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center" style={{ backgroundColor: colors.muted }}>
                    <UtensilsCrossed className="h-8 w-8" style={{ color: colors.mutedForeground }} />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate" style={{ color: colors.accentForeground }}>
                    {p.name}
                  </h3>
                  {p.price > 0 && (
                    <p className="mt-1 text-sm font-bold" style={{ color: colors.primary }}>
                      {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
}
