'use client';

/**
 * gourmet-food CartPage — F&B cart layout.
 * Hiển thị: danh sách items + tổng tiền + nút thanh toán.
 * Cart state từ Zustand (useCart).
 */

import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';
import { gourmetFoodTheme } from '../theme';
import type { ThemeConfig } from '../theme';
import { StorefrontHeader } from '../components/StorefrontHeader';
import { useCart } from '../../../lib/cart-store';

export interface CartPageProps {
  tenant: { slug: string; name: string; isConfigured: boolean };
  theme?: ThemeConfig;
  authSlot?: React.ReactNode;
}

export function GourmetFoodCartPage({ tenant, theme = gourmetFoodTheme, authSlot }: CartPageProps) {
  const router = useRouter();
  const c = theme.colors;
  const items = useCart(s => s.items);
  const updateQty = useCart(s => s.updateQty);
  const removeItem = useCart(s => s.removeItem);
  const total = useCart(s => s.total());
  const count = useCart(s => s.count());

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.background }}>
      <StorefrontHeader tenantName={tenant.name} tenantSlug={tenant.slug} isConfigured={tenant.isConfigured} theme={theme} authSlot={authSlot} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm mb-4 hover:opacity-70" style={{ color: c.mutedForeground }}>
          <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
        </button>

        <h1 className="text-xl font-bold mb-4" style={{ color: c.accent }}>
          Giỏ hàng ({count} sản phẩm)
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3" style={{ color: c.mutedForeground }} />
            <p style={{ color: c.mutedForeground }}>Giỏ hàng trống</p>
            <button
              onClick={() => router.push(`/shop/${tenant.slug}`)}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: c.primary, color: c.primaryForeground }}
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart items */}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{ backgroundColor: c.surface, borderColor: c.border }}
                >
                  {/* Image */}
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-md flex items-center justify-center" style={{ backgroundColor: c.muted }}>
                      <ShoppingBag className="h-6 w-6" style={{ color: c.mutedForeground }} />
                    </div>
                  )}

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate" style={{ color: c.accentForeground }}>{item.name}</h3>
                    <p className="text-sm" style={{ color: c.primary }}>{formatVND(item.price)}đ</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} className="p-1 rounded-full" style={{ backgroundColor: c.muted }}>
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium min-w-[1.5rem] text-center" style={{ color: c.accentForeground }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)} className="p-1 rounded-full" style={{ backgroundColor: c.muted }}>
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.productId)} className="p-2" style={{ color: c.destructive }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: c.surface, borderColor: c.border }}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm" style={{ color: c.mutedForeground }}>Tổng cộng:</span>
                <span className="text-xl font-bold" style={{ color: c.primary }}>{formatVND(total)}đ</span>
              </div>
              <button
                className="w-full py-3 rounded-lg font-medium"
                style={{ backgroundColor: c.primary, color: c.primaryForeground }}
                onClick={() => router.push(`/shop/${tenant.slug}/checkout`)}
              >
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatVND(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}
