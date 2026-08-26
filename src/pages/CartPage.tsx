/**
 * @g66/storefront-sdk — gourmet-food CartPage
 *
 * Phase 4 §4.4: 🟡 SHARED page — Cart composition for F&B storefronts.
 * Wraps CartDrawer pre-built component as a full page view with F&B-specific
 * customizations: Vietnamese labels, shipping estimate, promo code support,
 * and continue-shopping navigation.
 *
 * Uses CartDrawer (Layer 3) from SDK pre-built with F&B theming applied.
 *
 * @example
 * ```tsx
 * <CartPage
 *   onContinueShopping={() => router.push('/')}
 *   onCheckout={() => router.push('/checkout')}
 * />
 * ```
 */
'use client';

import React from 'react';
import { ShoppingBag, ArrowLeft, Tag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '../../../hooks/use-cart';
import { CartItemCard } from '../../../primitives/cart/CartItemCard';
import { CartSummary } from '../../../primitives/cart/CartSummary';
import { CartEmpty } from '../../../primitives/cart/CartEmpty';

// ─── Props ──────────────────────────────────────────────

export interface CartPageProps {
  /** Called when "Tiếp tục mua sắm" is clicked */
  onContinueShopping?: () => void;
  /** Called when "Thanh toán" is clicked */
  onCheckout?: () => void;
  /** Shipping estimate in VND */
  shippingEstimate?: number;
  /** Free shipping threshold in VND (e.g. 200000 = 200k VND) */
  freeShippingThreshold?: number;
  /** Section titles (Vietnamese defaults) */
  labels?: {
    title?: string;
    continueShopping?: string;
    checkout?: string;
    promoCode?: string;
    applyPromo?: string;
    shippingNote?: string;
    freeShippingNote?: string;
  };
  /** Additional CSS class */
  className?: string;
}

const DEFAULT_LABELS = {
  title: 'Giỏ hàng',
  continueShopping: 'Tiếp tục mua sắm',
  checkout: 'Thanh toán',
  promoCode: 'Mã giảm giá',
  applyPromo: 'Áp dụng',
  shippingNote: 'Phí giao hàng sẽ được tính lúc thanh toán',
  freeShippingNote: 'Miễn phí giao hàng cho đơn từ {threshold}₫',
};

// ─── Component ──────────────────────────────────────────

/**
 * CartPage — F&B full-page cart view with Vietnamese labels.
 *
 * Layout:
 *   Left (2/3): Cart items list or empty state
 *   Right (1/3): Order summary + promo code + shipping info + checkout CTA
 */
export function CartPage({
  onContinueShopping,
  onCheckout,
  shippingEstimate = 0,
  freeShippingThreshold = 200000,
  labels,
  className,
}: CartPageProps) {
  const lbl = { ...DEFAULT_LABELS, ...labels };
  const { items, couponCode, removeItem, updateQty, applyCoupon, removeCoupon, totalPrice, totalQty } = useCart();
  const [promoInput, setPromoInput] = React.useState('');

  const subtotal = totalPrice();
  const isEligibleForFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <div className={`px-4 md:px-8 py-8 max-w-7xl mx-auto ${className ?? ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-serif font-bold">{lbl.title}</h1>
          {items.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({totalQty()} sản phẩm)
            </span>
          )}
        </div>
        {onContinueShopping && (
          <Button variant="ghost" className="gap-1.5" onClick={onContinueShopping}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{lbl.continueShopping}</span>
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12!">
            <CartEmpty onCtaClick={onContinueShopping} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQtyChange={updateQty}
              />
            ))}
          </div>

          {/* Right: Order summary */}
          <div className="space-y-4">
            {/* Summary card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CartSummary
                  items={items}
                  couponCode={couponCode}
                  shippingEstimate={shippingEstimate}
                  onApplyCoupon={applyCoupon}
                  onRemoveCoupon={removeCoupon}
                />

                <Separator />

                {/* Promo code input */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-1.5 mb-2">
                    <Tag className="h-4 w-4" />
                    {lbl.promoCode}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && promoInput.trim()) {
                          applyCoupon(promoInput.trim());
                          setPromoInput('');
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (promoInput.trim()) {
                          applyCoupon(promoInput.trim());
                          setPromoInput('');
                        }
                      }}
                    >
                      {lbl.applyPromo}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Shipping info */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 mt-0.5 shrink-0" />
                  {isEligibleForFreeShipping ? (
                    <span className="text-primary font-medium">
                      {lbl.freeShippingNote.replace('{threshold}', freeShippingThreshold.toLocaleString('vi-VN'))}
                    </span>
                  ) : (
                    <span>{lbl.shippingNote}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Checkout button */}
            <Button size="lg" className="w-full" onClick={onCheckout}>
              {lbl.checkout}
            </Button>

            {/* Continue shopping */}
            {onContinueShopping && (
              <Button variant="outline" className="w-full" onClick={onContinueShopping}>
                {lbl.continueShopping}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
