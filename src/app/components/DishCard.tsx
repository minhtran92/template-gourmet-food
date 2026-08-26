'use client';

import { UtensilsCrossed } from 'lucide-react';
import type { ThemeConfig } from '../theme';

export interface Product {
  id: string;
  name: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  images?: string[];
  image?: string;
}

export interface DishCardProps {
  product: Product;
  theme: ThemeConfig;
  onClick?: (productId: string) => void;
}

export function DishCard({ product, theme, onClick }: DishCardProps) {
  const c = theme.colors;
  const price = product.price ?? product.minPrice ?? 0;
  const imageUrl = product.images?.[0] ?? product.image;
  const priceText = price > 0
    ? (product.maxPrice && product.maxPrice !== price
        ? `${formatVND(price)} - ${formatVND(product.maxPrice)}`
        : formatVND(price))
    : '';

  return (
    <div
      className="rounded-lg overflow-hidden border transition-shadow hover:shadow-lg cursor-pointer"
      style={{ backgroundColor: c.surface, borderColor: c.border }}
      onClick={() => onClick?.(product.id)}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={product.name} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 flex items-center justify-center" style={{ backgroundColor: c.muted }}>
          <UtensilsCrossed className="h-8 w-8" style={{ color: c.mutedForeground }} />
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium truncate" style={{ color: c.accentForeground }}>
          {product.name}
        </h3>
        {priceText && (
          <p className="mt-1 text-sm font-bold" style={{ color: c.primary }}>
            {priceText}đ
          </p>
        )}
      </div>
    </div>
  );
}

function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}
