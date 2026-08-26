'use client';

import { UtensilsCrossed } from 'lucide-react';
import type { ThemeConfig } from '../theme';

export interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
}

export interface DishCardProps {
  product: Product;
  theme: ThemeConfig;
  onClick?: (productId: string) => void;
}

export function DishCard({ product, theme, onClick }: DishCardProps) {
  const c = theme.colors;
  return (
    <div
      className="rounded-lg overflow-hidden border transition-shadow hover:shadow-lg cursor-pointer"
      style={{ backgroundColor: c.surface, borderColor: c.border }}
      onClick={() => onClick?.(product.id)}
    >
      {product.images?.[0] ? (
        <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 flex items-center justify-center" style={{ backgroundColor: c.muted }}>
          <UtensilsCrossed className="h-8 w-8" style={{ color: c.mutedForeground }} />
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium truncate" style={{ color: c.accentForeground }}>
          {product.name}
        </h3>
        {product.price > 0 && (
          <p className="mt-1 text-sm font-bold" style={{ color: c.primary }}>
            {new Intl.NumberFormat('vi-VN').format(product.price)}đ
          </p>
        )}
      </div>
    </div>
  );
}
