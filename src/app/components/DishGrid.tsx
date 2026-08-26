'use client';

import { useQuery } from '@tanstack/react-query';
import type { ThemeConfig } from '../theme';
import { DishCard, type Product } from './DishCard';

export interface DishGridProps {
  tenantSlug: string;
  isConfigured: boolean;
  theme: ThemeConfig;
  onProductClick?: (productId: string) => void;
}

export function DishGrid({ tenantSlug, isConfigured, theme, onProductClick }: DishGridProps) {
  const c = theme.colors;

  const { data, isLoading } = useQuery({
    queryKey: ['products', tenantSlug],
    queryFn: async () => {
      const res = await fetch(`/api/pancake/${tenantSlug}/products?page=1&limit=20`);
      if (!res.ok) return { products: [] as Product[] };
      const json = await res.json();
      return { products: json.products ?? json.data?.products ?? [] };
    },
    staleTime: 30_000,
    enabled: isConfigured,
  });

  const products = data?.products ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold mb-4" style={{ color: c.accent }}>
        Món nổi bật
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg animate-pulse" style={{ backgroundColor: c.muted, height: '180px' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: c.mutedForeground }}>
          Chưa có sản phẩm nào.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.slice(0, 12).map((p) => (
            <DishCard key={p.id} product={p} theme={theme} onClick={onProductClick} />
          ))}
        </div>
      )}
    </div>
  );
}
