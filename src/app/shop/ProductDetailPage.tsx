'use client';

/**
 * gourmet-food ProductDetailPage — F&B product detail layout.
 * Hiển thị: hình ảnh lớn + tên + giá + mô tả + nút "Thêm vào giỏ".
 * Fetch từ /api/pancake/[slug]/products/[id] (public).
 */

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { gourmetFoodTheme } from '../theme';
import type { ThemeConfig } from '../theme';

export interface ProductDetailPageProps {
  tenant: { slug: string; name: string; isConfigured: boolean };
  productId: string;
  theme?: ThemeConfig;
}

export function GourmetFoodProductDetailPage({ tenant, productId, theme = gourmetFoodTheme }: ProductDetailPageProps) {
  const [qty, setQty] = useState(1);
  const colors = theme.colors;

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', tenant.slug, productId],
    queryFn: async () => {
      const res = await fetch(`/api/pancake/${tenant.slug}/products/${productId}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.product ?? json.data?.product ?? json;
    },
    enabled: !!productId && tenant.isConfigured,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <p className="animate-pulse" style={{ color: colors.mutedForeground }}>Đang tải...</p>
    </div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <p style={{ color: colors.mutedForeground }}>Sản phẩm không tìm thấy.</p>
    </div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-10 backdrop-blur-sm"
        style={{ backgroundColor: `${colors.surface}F0`, borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => history.back()} style={{ color: colors.mutedForeground }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-medium" style={{ color: colors.accent }}>{tenant.name}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: colors.muted }}>
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-80 object-cover" />
            ) : (
              <div className="w-full h-80 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12" style={{ color: colors.mutedForeground }} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold" style={{ color: colors.accent }}>{product.name}</h1>
            {product.price > 0 && (
              <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                {new Intl.NumberFormat('vi-VN').format(product.price)}đ
              </p>
            )}
            {product.description && (
              <p className="text-sm" style={{ color: colors.mutedForeground }}>{product.description}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 rounded-full" style={{ backgroundColor: colors.muted }}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-medium text-lg" style={{ color: colors.accentForeground }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-2 rounded-full" style={{ backgroundColor: colors.muted }}>
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
            >
              <ShoppingCart className="h-5 w-5" />
              Thêm vào giỏ · {new Intl.NumberFormat('vi-VN').format((product.price || 0) * qty)}đ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
