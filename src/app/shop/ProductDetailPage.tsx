'use client';

/**
 * gourmet-food ProductDetailPage — F&B product detail layout.
 * Hình ảnh lớn + tên + giá + mô tả + nút "Thêm vào giỏ".
 * Fetch từ /api/pancake/[slug]/products/[id] (public).
 */

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, Minus, ShoppingCart, UtensilsCrossed, Check } from 'lucide-react';
import { useState } from 'react';
import { gourmetFoodTheme } from '../theme';
import type { ThemeConfig } from '../theme';
import { StorefrontHeader } from '../components/StorefrontHeader';
import { useCart } from '../../../lib/cart-store';

export interface ProductDetailPageProps {
  tenant: { slug: string; name: string; isConfigured: boolean };
  productId: string;
  theme?: ThemeConfig;
  authSlot?: React.ReactNode;
}

interface ProductData {
  id: string;
  name: string;
  description?: string;
  minPrice?: number;
  maxPrice?: number;
  price?: number;
  images?: string[];
  image?: string;
  variants?: unknown[];
}

export function GourmetFoodProductDetailPage({ tenant, productId, theme = gourmetFoodTheme, authSlot }: ProductDetailPageProps) {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const c = theme.colors;
  const addItem = useCart(s => s.addItem);

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
    return (
      <div className="min-h-screen" style={{ backgroundColor: c.background }}>
        <StorefrontHeader tenantName={tenant.name} tenantSlug={tenant.slug} isConfigured={tenant.isConfigured} theme={theme} authSlot={authSlot} />
        <div className="flex items-center justify-center pt-20">
          <p className="animate-pulse" style={{ color: c.mutedForeground }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: c.background }}>
        <StorefrontHeader tenantName={tenant.name} tenantSlug={tenant.slug} isConfigured={tenant.isConfigured} theme={theme} authSlot={authSlot} />
        <div className="flex items-center justify-center pt-20">
          <p style={{ color: c.mutedForeground }}>Sản phẩm không tìm thấy.</p>
        </div>
      </div>
    );
  }

  const p = product as ProductData;
  const price = p.price ?? p.minPrice ?? 0;
  const maxPrice = p.maxPrice ?? price;
  const images = p.images?.length ? p.images : (p.image ? [p.image] : []);
  const priceText = price > 0
    ? (maxPrice !== price ? `${formatVND(price)} - ${formatVND(maxPrice)}` : formatVND(price))
    : 'Liên hệ';
  const totalText = price > 0 ? formatVND(price * qty) : '';

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.background }}>
      <StorefrontHeader tenantName={tenant.name} tenantSlug={tenant.slug} isConfigured={tenant.isConfigured} theme={theme} authSlot={authSlot} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => history.back()}
          className="flex items-center gap-1.5 text-sm mb-4 hover:opacity-70"
          style={{ color: c.mutedForeground }}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: c.muted }}>
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={p.name} className="w-full h-72 md:h-80 object-cover" />
              ) : (
                <div className="w-full h-72 md:h-80 flex items-center justify-center">
                  <UtensilsCrossed className="h-12 w-12" style={{ color: c.mutedForeground }} />
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="w-16 h-16 rounded-md overflow-hidden border-2"
                    style={{ borderColor: i === activeImage ? c.primary : c.border }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: c.accent }}>{p.name}</h1>

            <p className="text-2xl font-bold" style={{ color: c.primary }}>
              {priceText}{price > 0 && 'đ'}
            </p>

            {p.description && (
              <div className="text-sm leading-relaxed" style={{ color: c.mutedForeground }}>
                {p.description}
              </div>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium" style={{ color: c.accentForeground }}>Số lượng:</span>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="p-2 rounded-full"
                style={{ backgroundColor: c.muted }}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-medium text-lg min-w-[2rem] text-center" style={{ color: c.accentForeground }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="p-2 rounded-full"
                style={{ backgroundColor: c.muted }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: added ? c.accent : c.primary, color: c.primaryForeground }}
              onClick={() => {
                addItem({
                  productId: p.id,
                  name: p.name,
                  price: price,
                  image: images[0],
                }, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
            >
              {added ? <><Check className="h-5 w-5" /> Đã thêm!</> : <><ShoppingCart className="h-5 w-5" /> {totalText ? `Thêm vào giỏ · ${totalText}đ` : 'Thêm vào giỏ'}</>}
            </button>

            {/* Variants info */}
            {p.variants && p.variants.length > 0 && (
              <p className="text-xs" style={{ color: c.mutedForeground }}>
                {p.variants.length} biến thể khả dụng
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}
